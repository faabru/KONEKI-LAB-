def test_faqs_publicadas(client):
    r = client.get("/api/faqs")
    assert r.status_code == 200
    faqs = r.json()["faqs"]
    assert len(faqs) == 8
    assert all(f["publicada"] for f in faqs)
    assert faqs[0]["slug"] == "precios-referencia"
    orden = [f["orden"] for f in faqs]
    assert orden == sorted(orden)


def test_videos_seed(client):
    r = client.get("/api/videos")
    assert r.status_code == 200
    videos = r.json()["videos"]
    assert len(videos) == 4
    # Ningún video tiene archivo todavía: el frontend muestra "Próximamente"
    assert all(v["archivo_o_url"] is None for v in videos)
    assert all(v["publicado"] is False for v in videos)


def test_proyectos_vacios(client):
    r = client.get("/api/proyectos")
    assert r.status_code == 200
    assert r.json()["proyectos"] == []
