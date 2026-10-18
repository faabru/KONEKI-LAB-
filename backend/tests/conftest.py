import os
import pathlib

# Se configura ANTES de importar la app para que settings tome estos valores.
os.environ["DATABASE_URL"] = "sqlite:///./test_koneki.db"
os.environ["SEED_AUTOMATICO"] = "true"
os.environ["ENTORNO"] = "test"
os.environ["SMTP_HOST"] = ""
os.environ["RATE_LIMIT_SOLICITUDES"] = "5"
os.environ["RATE_LIMIT_VENTANA_SEG"] = "3600"

import pytest  # noqa: E402


@pytest.fixture(scope="session")
def ruta_db() -> pathlib.Path:
    ruta = pathlib.Path("test_koneki.db")
    if ruta.exists():
        ruta.unlink()
    yield ruta
    if ruta.exists():
        ruta.unlink()


@pytest.fixture(scope="session")
def client(ruta_db):
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def limpiar_rate_limit():
    yield
    from app.security import get_solicitudes_limiter

    get_solicitudes_limiter().limpiar()


@pytest.fixture()
def db():
    from app.database import SessionLocal

    sesion = SessionLocal()
    try:
        yield sesion
    finally:
        sesion.close()


SOLICITUD_VALIDA = {
    "nombre_negocio": "Barbería Centro",
    "rubro": "Barbería",
    "solucion": "pagina_web",
    "necesidad": "Queremos una página para mostrar servicios, precios y turnos.",
    "presupuesto_orientativo": "$300.000",
    "nombre_contacto": "Martín",
    "email": "martin@ejemplo.com",
    "telefono": "+54 9 11 5555 4444",
    "acepta_contacto": True,
    "website": "",
}
