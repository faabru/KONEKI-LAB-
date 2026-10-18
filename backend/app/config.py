from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "Koneki X Lab API"
    entorno: str = "desarrollo"

    # SQLite por defecto para poder correr sin MySQL.
    # Producción (MySQL): mysql+pymysql://usuario:clave@host:3306/koneki_lab
    database_url: str = "sqlite:///./koneki.db"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Solicitudes de presupuesto
    rate_limit_solicitudes: int = 5
    rate_limit_ventana_seg: int = 3600

    # SMTP opcional (si está vacío, no se envía ningún correo)
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    smtp_to: str = ""
    smtp_tls: bool = True

    # Carga automática de content/catalogo.seed.json al arrancar (si las tablas están vacías)
    seed_automatico: bool = True

    @property
    def origins_lista(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
