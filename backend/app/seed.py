import json
import os
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Categoria, Extra, Faq, Plan, PlanItem, Proyecto, Video

# content/catalogo.seed.json es la fuente única de verdad.
#
# La ubicación del archivo depende del layout de ejecución:
#   - Local / docker-compose: backend/app/seed.py  ->  backend/app  ->  parents[2] = raíz del repo
#   - Contenedor (Render):    /app/app/seed.py     ->  /app/app     ->  parents[1] = /app
# Se prioriza la variable de entorno SEED_PATH para poder forzar una ruta explícita.
def _resolver_ruta_seed() -> Path:
    override = os.getenv("SEED_PATH")
    if override:
        return Path(override)

    candidatos = [
        # Contenedor: /app/content/catalogo.seed.json (ver Dockerfile)
        Path(__file__).resolve().parents[1] / "content" / "catalogo.seed.json",
        # Raíz del repo: content/catalogo.seed.json
        Path(__file__).resolve().parents[2] / "content" / "catalogo.seed.json",
    ]
    for ruta in candidatos:
        if ruta.is_file():
            return ruta
    # Si no existe ninguno, se devuelve el primero para que el error sea explícito.
    return candidatos[0]


RUTA_SEED = _resolver_ruta_seed()


def _cargar_json() -> dict:
    if not RUTA_SEED.is_file():
        raise FileNotFoundError(
            f"No se encontró el catálogo en {RUTA_SEED}. "
            "Definí SEED_PATH o verificá que content/catalogo.seed.json "
            "se copie en la imagen (ver Dockerfile)."
        )
    with open(RUTA_SEED, encoding="utf-8") as f:
        return json.load(f)


def hay_contenido(db: Session) -> bool:
    return db.scalar(select(Categoria.id).limit(1)) is not None


def aplicar_seed(db: Session, forzar: bool = False) -> dict:
    """Carga (o recarga) el catálogo desde content/catalogo.seed.json."""
    if hay_contenido(db) and not forzar:
        return {"cargado": False, "motivo": "ya_hay_contenido"}

    if forzar:
        for modelo in (Extra, PlanItem, Plan, Categoria, Faq, Proyecto, Video):
            db.query(modelo).delete()
        db.flush()

    datos = _cargar_json()

    for cat in datos.get("categorias", []):
        categoria = Categoria(
            slug=cat["slug"],
            titulo=cat["titulo"],
            descripcion=cat.get("descripcion", ""),
            orden=cat.get("orden", 0),
            tipo_precio=cat.get("tipo_precio", "fijo"),
        )
        db.add(categoria)
        db.flush()

        for plan in cat.get("planes", []):
            p = Plan(
                categoria_id=categoria.id,
                slug=plan["slug"],
                nombre=plan["nombre"],
                precio_ars=plan.get("precio_ars"),
                precio_usd=plan.get("precio_usd"),
                etiqueta_precio=plan.get("etiqueta_precio"),
                descripcion=plan.get("descripcion", ""),
                orden=plan.get("orden", 0),
                activo=plan.get("activo", True),
            )
            db.add(p)
            db.flush()
            for item in plan.get("items", []):
                db.add(
                    PlanItem(plan_id=p.id, texto=item["texto"], orden=item.get("orden", 0))
                )

        for extra in cat.get("extras", []):
            db.add(
                Extra(
                    categoria_id=categoria.id,
                    slug=extra["slug"],
                    nombre=extra["nombre"],
                    descripcion=extra.get("descripcion", ""),
                    precio_ars=extra.get("precio_ars"),
                    precio_usd=extra.get("precio_usd"),
                    nota=extra.get("nota", ""),
                    orden=extra.get("orden", 0),
                )
            )

    for faq in datos.get("faqs", []):
        db.add(
            Faq(
                slug=faq["slug"],
                pregunta=faq["pregunta"],
                respuesta=faq["respuesta"],
                orden=faq.get("orden", 0),
                publicada=faq.get("publicada", True),
            )
        )

    for proy in datos.get("proyectos", []):
        db.add(
            Proyecto(
                slug=proy["slug"],
                titulo=proy["titulo"],
                rubro=proy.get("rubro", ""),
                descripcion=proy.get("descripcion", ""),
                tipo=proy.get("tipo", "demo"),
                imagen=proy.get("imagen"),
                url=proy.get("url"),
                orden=proy.get("orden", 0),
                publicado=proy.get("publicado", False),
            )
        )

    for vid in datos.get("videos", []):
        db.add(
            Video(
                slug=vid["slug"],
                titulo=vid["titulo"],
                descripcion=vid.get("descripcion", ""),
                archivo_o_url=vid.get("archivo_o_url"),
                publicado=vid.get("publicado", False),
                orden=vid.get("orden", 0),
            )
        )

    db.commit()
    return {"cargado": True, "categorias": len(datos.get("categorias", []))}


def seed_si_vacio(db: Session) -> dict:
    from .config import get_settings

    if not get_settings().seed_automatico:
        return {"cargado": False, "motivo": "seed_automatico_desactivado"}
    return aplicar_seed(db, forzar=False)
