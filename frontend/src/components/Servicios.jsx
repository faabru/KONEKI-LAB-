import "../styles/components/servicios.css";

const ICONOS = {
  pagina: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="26" height="20" rx="3" />
      <path d="M3 11h26" />
      <circle cx="7.5" cy="8" r="1.2" fill="#e83c3c" stroke="none" />
      <circle cx="11.5" cy="8" r="1.2" opacity=".6" />
      <circle cx="15.5" cy="8" r="1.2" opacity=".6" />
      <path d="M9 17h8M9 21h14" strokeLinecap="round" />
    </svg>
  ),
  carta: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="9" y="3" width="14" height="26" rx="3" />
      <path d="M13 8h6M13 13h6M13 18h4" strokeLinecap="round" />
      <path d="M19.5 24.5h4.5v4.5" stroke="#e83c3c" />
      <path d="M24 24.5 19.5 29" stroke="#e83c3c" strokeLinecap="round" />
    </svg>
  ),
  app: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="6" width="26" height="18" rx="3" />
      <path d="M3 12h26" />
      <circle cx="7" cy="9" r="1.1" fill="#e83c3c" stroke="none" />
      <path d="M12 17.5 10 19.5l2 2M19 17.5l2 2-2 2M17 16l-3 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 28h10" strokeLinecap="round" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="7" width="19" height="18" rx="3" />
      <path d="M22 13.5 29 9v14l-7-4.5z" strokeLinejoin="round" />
      <path d="M11 13.5v5l4.5-2.5z" fill="#e83c3c" stroke="none" />
    </svg>
  ),
  mantenimiento: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M21.5 5.5a7 7 0 0 0-9 9L5 23l4 4 8.5-7.5a7 7 0 0 0 9-9l-4.2 4.2-3.8-1-1-3.8z" strokeLinejoin="round" />
      <circle cx="7.5" cy="24.5" r="1.4" fill="#e83c3c" stroke="none" />
    </svg>
  ),
};

const SERVICIOS = [
  {
    slug: "paginas-web",
    icono: "pagina",
    titulo: "Páginas web",
    texto: "Sitios informativos para presentar tu negocio, tus servicios y tus datos de contacto con claridad.",
    destino: "#planes",
    cta: "Ver planes",
  },
  {
    slug: "cartas-digitales",
    icono: "carta",
    titulo: "Cartas digitales",
    texto: "Menús digitales accesibles desde un código QR, desde la carta estática hasta una con panel de administración.",
    destino: "#planes",
    cta: "Ver planes",
  },
  {
    slug: "aplicaciones-web",
    icono: "app",
    titulo: "Aplicaciones y sistemas a medida",
    texto: "Sistemas de gestión para turnos, pedidos, inventario, ventas u otros procesos de tu negocio.",
    destino: "#planes",
    cta: "Ver cómo se cotiza",
  },
  {
    slug: "videos-contenido",
    icono: "video",
    titulo: "Videos y contenido",
    texto: "Videos publicitarios y contenido digital para redes, cotizados según duración, edición, recursos y alcance.",
    destino: "#contacto",
    cta: "Consultar",
  },
  {
    slug: "mantenimiento",
    icono: "mantenimiento",
    titulo: "Mantenimiento",
    texto: "Actualización y cuidado mensual de tu sitio o aplicación, con tareas y límites definidos con cada cliente.",
    destino: "#planes",
    cta: "Ver referencia",
  },
];

export default function Servicios() {
  return (
    <section className="section servicios" id="servicios" aria-labelledby="tit-servicios">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />
      <div className="container">
        <header className="section-head reveal">
          <p className="kicker">{"// SERVICIOS"}</p>
          <h2 id="tit-servicios" className="section-title">
            Soluciones digitales para tu negocio
          </h2>
          <p className="section-lead">
            Elegí según lo que tu negocio necesita hoy. Si no sabés por dónde empezar,
            contanos tu caso y lo vemos juntos.
          </p>
        </header>

        <div className="servicios-grid">
          {SERVICIOS.map((s) => (
            <article className="card servicio-card reveal" key={s.slug}>
              <span className="servicio-icono" aria-hidden="true">
                {ICONOS[s.icono]}
              </span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
              <a className="btn btn-tertiary servicio-link" href={s.destino}>
                {s.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="servicios-cta reveal">
          <a className="btn btn-secondary" href="#informacion">
            Conocer los servicios
          </a>
        </div>
      </div>
    </section>
  );
}
