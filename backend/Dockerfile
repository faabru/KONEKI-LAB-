FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# El contexto de build es la RAÍZ del repositorio (ver docker-compose.yml y Render).
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/schema.sql .
# Catálogo: fuente única de verdad, fuera de backend/. Queda en /app/content/catalogo.seed.json.
COPY content ./content

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
