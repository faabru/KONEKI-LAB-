def _por_slug(categorias, slug):
    for c in categorias:
        if c["slug"] == slug:
            return c
    raise AssertionError(f"Falta la categoría {slug}")


def _plan(categoria, slug):
    for p in categoria["planes"]:
        if p["slug"] == slug:
            return p
    raise AssertionError(f"Falta el plan {slug}")


def test_catalogo_estructura(client):
    r = client.get("/api/catalogo")
    assert r.status_code == 200
    datos = r.json()
    assert "categorias" in datos
    assert len(datos["categorias"]) == 5


def test_precios_paginas_web(client):
    cats = client.get("/api/catalogo").json()["categorias"]
    cat = _por_slug(cats, "paginas-web")
    assert _plan(cat, "paginas-web-basico")["precio_ars"] == 200000
    assert _plan(cat, "paginas-web-profesional")["precio_ars"] == 400000
    assert _plan(cat, "paginas-web-basico")["items"], "El plan básico debe tener ítems"


def test_precios_cartas_digitales(client):
    cats = client.get("/api/catalogo").json()["categorias"]
    cat = _por_slug(cats, "cartas-digitales")
    assert _plan(cat, "cartas-basico")["precio_ars"] == 150000
    assert _plan(cat, "cartas-moderado")["precio_ars"] == 200000
    assert _plan(cat, "cartas-premium")["precio_ars"] == 300000
    assert len(cat["extras"]) == 5
    assert _plan(cat, "cartas-premium")["precio_ars"] == 300000


def test_extras_cartas(client):
    cats = client.get("/api/catalogo").json()["categorias"]
    cat = _por_slug(cats, "cartas-digitales")
    extras = {e["slug"]: e for e in cat["extras"]}
    assert extras["extra-actualizar-precios"]["precio_ars"] == 10000
    assert extras["extra-ampliaciones"]["precio_ars"] is None


def test_a_medida_sin_precio_fijo(client):
    cats = client.get("/api/catalogo").json()["categorias"]
    cat = _por_slug(cats, "aplicaciones-web")
    plan = _plan(cat, "aplicaciones-a-medida")
    assert plan["precio_ars"] is None
    assert plan["etiqueta_precio"] == "A cotizar"


def test_mantenimiento(client):
    cats = client.get("/api/catalogo").json()["categorias"]
    cat = _por_slug(cats, "mantenimiento")
    assert _plan(cat, "mantenimiento-estatica")["precio_ars"] == 10000
    assert _plan(cat, "mantenimiento-aplicacion")["precio_ars"] == 40000
    assert _plan(cat, "mantenimiento-estatica")["etiqueta_precio"] == "ARS · mensuales"


def test_videos_contenido(client):
    cats = client.get("/api/catalogo").json()["categorias"]
    cat = _por_slug(cats, "videos-contenido")
    assert cat["tipo_precio"] == "a_cotizar"
    assert _plan(cat, "videos-a-cotizar")["precio_ars"] is None
