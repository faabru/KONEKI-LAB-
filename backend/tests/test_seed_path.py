from pathlib import Path

from app.seed import RUTA_SEED, _cargar_json


def test_ruta_seed_existe():
    assert isinstance(RUTA_SEED, Path)
    assert RUTA_SEED.is_file(), f"No se encontró el catálogo en {RUTA_SEED}"


def test_seed_json_estructura():
    datos = _cargar_json()
    assert "categorias" in datos
    assert len(datos["categorias"]) == 5
    assert "faqs" in datos
