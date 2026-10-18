from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ..config import get_settings
from ..database import get_db
from ..mail import enviar_aviso_solicitud, smtp_configurado
from ..models import Solicitud
from ..schemas import SolicitudEntrada, SolicitudSalida
from ..security import RateLimitExcedido, get_solicitudes_limiter

router = APIRouter(tags=["solicitudes"])


def _ip_del_cliente(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "desconocida"


@router.post(
    "/solicitudes",
    status_code=status.HTTP_201_CREATED,
    response_model=SolicitudSalida,
)
def crear_solicitud(
    datos: SolicitudEntrada,
    request: Request,
    db: Session = Depends(get_db),
):
    # Honeypot: si el campo oculto tiene contenido, respondemos OK sin guardar
    # para no delatar a los bots.
    if datos.website:
        return SolicitudSalida(
            id=0,
            creada_en="",
            nombre_negocio=datos.nombre_negocio,
            rubro=datos.rubro,
            solucion=datos.solucion,
            estado="nueva",
        )

    ip = _ip_del_cliente(request)
    try:
        get_solicitudes_limiter().revisar(ip)
    except RateLimitExcedido as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
        ) from exc

    solicitud = Solicitud(
        nombre_negocio=datos.nombre_negocio,
        rubro=datos.rubro,
        solucion=datos.solucion,
        necesidad=datos.necesidad,
        presupuesto_orientativo=datos.presupuesto_orientativo,
        nombre_contacto=datos.nombre_contacto,
        email=datos.email,
        telefono=datos.telefono,
        acepta_contacto=datos.acepta_contacto,
        plan_referencia=datos.plan_referencia,
        categoria_referencia=datos.categoria_referencia,
        origen_ip=ip,
    )
    db.add(solicitud)
    db.commit()
    db.refresh(solicitud)

    # Aviso opcional por SMTP (si no está configurado, no se envía nada)
    if smtp_configurado():
        cuerpo = "\n".join(
            [
                f"Nueva solicitud #{solicitud.id}",
                f"Negocio: {solicitud.nombre_negocio} ({solicitud.rubro})",
                f"Solución: {solicitud.solucion}",
                f"Necesidad: {solicitud.necesidad}",
                f"Presupuesto orientativo: {solicitud.presupuesto_orientativo or '-'}",
                f"Contacto: {solicitud.nombre_contacto or '-'}",
                f"Email: {solicitud.email or '-'}",
                f"Teléfono: {solicitud.telefono or '-'}",
                f"Plan de referencia: {solicitud.plan_referencia or '-'}",
            ]
        )
        enviar_aviso_solicitud(
            f"Koneki X Lab · solicitud de {solicitud.nombre_negocio}", cuerpo
        )

    return SolicitudSalida(
        id=solicitud.id,
        creada_en=solicitud.creada_en.isoformat() if solicitud.creada_en else "",
        nombre_negocio=solicitud.nombre_negocio,
        rubro=solicitud.rubro,
        solucion=solicitud.solucion,
        estado=solicitud.estado,
        plan_referencia=solicitud.plan_referencia,
        categoria_referencia=solicitud.categoria_referencia,
        email=solicitud.email,
        telefono=solicitud.telefono,
    )
