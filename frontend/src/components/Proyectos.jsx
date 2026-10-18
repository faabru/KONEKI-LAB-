import { useResource } from "../hooks/useResource.js";
import { FALLBACK_PROYECTOS } from "../data/fallback.js";
import "../styles/components/proyectos.css";

export default function Proyectos() {
  const { data } = useResource("/api/proyectos", FALLBACK_PROYECTOS);
  const proyectos = (Array.isArray(data) ? data : data?.proyectos || [])
    .filter((p) => p.publicado)
    .slice()
    .sort((a, b) => a.orden - b.orden);

  return (
    <section className="section proyectos" id="proyectos" aria-labelledby="tit-proyectos">
      <div className="bg-glow" aria-hidden="true" />
      <div className="container">
        <header className="section-head reveal">
          <p className="kicker">{"// PROYECTOS"}</p>
          <h2 id="tit-proyectos" className="section-title">
            Trabajos realizados
          </h2>
          <p className="section-lead">
            Cada proyecto se identifica como trabajo real o como demostración, para que
            sepas exactamente qué estás viendo.
          </p>
        </header>

        {proyectos.length > 0 ? (
          <div className="proyectos-grid">
            {proyectos.map((p) => (
              <article className="card proyecto-card reveal" key={p.slug}>
                <div className="proyecto-media">
                  {p.imagen ? (
                    <img
                      src={p.imagen}
                      alt={p.titulo}
                      loading="lazy"
                      width="640"
                      height="400"
                    />
                  ) : (
                    <div className="proyecto-media-fallback" aria-hidden="true">
                      <span className="ascii-code">75 79 78 69 75 73 32 88 32 76 65 66</span>
                    </div>
                  )}
                </div>
                <div className="proyecto-body">
                  <span className={`chip ${p.tipo === "real" ? "chip-real" : ""}`}>
                    {p.tipo === "real" ? "Proyecto real" : "Demostración"}
                  </span>
                  <h3>{p.titulo}</h3>
                  {p.rubro && <p className="proyecto-rubro">{p.rubro}</p>}
                  <p className="proyecto-desc">{p.descripcion}</p>
                  {p.url && (
                    <a
                      className="btn btn-tertiary proyecto-link"
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver proyecto
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="proyectos-vacio reveal" role="status">
            <span className="proyectos-vacio-icono" aria-hidden="true">
              {"</>"}
            </span>
            <h3>No hay proyectos publicados todavía</h3>
            <p>
              Este espacio se carga desde el catálogo (tabla <code>proyectos</code>).
              Mientras no haya trabajos publicados, mostramos este estado en lugar de
              ejemplos inventados.
            </p>
            <a className="btn btn-primary" href="#contacto">
              Solicitar presupuesto
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
