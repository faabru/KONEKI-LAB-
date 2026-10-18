import { CircuitLine } from "./Decorativo.jsx";
import "../styles/components/proceso.css";

const PASOS = [
  { n: "01", titulo: "Consulta inicial", texto: "Nos contás qué necesitás y en qué punto está tu negocio." },
  { n: "02", titulo: "Relevamiento de necesidades", texto: "Revisamos qué información, contenidos y funciones hacen falta." },
  { n: "03", titulo: "Recomendación", texto: "Te proponemos la solución adecuada para tu caso." },
  { n: "04", titulo: "Presupuesto", texto: "Definimos alcance y presupuesto, acordados con vos." },
  { n: "05", titulo: "Desarrollo", texto: "Diseñamos y programamos, con avances durante el proceso." },
  { n: "06", titulo: "Publicación y entrega", texto: "Publicamos, revisamos juntos y entregamos lo acordado." },
  { n: "07", titulo: "Mantenimiento y mejoras", texto: "Seguimos disponibles para mantenimiento y ampliaciones." },
];

export default function Proceso() {
  return (
    <section className="section proceso" id="proceso" aria-labelledby="tit-proceso">
      <div className="bg-grid" aria-hidden="true" />
      <div className="container">
        <header className="section-head reveal">
          <p className="kicker">{"// PROCESO"}</p>
          <h2 id="tit-proceso" className="section-title">
            Cómo trabajamos
          </h2>
          <p className="section-lead">
            Un recorrido claro de principio a fin. Los tiempos se definen según el
            alcance acordado en cada proyecto.
          </p>
        </header>

        <ol className="proceso-linea">
          {PASOS.map((p) => (
            <li className="proceso-paso reveal" key={p.n}>
              <span className="proceso-nodo" aria-hidden="true">
                <span className="proceso-nodo-punto" />
              </span>
              <span className="proceso-num" aria-hidden="true">
                {p.n}
              </span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>

        <CircuitLine className="proceso-linea-decor" />
      </div>
    </section>
  );
}
