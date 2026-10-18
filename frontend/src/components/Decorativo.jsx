import "../styles/components/decorativo.css";

export function SectionHead({ kicker, titulo, lead, id }) {
  return (
    <header className="section-head reveal">
      <p className="kicker">{kicker}</p>
      <h2 id={id} className="section-title">
        {titulo}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}

/**
 * Línea de circuito con nodos (trazos finos con giros y círculos en los extremos).
 * Decorativa: no aporta significado, se oculta de lectores de pantalla.
 */
export function CircuitLine({ invertido = false, className = "" }) {
  return (
    <svg
      className={`circuit-line ${className}`}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={invertido ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M0 20 H260 L300 8 H620 L660 32 H1200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="260" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="660" cy="32" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle className="node-pulse" cx="620" cy="8" r="3.5" fill="#e83c3c" />
    </svg>
  );
}

/**
 * Motivo decorativo: nombre vertical apilado con la X roja en banda
 * y el bloque rojo con LAB (referencia: koneki_lab_diseno_4.png).
 */
export function VerticalName({ className = "" }) {
  return (
    <div className={`vname ${className}`} aria-hidden="true">
      {["K", "O", "N", "E", "K", "I"].map((l, i) => (
        <span key={`${l}-${i}`} className="vname-letter">
          {l}
        </span>
      ))}
      <span className="vname-x">X</span>
      <span className="vname-lab">LAB</span>
    </div>
  );
}
