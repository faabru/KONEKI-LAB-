from fastapi import APIRouter

from ..config import get_settings

router = APIRouter(tags=["salud"])


@router.get("/health")
def health():
    s = get_settings()
    return {"estado": "ok", "app": s.app_name, "entorno": s.entorno}
