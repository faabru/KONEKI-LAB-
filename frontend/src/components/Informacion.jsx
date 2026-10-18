import { useResource } from "../hooks/useResource.js";
import { FALLBACK_VIDEOS } from "../data/fallback.js";
import VideoSlot from "./VideoSlot.jsx";
import { BrowserMock, PhoneMock, CodeCard, BarrasEjemplo } from "./Maquetas.jsx";
import { CircuitLine, VerticalName } from "./Decorativo.jsx";
import "../styles/components/informacion.css";

const GUIA = [
  {
    q: "¿Querés que te encuentren y que se vea qué ofrecés?",
    r: "Una página web informativa es el punto de partida: presenta tu negocio, tus servicios y tus formas de contacto.",
    plan: "Páginas web",
    href: "#planes",
  },
  {
    q: "¿Tenés un restaurante o comercio y querés mostrar tu menú desde un código QR?",
    r: "Una carta digital resuelve eso, desde la versión estática hasta una con panel para editar los platos.",
    plan: "Cartas digitales",
    href: "#planes",
  },
  {
    q: "¿Necesitás gestionar turnos, pedidos, inventario, ventas u otro proceso?",
    r: "Ahí conviene una aplicación o sistema a medida: se releva lo que necesitás y se cotiza según el alcance.",
    plan: "Aplicaciones y sistemas",
    href: "#planes",
  },
  {
    q: "¿No sabés qué necesitás todavía?",
    r: "Contanos tu caso en el formulario o por WhatsApp. La primera consulta sirve para orientarte, sin compromiso.",
    plan: "Contacto",
    href: "#contacto",
  },
];

const FACTORES = [
  {
    titulo: "La cantidad de secciones y contenidos",
    texto: "Más secciones, imágenes y material propio implican más trabajo de diseño y carga.",
  },
  {
    titulo: "Las funcionalidades que incluye",
    texto: "Un panel de administración, exportación a PDF o un modo claro y oscuro son desarrollos concretos, no se suman solos.",
  },
  {
    titulo: "Si es un plan definido o un sistema a medida",
    texto: "Los planes publicados tienen alcance escrito. Un sistema a medida se releva y se cotiza aparte.",
  },
  {
    titulo: "El material audiovisual y las piezas gráficas",
    texto: "Los videos y diseños para redes se incluyen según el alcance acordado en cada plan o proyecto.",
  },
  {
    titulo: "Los servicios externos",
    texto: "Dominio, alojamiento, Google Maps y otros servicios de terceros se presupuestan por separado cuando corresponde.",
  },
];

