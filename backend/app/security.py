import time
from collections import defaultdict, deque

from .config import get_settings


class RateLimitExcedido(Exception):
    pass


class RateLimiter:
    """Límite de intentos en memoria (por proceso), sin dependencias externas."""

    def __init__(self, maximo: int, ventana_seg: int):
        self.maximo = maximo
        self.ventana_seg = ventana_seg
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def revisar(self, clave: str) -> None:
        ahora = time.monotonic()
        cola = self._hits[clave]
        while cola and ahora - cola[0] > self.ventana_seg:
            cola.popleft()
        if len(cola) >= self.maximo:
            raise RateLimitExcedido(
                f"Demasiadas solicitudes. Intentá de nuevo más tarde."
            )
        cola.append(ahora)

    def limpiar(self) -> None:
        self._hits.clear()


_solicitudes_limiter: RateLimiter | None = None


def get_solicitudes_limiter() -> RateLimiter:
    global _solicitudes_limiter
    if _solicitudes_limiter is None:
        s = get_settings()
        _solicitudes_limiter = RateLimiter(
            s.rate_limit_solicitudes, s.rate_limit_ventana_seg
        )
    return _solicitudes_limiter
