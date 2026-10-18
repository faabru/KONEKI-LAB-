# Koneki X Lab · Sitio web comercial

Sitio comercial de **Koneki X Lab** (páginas web, cartas digitales, aplicaciones a
medida, video y contenido, mantenimiento) con catálogo de precios en pesos
argentinos, formulario de solicitudes de presupuesto y contenido editorial
explicativo.

| Pieza | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8, React Router, react-helmet-async |
| Backend | FastAPI + SQLAlchemy 2 + Pydantic |
| Base de datos | MySQL 8 (producción) o SQLite (desarrollo sin Docker) |
| Contenido | `content/catalogo.seed.json` (fuente única de verdad) |

No hay panel de administración: la consulta de solicitudes se hace por CLI.

---

## Estructura

```
├── content/
│   └── catalogo.seed.json    # Catálogo, FAQs, proyectos y videos (fuente única)
├── frontend/                 # SPA React (Vite)
│   ├── public/assets/        # Video hero, póster y logos
│   └── src/                  # Componentes, estilos, hooks y utilidades
├── backend/
│   ├── app/                  # API FastAPI (routers, modelos, seed, CLI)
│   ├── schema.sql            # Esquema MySQL versionado (sin Alembic)
│   ├── tests/                # Tests con pytest
│   └── requirements.txt
├── docker-compose.yml        # Opción con Docker (MySQL + API)
└── README.md
```

---

## Requisitos

- **Node.js** 20+ (probado con v24) y npm
- **Python** 3.11+ (probado con 3.14)
- Opcional: **Docker** con Compose para levantar MySQL sin instalarlo

---

## Puesta en marcha (sin Docker)

### 1. Frontend

```powershell
cd frontend
npm install
npm run dev          # http://localhost:5173
```

En desarrollo no hace falta configurar nada: Vite hace de proxy hacia
`http://127.0.0.1:8000` para `/api/*`, y si la API no está disponible el sitio
muestra el contenido de respaldo del seed.

### 2. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows
pip install -r requirements.txt
copy .env.example .env            # SQLite queda como base por defecto
python -m uvicorn app.main:app --reload --port 8000
```

Al arrancar: crea las tablas y carga `content/catalogo.seed.json` si la base
está vacía. Docs interactivas en <http://127.0.0.1:8000/api/docs>.

Linux/macOS: activar el entorno con `source .venv/bin/activate`.

---

## Puesta en marcha con Docker (MySQL + API)

```powershell
docker compose up --build
```

- MySQL 8 en `localhost:3306` (base `koneki_lab`, usuario `koneki`)
- API en <http://127.0.0.1:8000>

Con la API arriba, el frontend en `npm run dev` la usa automáticamente por el
proxy. Para producción, construí el frontend (`npm run build`) y serví
`frontend/dist` desde cualquier servidor estático, apuntando
`VITE_API_URL` a la API.

---

## Variables de entorno

### Frontend (`frontend/.env`)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL de la API en producción. Vacío en dev (usa proxy). Vacío en prod → el sitio funciona con el contenido de respaldo. |
| `VITE_WHATSAPP_NUMBER` | Solo dígitos con código de país (ej. `5491122334455`). Si está vacío o inválido **no se muestra el botón de WhatsApp**. |
| `VITE_CONTACT_EMAIL` | Correo de contacto. Si está vacío o inválido **no se muestra el botón de correo**. |

Ver `frontend/.env.example`.

### Backend (`backend/.env`)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Por defecto `sqlite:///./koneki.db`. MySQL: `mysql+pymysql://user:pass@host:3306/koneki_lab?charset=utf8mb4` |
| `CORS_ORIGINS` | Orígenes permitidos, separados por coma |
| `RATE_LIMIT_SOLICITUDES` / `RATE_LIMIT_VENTANA_SEG` | Límite de solicitudes por IP (defecto: 5 por hora) |
| `SEED_AUTOMATICO` | Carga el seed al arrancar si las tablas están vacías (`true`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_TO`, `SMTP_TLS` | SMTP **opcional**. Si `SMTP_HOST` está vacío no se envía ningún correo: la solicitud se guarda igual. |

Ver `backend/.env.example`.

---

## Contenido: fuente única

`content/catalogo.seed.json` es la única fuente de verdad del catálogo:

- Precios y planes (ej.: páginas web $200.000 / $400.000 ARS)
- Extras, FAQs, proyectos y videos explicativos

Flujo de cambios de contenido:

1. Editar el JSON.
2. Recargar en la base: `python -m app.cli seed --force` (borra y recarga).
3. En desarrollo sin backend, el frontend usa el JSON como respaldo.

---

## Comandos útiles

```powershell
# Frontend
cd frontend
npm run dev        # desarrollo
npm run build      # build de producción
npm run lint       # linter (oxlint)
npm run preview    # sirve el build

# Backend
cd backend
python -m pytest   # tests (20)
python -m app.cli seed --force           # recarga el catálogo
python -m app.cli solicitudes listar     # últimas solicitudes
python -m app.cli solicitudes ver <id>   # detalle de una solicitud
```

---

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servicio |
| GET | `/api/catalogo` | Categorías, planes, ítems y extras |
| GET | `/api/faqs` | Preguntas frecuentes publicadas |
| GET | `/api/videos` | Videos explicativos |
| GET | `/api/proyectos` | Proyectos publicados |
| POST | `/api/solicitudes` | Alta de solicitud de presupuesto |

El formulario de contacto incluye honeypot (campo oculto `website`: los bots
reciben respuesta OK pero no se guarda nada) y rate limit por IP en memoria
(respuesta `429` al superar el límite).

---

## Decisiones y pendientes conocidos

- **Sin Alembic**: las tablas se crean con `create_all` al arrancar y el esquema
  queda versionado en `backend/schema.sql`. Si el proyecto crece, incorporar
  migraciones.
- **Sin panel de administración**: las solicitudes se consultan por CLI.
- **Proyectos**: la sección tiene estado vacío editable; los proyectos se cargan
  en `proyectos` del seed/publicados desde la base.
- **Videos**: los 4 videos del seed están en `publicado: false` sin archivo
  todavía; la UI muestra «Próximamente». Para publicarlos, subir el archivo y
  actualizar `archivo_o_url` + `publicado`.
- **Dominio y alojamiento**: se presupuestan aparte (quedó declarado en el
  contenido, no se inventan precios).