export default function Informacion() {
  const { data: videos } = useResource("/api/videos", FALLBACK_VIDEOS);
  const listaVideos = (Array.isArray(videos) ? videos : videos?.videos || [])
    .slice()
    .sort((a, b) => a.orden - b.orden);

  return (
    <section className="section informacion" id="informacion" aria-labelledby="tit-informacion">
      <div className="bg-grid" aria-hidden="true" />
      <div className="container">
        <header className="section-head reveal">
          <p className="kicker">{"// INFORMACIÓN"}</p>
          <h2 id="tit-informacion" className="section-title">
            Entender antes de decidir
          </h2>
          <p className="section-lead">
            Te explicamos en lenguaje simple qué es cada cosa y qué conviene según lo
            que tu negocio necesita. Sin vueltas y sin promesas mágicas.
          </p>
        </header>

        {/* Qué es una página web */}
        <article className="info-bloque reveal">
          <div className="info-texto">
            <p className="kicker">{"// QUÉ ES UNA PÁGINA WEB"}</p>
            <h3>Tu lugar propio en internet</h3>
            <p>
              Una página web es como tu local, pero abierto en internet todo el día y
              accesible desde cualquier lugar. Es la información de tu negocio,
              ordenada y a mano: quién sos, qué ofrecés, cómo contactarte. Se ve bien
              en computadora y se adapta al celular.
            </p>
            <p>
              Suele tener una página de inicio, una sección de servicios, una galería
              para mostrar tu trabajo, la ubicación y un contacto directo por WhatsApp,
              teléfono o formulario.
            </p>
            <ul className="check-list">
              <li>Mejor presencia digital: información clara cuando te buscan.</li>
              <li>Profesionalismo: se nota que cuidás los detalles.</li>
              <li>Consultas más simples: el cliente resuelve dudas básicas antes de escribirte.</li>
            </ul>
            <p className="info-nota">
              Una web es una herramienta para presentar tu negocio con claridad. No
              garantiza resultados por sí sola: te da una base propia, ordenada y
              profesional.
            </p>
          </div>
          <div className="info-visual">
            <BrowserMock titulo="Tu negocio, online." />
            <PhoneMock />
          </div>
        </article>

        <CircuitLine />

        {/* Qué es una aplicación web */}
        <article className="info-bloque info-bloque-invertido reveal">
          <div className="info-texto">
            <p className="kicker">{"// QUÉ ES UNA APLICACIÓN WEB"}</p>
            <h3>Una web que también resuelve tareas</h3>
            <p>
              Una aplicación web no solo muestra información: hace cosas. Sirve para
              gestionar turnos, tomar pedidos, llevar un inventario, registrar ventas
              o administrar procesos de tu negocio desde el navegador, sin instalar
              nada.
            </p>
            <p>
              Puede tener panel de administración, base de datos y usuarios, siempre
              que esas funciones estén contempladas en el proyecto acordado.
            </p>
            <div className="info-codigo">
              <CodeCard />
            </div>
          </div>
          <div className="info-aside">
            <VerticalName className="info-vname" />
          </div>
        </article>

        <CircuitLine invertido />

        {/* Comparación estática vs aplicación */}
        <article className="info-comparacion reveal">
          <p className="kicker">{"// COMPARACIÓN"}</p>
          <h3>Página estática vs. aplicación web</h3>
          <div className="comparacion-grid">
            <div className="card comparacion-col">
              <span className="chip">Página web estática</span>
              <ul className="check-list">
                <li>Presenta el negocio, servicios y contacto.</li>
                <li>Contenido definido que cambia poco.</li>
                <li>Ideal para mostrarte y ser encontrable.</li>
                <li>Alcance claro y precio de referencia publicado.</li>
              </ul>
            </div>
            <div className="card comparacion-col">
              <span className="chip">Aplicación web</span>
              <ul className="check-list">
                <li>Gestiona tareas: turnos, pedidos, inventario.</li>
                <li>Contenido y datos que cambian a diario.</li>
                <li>Ideal para trabajar mejor por dentro.</li>
                <li>Se releva y se cotiza según el alcance.</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Guía rápida */}
        <article className="info-guia reveal">
          <p className="kicker">{"// GUÍA RÁPIDA"}</p>
          <h3>¿Qué necesito?</h3>
          <ol className="guia-lista">
            {GUIA.map((g, i) => (
              <li key={g.plan}>
                <span className="guia-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <strong>{g.q}</strong>
                  <p>{g.r}</p>
                  <a className="btn btn-tertiary guia-link" href={g.href}>
                    {g.plan}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </article>

        {/* Factores de precio y plazos */}
        <article className="info-factores reveal">
          <p className="kicker">{"// PRECIO Y PLAZOS"}</p>
          <h3>Qué factores afectan el precio y los plazos</h3>
          <div className="factores-grid">
            {FACTORES.map((f) => (
              <div className="factor" key={f.titulo}>
                <h4>{f.titulo}</h4>
                <p>{f.texto}</p>
              </div>
            ))}
            <div className="factor factor-visual">
              <BarrasEjemplo />
              <p>
                Los tiempos se definen según el alcance acordado en cada proyecto, no
                con plazos genéricos.
              </p>
            </div>
          </div>
        </article>

        {/* Videos explicativos */}
        <article className="info-videos" aria-labelledby="tit-videos">
          <div className="reveal">
            <p className="kicker">{"// VIDEOS EXPLICATIVOS"}</p>
            <h3 id="tit-videos">Aprender a tu ritmo</h3>
            <p className="section-lead">
              Videos cortos para entender qué es una página web, qué es una aplicación
              y cómo puede ayudarte en tu caso.
            </p>
          </div>
          <div className="videos-grid">
            {listaVideos.length > 0 ? (
              listaVideos.map((v) => <VideoSlot key={v.slug} video={v} />)
            ) : (
              <VideoSlot video={{ titulo: "Videos explicativos", descripcion: "" }} />
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
