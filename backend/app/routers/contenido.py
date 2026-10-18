from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Categoria, Faq, Plan, Proyecto, Video

router = APIRouter(tags=["contenido"])


def _categoria_a_dict(c: Categoria) -> dict:
    return {
        "slug": c.slug,
        "titulo": c.titulo,
        "descripcion": c.descripcion,
        "orden": c.orden,
        "tipo_precio": c.tipo_precio,
        "planes": [
            {
                "slug": p.slug,
                "nombre": p.nombre,
                "precio_ars": p.precio_ars,
                "etiqueta_precio": p.etiqueta_precio,
                "descripcion": p.descripcion,
                "orden": p.orden,
                "activo": p.activo,
                "items": [{"texto": i.texto, "orden": i.orden} for i in p.items],
            }
            for p in c.planes
        ],
        "extras": [
            {
                "slug": e.slug,
                "nombre": e.nombre,
                "descripcion": e.descripcion,
                "precio_ars": e.precio_ars,
                "nota": e.nota,
                "orden": e.orden,
            }
            for e in c.extras
        ],
    }


@router.get("/catalogo")
def catalogo(db: Session = Depends(get_db)):
    categorias = db.scalars(
        select(Categoria)
        .options(selectinload(Categoria.planes).selectinload(Plan.items))
        .options(selectinload(Categoria.extras))
        .order_by(Categoria.orden)
    ).all()
    return {"categorias": [_categoria_a_dict(c) for c in categorias]}


@router.get("/faqs")
def faqs(db: Session = Depends(get_db)):
    filas = db.scalars(
        select(Faq).where(Faq.publicada.is_(True)).order_by(Faq.orden)
    ).all()
    return {
        "faqs": [
            {
                "slug": f.slug,
                "pregunta": f.pregunta,
                "respuesta": f.respuesta,
                "orden": f.orden,
                "publicada": f.publicada,
            }
            for f in filas
        ]
    }


@router.get("/videos")
def videos(db: Session = Depends(get_db)):
    filas = db.scalars(select(Video).order_by(Video.orden)).all()
    return {
        "videos": [
            {
                "slug": v.slug,
                "titulo": v.titulo,
                "descripcion": v.descripcion,
                "archivo_o_url": v.archivo_o_url,
                "publicado": v.publicado,
                "orden": v.orden,
            }
            for v in filas
        ]
    }


@router.get("/proyectos")
def proyectos(db: Session = Depends(get_db)):
    filas = db.scalars(
        select(Proyecto)
        .where(Proyecto.publicado.is_(True))
        .order_by(Proyecto.orden)
    ).all()
    return {
        "proyectos": [
            {
                "slug": p.slug,
                "titulo": p.titulo,
                "rubro": p.rubro,
                "descripcion": p.descripcion,
                "tipo": p.tipo,
                "imagen": p.imagen,
                "url": p.url,
                "orden": p.orden,
                "publicado": p.publicado,
            }
            for p in filas
        ]
    }
