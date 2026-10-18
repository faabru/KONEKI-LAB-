from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

Solucion = Literal[
    "pagina_web",
    "carta_digital",
    "aplicacion_web",
    "video_contenido",
    "mantenimiento",
    "no_se",
]

LIMITE_NECESIDAD = 1000


class SolicitudEntrada(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre_negocio: str = Field(min_length=1, max_length=120)
    rubro: str = Field(min_length=1, max_length=120)
    solucion: Solucion
    necesidad: str = Field(min_length=1, max_length=LIMITE_NECESIDAD)
    presupuesto_orientativo: str | None = Field(default=None, max_length=80)
    nombre_contacto: str | None = Field(default=None, max_length=120)
    email: str | None = Field(default=None, max_length=254)
    telefono: str | None = Field(default=None, max_length=40)
    acepta_contacto: bool = False
    website: str = ""  # honeypot: debe quedar vacío
    plan_referencia: str | None = Field(default=None, max_length=120)
    categoria_referencia: str | None = Field(default=None, max_length=80)

    @field_validator("email")
    @classmethod
    def email_valido(cls, v: str | None) -> str | None:
        if not v:
            return None
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Correo electrónico inválido")
        return v

    @field_validator("telefono")
    @classmethod
    def telefono_valido(cls, v: str | None) -> str | None:
        if not v:
            return None
        digitos = "".join(c for c in v if c.isdigit() or c == "+")
        if len(digitos) < 6:
            raise ValueError("Teléfono inválido")
        return v

    @field_validator("acepta_contacto")
    @classmethod
    def debe_aceptar(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Debés aceptar que te contactemos")
        return v

    @model_validator(mode="after")
    def al_menos_un_medio_de_contacto(self):
        if not self.email and not self.telefono:
            raise ValueError("Dejanos al menos un medio de contacto: correo o teléfono")
        return self


class SolicitudSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    creada_en: str
    nombre_negocio: str
    rubro: str
    solucion: str
    estado: str
    plan_referencia: str | None = None
    categoria_referencia: str | None = None
    email: str | None = None
    telefono: str | None = None
