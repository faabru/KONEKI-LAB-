from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    titulo: Mapped[str] = mapped_column(String(120))
    descripcion: Mapped[str] = mapped_column(Text, default="")
    orden: Mapped[int] = mapped_column(Integer, default=0)
    tipo_precio: Mapped[str] = mapped_column(String(30), default="fijo")

    planes: Mapped[list["Plan"]] = relationship(
        back_populates="categoria",
        cascade="all, delete-orphan",
        order_by="Plan.orden",
    )
    extras: Mapped[list["Extra"]] = relationship(
        back_populates="categoria",
        cascade="all, delete-orphan",
        order_by="Extra.orden",
    )


class Plan(Base):
    __tablename__ = "planes"

    id: Mapped[int] = mapped_column(primary_key=True)
    categoria_id: Mapped[int] = mapped_column(
        ForeignKey("categorias.id", ondelete="CASCADE"), index=True
    )
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    nombre: Mapped[str] = mapped_column(String(120))
    precio_ars: Mapped[int | None] = mapped_column(Integer, nullable=True)
    etiqueta_precio: Mapped[str | None] = mapped_column(String(80), nullable=True)
    descripcion: Mapped[str] = mapped_column(Text, default="")
    orden: Mapped[int] = mapped_column(Integer, default=0)
    activo: Mapped[bool] = mapped_column(default=True)

    categoria: Mapped["Categoria"] = relationship(back_populates="planes")
    items: Mapped[list["PlanItem"]] = relationship(
        back_populates="plan",
        cascade="all, delete-orphan",
        order_by="PlanItem.orden",
    )


class PlanItem(Base):
    __tablename__ = "plan_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    plan_id: Mapped[int] = mapped_column(
        ForeignKey("planes.id", ondelete="CASCADE"), index=True
    )
    texto: Mapped[str] = mapped_column(Text)
    orden: Mapped[int] = mapped_column(Integer, default=0)

    plan: Mapped["Plan"] = relationship(back_populates="items")


class Extra(Base):
    __tablename__ = "extras"

    id: Mapped[int] = mapped_column(primary_key=True)
    categoria_id: Mapped[int] = mapped_column(
        ForeignKey("categorias.id", ondelete="CASCADE"), index=True
    )
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    nombre: Mapped[str] = mapped_column(String(160))
    descripcion: Mapped[str] = mapped_column(Text, default="")
    precio_ars: Mapped[int | None] = mapped_column(Integer, nullable=True)
    nota: Mapped[str] = mapped_column(Text, default="")
    orden: Mapped[int] = mapped_column(Integer, default=0)

    categoria: Mapped["Categoria"] = relationship(back_populates="extras")


class Faq(Base):
    __tablename__ = "faqs"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    pregunta: Mapped[str] = mapped_column(Text)
    respuesta: Mapped[str] = mapped_column(Text)
    orden: Mapped[int] = mapped_column(Integer, default=0)
    publicada: Mapped[bool] = mapped_column(default=True)


class Proyecto(Base):
    __tablename__ = "proyectos"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    titulo: Mapped[str] = mapped_column(String(160))
    rubro: Mapped[str] = mapped_column(String(120), default="")
    descripcion: Mapped[str] = mapped_column(Text, default="")
    tipo: Mapped[str] = mapped_column(String(20), default="demo")  # real | demo
    imagen: Mapped[str | None] = mapped_column(String(300), nullable=True)
    url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    orden: Mapped[int] = mapped_column(Integer, default=0)
    publicado: Mapped[bool] = mapped_column(default=False)


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    titulo: Mapped[str] = mapped_column(String(160))
    descripcion: Mapped[str] = mapped_column(Text, default="")
    archivo_o_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    publicado: Mapped[bool] = mapped_column(default=False)
    orden: Mapped[int] = mapped_column(Integer, default=0)


class Solicitud(Base):
    __tablename__ = "solicitudes"

    id: Mapped[int] = mapped_column(primary_key=True)
    creada_en: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), index=True
    )
    nombre_negocio: Mapped[str] = mapped_column(String(120))
    rubro: Mapped[str] = mapped_column(String(120))
    solucion: Mapped[str] = mapped_column(String(40))
    necesidad: Mapped[str] = mapped_column(Text)
    presupuesto_orientativo: Mapped[str | None] = mapped_column(String(80), nullable=True)
    nombre_contacto: Mapped[str | None] = mapped_column(String(120), nullable=True)
    email: Mapped[str | None] = mapped_column(String(254), nullable=True)
    telefono: Mapped[str | None] = mapped_column(String(40), nullable=True)
    acepta_contacto: Mapped[bool] = mapped_column(default=False)
    plan_referencia: Mapped[str | None] = mapped_column(String(120), nullable=True)
    categoria_referencia: Mapped[str | None] = mapped_column(String(80), nullable=True)
    estado: Mapped[str] = mapped_column(String(20), default="nueva")
    origen_ip: Mapped[str | None] = mapped_column(String(60), nullable=True)
