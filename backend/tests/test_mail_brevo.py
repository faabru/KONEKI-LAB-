"""Tests de la integración con Brevo, sin peticiones reales.

Se parchea urllib.request.urlopen y las settings para no depender de una
API key real ni de la red.
"""

import io
import json
import urllib.error

from app import mail


class _Resp:
    def __init__(self, status=201, body=b"{}"):
        self.status = status
        self._body = body

    def read(self):
        return self._body

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def _settings(monkeypatch, **valores):
    from app.config import get_settings

    base = get_settings()
    for k, v in valores.items():
        monkeypatch.setattr(base, k, v, raising=False)
    return base


def test_brevo_no_configurado_no_envia(monkeypatch):
    _settings(monkeypatch, brevo_api_key="", brevo_sender_email="")
    assert mail.brevo_configurado() is False

    llamado = {"n": 0}

    def fake_urlopen(*a, **k):
        llamado["n"] += 1
        raise AssertionError("no debería llamarse")

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)
    assert mail.enviar_aviso_brevo("Asunto", {"nombre_negocio": "X"}) is False
    assert llamado["n"] == 0


def test_brevo_envio_exitoso(monkeypatch):
    _settings(
        monkeypatch,
        brevo_api_key="clave-falsa",
        brevo_sender_email="remitente@ejemplo.com",
        brevo_sender_name="Koneki X Lab",
        brevo_recipient_email="destino@ejemplo.com",
    )
    capturado = {}

    def fake_urlopen(req, timeout=None):
        capturado["url"] = req.full_url
        capturado["method"] = req.get_method()
        capturado["api_key"] = req.get_header("Api-key")
        capturado["timeout"] = timeout
        capturado["data"] = json.loads(req.data.decode("utf-8"))
        return _Resp(status=201)

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)

    ok = mail.enviar_aviso_brevo(
        "Nueva solicitud de contacto — Koneki X Lab",
        {"nombre_negocio": "Barbería Centro", "email": "cliente@ejemplo.com"},
    )

    assert ok is True
    assert capturado["url"] == mail.BREVO_URL
    assert capturado["method"] == "POST"
    assert capturado["timeout"] == 10
    assert capturado["data"]["to"] == [{"email": "destino@ejemplo.com"}]
    assert capturado["data"]["sender"]["email"] == "remitente@ejemplo.com"


def test_brevo_escapa_html(monkeypatch):
    _settings(
        monkeypatch,
        brevo_api_key="clave-falsa",
        brevo_sender_email="remitente@ejemplo.com",
        brevo_recipient_email="destino@ejemplo.com",
    )
    capturado = {}

    def fake_urlopen(req, timeout=None):
        capturado["data"] = json.loads(req.data.decode("utf-8"))
        return _Resp(status=201)

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)
    mail.enviar_aviso_brevo("Asunto", {"necesidad": "<script>alert(1)</script>"})

    assert "<script>" not in capturado["data"]["htmlContent"]
    assert "&lt;script&gt;" in capturado["data"]["htmlContent"]


def test_brevo_http_error_devuelve_false(monkeypatch):
    _settings(
        monkeypatch,
        brevo_api_key="clave-falsa",
        brevo_sender_email="remitente@ejemplo.com",
        brevo_recipient_email="destino@ejemplo.com",
    )

    def fake_urlopen(req, timeout=None):
        raise urllib.error.HTTPError(
            mail.BREVO_URL, 401, "Unauthorized", {}, io.BytesIO(b"bad key")
        )

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)
    assert mail.enviar_aviso_brevo("Asunto", {"nombre_negocio": "X"}) is False


def test_brevo_timeout_devuelve_false(monkeypatch):
    _settings(
        monkeypatch,
        brevo_api_key="clave-falsa",
        brevo_sender_email="remitente@ejemplo.com",
        brevo_recipient_email="destino@ejemplo.com",
    )

    def fake_urlopen(req, timeout=None):
        raise TimeoutError("timeout simulado")

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)
    assert mail.enviar_aviso_brevo("Asunto", {"nombre_negocio": "X"}) is False
