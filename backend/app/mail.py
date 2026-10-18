import logging
import smtplib
from email.message import EmailMessage

from .config import get_settings

log = logging.getLogger("koneki.mail")


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
