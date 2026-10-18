"""CLI de Koneki X Lab (sin panel de administración).

Uso:
    python -m app.cli seed [--force]
    python -m app.cli solicitudes listar [--limite N]
    python -m app.cli solicitudes ver <id>
"""

import argparse
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from .database import Base, SessionLocal, engine
from .models import Solicitud
from .seed import aplicar_seed


def cmd_seed(args: argparse.Namespace) -> int:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        resultado = aplicar_seed(db, forzar=args.force)
    print(resultado)
    return 0


def cmd_solicitudes_listar(args: argparse.Namespace) -> int:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        filas = (
            db.query(Solicitud)
            .order_by(Solicitud.creada_en.desc())
            .limit(args.limite)
            .all()
        )
        if not filas:
            print("No hay solicitudes registradas.")
            return 0
        print(
            f"{'ID':>4}  {'FECHA':<19}  {'NEGOCIO':<28}  {'SOLUCIÓN':<16}  ESTADO"
        )
        print("-" * 90)
        for s in filas:
            fecha = s.creada_en.strftime("%Y-%m-%d %H:%M:%S") if s.creada_en else "-"
            print(
                f"{s.id:>4}  {fecha:<19}  {s.nombre_negocio[:28]:<28}  "
                f"{s.solucion:<16}  {s.estado}"
            )
    return 0


def cmd_solicitudes_ver(args: argparse.Namespace) -> int:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        s = db.get(Solicitud, args.id)
        if not s:
            print(f"No existe la solicitud #{args.id}")
            return 1
        print(f"Solicitud #{s.id} · {s.estado}")
        print(f"Creada: {s.creada_en}")
        print(f"Negocio: {s.nombre_negocio} ({s.rubro})")
        print(f"Solución: {s.solucion}")
        print(f"Necesidad: {s.necesidad}")
        print(f"Presupuesto orientativo: {s.presupuesto_orientativo or '-'}")
        print(f"Contacto: {s.nombre_contacto or '-'}")
        print(f"Email: {s.email or '-'}")
        print(f"Teléfono: {s.telefono or '-'}")
        print(f"Plan de referencia: {s.plan_referencia or '-'}")
        print(f"Categoría de referencia: {s.categoria_referencia or '-'}")
        print(f"IP de origen: {s.origen_ip or '-'}")
    return 0


def construir_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="python -m app.cli", description=__doc__)
    sub = parser.add_subparsers(dest="comando", required=True)

    p_seed = sub.add_parser("seed", help="Carga content/catalogo.seed.json en la base")
    p_seed.add_argument(
        "--force",
        action="store_true",
        help="Borra el contenido actual del catálogo y lo recarga",
    )
    p_seed.set_defaults(func=cmd_seed)

    p_sol = sub.add_parser("solicitudes", help="Consulta de solicitudes de presupuesto")
    sub_sol = p_sol.add_subparsers(dest="subcomando", required=True)

    p_listar = sub_sol.add_parser("listar", help="Últimas solicitudes")
    p_listar.add_argument("--limite", type=int, default=20)
    p_listar.set_defaults(func=cmd_solicitudes_listar)

    p_ver = sub_sol.add_parser("ver", help="Detalle de una solicitud")
    p_ver.add_argument("id", type=int)
    p_ver.set_defaults(func=cmd_solicitudes_ver)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = construir_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
