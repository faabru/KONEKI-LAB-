-- Koneki X Lab · esquema MySQL (versionado, sin Alembic)
--
-- La aplicación crea las tablas automáticamente con SQLAlchemy (create_all)
-- al arrancar. Este archivo queda como referencia/versionado y para carga
-- manual si se prefiere:
--
--   mysql -u usuario -p koneki_lab < schema.sql
--
-- Charset utf8mb4 para soportar tildes y ñ sin problemas.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS categorias (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(80) NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    descripcion TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    tipo_precio VARCHAR(30) NOT NULL DEFAULT 'fijo',
    PRIMARY KEY (id),
    UNIQUE KEY uq_categorias_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS planes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    categoria_id INT UNSIGNED NOT NULL,
    slug VARCHAR(80) NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    precio_ars INT NULL,
    precio_usd INT NULL,
    etiqueta_precio VARCHAR(80) NULL,
    descripcion TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_planes_slug (slug),
    KEY idx_planes_categoria (categoria_id),
    CONSTRAINT fk_planes_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plan_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    plan_id INT UNSIGNED NOT NULL,
    texto TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_plan_items_plan (plan_id),
    CONSTRAINT fk_plan_items_plan
        FOREIGN KEY (plan_id) REFERENCES planes (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS extras (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    categoria_id INT UNSIGNED NOT NULL,
    slug VARCHAR(80) NOT NULL,
    nombre VARCHAR(160) NOT NULL,
    descripcion TEXT NOT NULL,
    precio_ars INT NULL,
    precio_usd INT NULL,
    nota TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_extras_slug (slug),
    KEY idx_extras_categoria (categoria_id),
    CONSTRAINT fk_extras_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(80) NOT NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    publicada TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_faqs_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyectos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(80) NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    rubro VARCHAR(120) NOT NULL DEFAULT '',
    descripcion TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'demo',
    imagen VARCHAR(300) NULL,
    url VARCHAR(300) NULL,
    orden INT NOT NULL DEFAULT 0,
    publicado TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_proyectos_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS videos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(80) NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    descripcion TEXT NOT NULL,
    archivo_o_url VARCHAR(300) NULL,
    publicado TINYINT(1) NOT NULL DEFAULT 0,
    orden INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_videos_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS solicitudes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre_negocio VARCHAR(120) NOT NULL,
    rubro VARCHAR(120) NOT NULL,
    solucion VARCHAR(40) NOT NULL,
    necesidad TEXT NOT NULL,
    presupuesto_orientativo VARCHAR(80) NULL,
    nombre_contacto VARCHAR(120) NULL,
    email VARCHAR(254) NULL,
    telefono VARCHAR(40) NULL,
    acepta_contacto TINYINT(1) NOT NULL DEFAULT 0,
    plan_referencia VARCHAR(120) NULL,
    categoria_referencia VARCHAR(80) NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'nueva',
    origen_ip VARCHAR(60) NULL,
    PRIMARY KEY (id),
    KEY idx_solicitudes_creada_en (creada_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
