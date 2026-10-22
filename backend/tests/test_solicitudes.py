from .conftest import SOLICITUD_VALIDA


def _count(db):
    from app.models import Solicitud

    return db.query(Solicitud).count()


def test_solicitud_valida(client, db):
    r = client.post("/api/solicitudes", json=SOLICITUD_VALIDA)
    assert r.status_code == 201, r.text
    datos = r.json()
    assert datos["id"] > 0
    assert datos["estado"] == "nueva"
    assert datos["nombre_negocio"] == "Barbería Centro"


def test_honeypot_no_guarda(client, db):
    antes = _count(db)
    payload = {**SOLICITUD_VALIDA, "website": "http://spam.example"}
    r = client.post("/api/solicitudes", json=payload)
    # Responde OK para no delatar al bot…
    assert r.status_code == 201
    # …pero no guarda nada.
    assert _count(db) == antes


def test_falta_acepta_contacto(client):
    payload = {**SOLICITUD_VALIDA, "acepta_contacto": False}
    r = client.post("/api/solicitudes", json=payload)
    assert r.status_code == 422


def test_email_invalido(client):
    payload = {**SOLICITUD_VALIDA, "email": "no-es-un-correo"}
    r = client.post("/api/solicitudes", json=payload)
    assert r.status_code == 422


def test_sin_medio_de_contacto(client):
    payload = {**SOLICITUD_VALIDA, "email": None, "telefono": None}
    r = client.post("/api/solicitudes", json=payload)
    assert r.status_code == 422


def test_necesidad_demasiado_larga(client):
    payload = {**SOLICITUD_VALIDA, "necesidad": "x" * 1001}
    r = client.post("/api/solicitudes", json=payload)
    assert r.status_code == 422


def test_solucion_invalida(client):
    payload = {**SOLICITUD_VALIDA, "solucion": "otra_cosa"}
    r = client.post("/api/solicitudes", json=payload)
    assert r.status_code == 422


def test_campos_obligatorios(client):
    r = client.post("/api/solicitudes", json={})
    assert r.status_code == 422


def test_rate_limit(client, db):
    # El límite es 5 por ventana (ver conftest): el sexto intento falla.
    for i in range(5):
        payload = {**SOLICITUD_VALIDA, "email": f"cliente{i}@ejemplo.com"}
        r = client.post("/api/solicitudes", json=payload)
        assert r.status_code == 201, f"intento {i}: {r.status_code}"

    r = client.post("/api/solicitudes", json=SOLICITUD_VALIDA)
    assert r.status_code == 429


def test_fallo_brevo_no_duplica_ni_borra(client, db, monkeypatch):
    """Si Brevo falla, el endpoint sigue respondiendo 201 y la solicitud
    queda guardada una sola vez."""
    from app import mail
    from app.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s, "brevo_api_key", "clave-falsa", raising=False)
    monkeypatch.setattr(s, "brevo_sender_email", "remitente@ejemplo.com", raising=False)
    monkeypatch.setattr(s, "brevo_recipient_email", "destino@ejemplo.com", raising=False)

    def fake_urlopen(*a, **k):
        raise TimeoutError("timeout simulado")

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(s, "smtp_host", "", raising=False)

    antes = _count(db)
    r = client.post("/api/solicitudes", json=SOLICITUD_VALIDA)
    assert r.status_code == 201, r.text
    assert r.json()["id"] > 0
    assert _count(db) == antes + 1


def test_exito_brevo_mantiene_contrato(client, db, monkeypatch):
    """Con Brevo configurado y OK, la respuesta mantiene el mismo contrato."""
    from app import mail
    from app.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s, "brevo_api_key", "clave-falsa", raising=False)
    monkeypatch.setattr(s, "brevo_sender_email", "remitente@ejemplo.com", raising=False)
    monkeypatch.setattr(s, "brevo_recipient_email", "destino@ejemplo.com", raising=False)

    def fake_urlopen(req, timeout=None):
        class _R:
            status = 201

            def read(self):
                return b"{}"

            def __enter__(self):
                return self

            def __exit__(self, *a):
                return False

        return _R()

    monkeypatch.setattr(mail.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(s, "smtp_host", "", raising=False)

    antes = _count(db)
    r = client.post("/api/solicitudes", json=SOLICITUD_VALIDA)
    assert r.status_code == 201, r.text
    datos = r.json()
    assert set(["id", "creada_en", "nombre_negocio", "estado"]).issubset(datos)
    assert _count(db) == antes + 1
