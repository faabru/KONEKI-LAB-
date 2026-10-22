import json
import logging
import smtplib
import urllib.error
import urllib.request
from email.message import EmailMessage
from html import escape

from .config import get_settings

log = logging.getLogger("koneki.mail")

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


def smtp_configurado() -> bool:
    s = get_settings()
    return bool(s.smtp_host and s.smtp_from and s.smtp_to)


def enviar_aviso_solicitud(asunto: str, cuerpo: str) -> bool:
    """Envía un aviso por SMTP. Devuelve False si no está configurado o falla.

    Nunca levanta excepciones: la solicitud ya quedó guardada en la base,
    el correo es un aviso adicional.
    """
    s = get_settings()
    if not smtp_configurado():
        return False
    try:
        msg = EmailMessage()
        msg["From"] = s.smtp_from
        msg["To"] = s.smtp_to
        msg["Subject"] = asunto
        msg.set_content(cuerpo)

        with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=15) as server:
            if s.smtp_tls:
                server.starttls()
            if s.smtp_user and s.smtp_password:
                server.login(s.smtp_user, s.smtp_password)
            server.send_message(msg)
        return True
    except Exception:
        log.exception("No se pudo enviar el aviso por SMTP")
        return False


def brevo_configurado() -> bool:
    """True solo si hay API key, remitente y destinatario configurados."""
    s = get_settings()
    return bool(s.brevo_api_key and s.brevo_sender_email and s.brevo_recipient_email)


def _brevo_payload(asunto: str, html: str, texto: str) -> bytes:
    s = get_settings()
    # El destinatario sale SIEMPRE de la configuración, nunca del formulario:
    # así el formulario no puede usarse como relay hacia direcciones arbitrarias.
    payload = {
        "sender": {"email": s.brevo_sender_email, "name": s.brevo_sender_name},
        "to": [{"email": s.brevo_recipient_email}],
        "subject": asunto,
        "htmlContent": html,
        "textContent": texto,
    }
    return json.dumps(payload).encode("utf-8")


def enviar_aviso_brevo(asunto: str, campos: dict[str, str]) -> bool:
    """Envía el aviso de una solicitud por la API transaccional de Brevo.

    Devuelve True solo si Brevo acepta la petición. Nunca levanta excepciones
    ni revela la API key: si falla, se registra de forma segura y se devuelve
    False (la solicitud ya quedó guardada en la base).

    `campos` viene del formulario; se escapan todos los valores para evitar
    inyección de HTML en el correo.
    """
    if not brevo_configurado():
        return False

    s = get_settings()
    if not s.brevo_recipient_email:
        log.error("Brevo sin destinatario configurado (BREVO_RECIPIENT_EMAIL): no se envía")
        return False

    etiquetas = {
        "nombre_negocio": "Negocio",
        "rubro": "Rubro",
        "solucion": "Solución",
        "necesidad": "Necesidad",
        "presupuesto_orientativo": "Presupuesto orientativo",
        "nombre_contacto": "Contacto",
        "email": "Email",
        "telefono": "Teléfono",
        "plan_referencia": "Plan de referencia",
        "categoria_referencia": "Categoría de referencia",
        "id": "ID de solicitud",
        "creada_en": "Fecha",
    }

    filas_texto = []
    filas_html = []
    for clave, etiqueta in etiquetas.items():
        valor = campos.get(clave)
        if valor is None or valor == "":
            continue
        valor_str = str(valor)
        filas_texto.append(f"{etiqueta}: {valor_str}")
        filas_html.append(
            "<tr>"
            f'<td style="padding:4px 12px 4px 0;font-weight:bold">{escape(etiqueta)}</td>'
            f'<td style="padding:4px 0">{escape(valor_str)}</td>'
            "</tr>"
        )

    texto = "\n".join(filas_texto)
    html = (
        "<h2>Nueva solicitud de contacto — Koneki X Lab</h2>"
        '<table role="presentation" cellspacing="0" cellpadding="0">'
        + "".join(filas_html)
        + "</table>"
    )

    s = get_settings()
    if not s.brevo_recipient_email:
        log.error("Brevo sin destinatario configurado (BREVO_RECIPIENT_EMAIL): no se envía")
        return False

    req = urllib.request.Request(
        BREVO_URL,
        data=_brevo_payload(asunto, html, texto),
        method="POST",
        headers={
            "api-key": s.brevo_api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=s.brevo_timeout_seg) as resp:
            return 200 <= resp.status < 300
    except urllib.error.HTTPError as exc:
        # No se registra el cuerpo (podría contener datos del proveedor) ni la key.
        log.error("Brevo rechazó el envío (HTTP %s)", exc.code)
        return False
    except Exception:
        # Timeout, DNS, red, etc. Se registra el tipo de error, sin secretos.
        log.exception("No se pudo enviar el aviso por Brevo")
        return False
