import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Categoria, Extra, Faq, Plan, PlanItem, Proyecto, Video

# content/catalogo.seed.json es la fuente única de verdad (relativo a backend/)
RUTA_SEED = Path(__file__).resolve().parents[2] / "content" / "catalogo.seed.json"


def _cargar_json() -> dict:
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
