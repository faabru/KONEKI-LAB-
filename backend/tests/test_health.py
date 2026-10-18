def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    datos = r.json()
    assert datos["estado"] == "ok"
    assert datos["app"] == "Koneki X Lab API"
