import "../styles/components/maquetas.css";

/** Ventana de navegador con puntos (el primero rojo). */
export function BrowserMock({ titulo = "Tu negocio, online.", children }) {
  return (
    <div className="mock-browser" aria-hidden="true">
      <div className="mock-bar">
        <span className="mock-dot mock-dot-red" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-url">tunegocio.com</span>
      </div>
      <div className="mock-body">
        <div className="mock-nav">
          <b>NEGOCIO</b>
          <span>Inicio</span>
          <span>Servicios</span>
          <span>Contacto</span>
        </div>
        <div className="mock-hero">
          <strong>{titulo}</strong>
          <p>Presentación · Servicios · Ubicación · Contacto</p>
          <em>Ejemplo ilustrativo</em>
        </div>
        <div className="mock-grid">
          <span />
          <span />
          <span />
        </div>
        {children}
      </div>
    </div>
  );
}

/** Celular con panel lateral. */
export function PhoneMock({ children }) {
  return (
    <div className="mock-phone" aria-hidden="true">
      <div className="mock-phone-screen">
        <div className="mock-nav mock-nav-phone">
          <b>NEGOCIO</b>
          <span aria-hidden="true">☰</span>
        </div>
        <div className="mock-hero mock-hero-phone">
          <strong>Desde el celular</strong>
          <p>Servicios · Horarios · Contacto</p>
          <em>Ejemplo ilustrativo</em>
        </div>
        <div className="mock-list">
          <span className="mock-row">
            <i /> <u />
          </span>
          <span className="mock-row">
            <i /> <u />
          </span>
          <span className="mock-row">
            <i /> <u />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Tarjeta de código en Space Mono con sintaxis crema/rojo/gris. */
export function CodeCard() {
  return (
    <div className="mock-code" aria-hidden="true">
      <div className="mock-bar">
        <span className="mock-dot mock-dot-red" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-url">index.html</span>
      </div>
      <pre className="mock-code-body">
        <code>
          <span className="tok-mut">{"<!-- página de tu negocio -->"}</span>
          {"\n"}
          <span className="tok-red">&lt;section</span>{" "}
          <span className="tok-cream">class</span>=
          <span className="tok-mut">"hero"</span>
          <span className="tok-red">&gt;</span>
          {"\n  "}
          <span className="tok-red">&lt;h1&gt;</span>
          <span className="tok-cream">Tu negocio, online.</span>
          <span className="tok-red">&lt;/h1&gt;</span>
          {"\n  "}
          <span className="tok-red">&lt;a</span>{" "}
          <span className="tok-cream">href</span>=
          <span className="tok-mut">"#contacto"</span>
          <span className="tok-red">&gt;</span>
          <span className="tok-cream">Contacto</span>
          <span className="tok-red">&lt;/a&gt;</span>
          {"\n"}
          <span className="tok-red">&lt;/section&gt;</span>
          {"\n"}
          <span className="tok-mut">// diseño responsive: celular, tablet, desktop</span>
        </code>
      </pre>
    </div>
  );
}

/** Barras abstractas de ejemplo (sin métricas reales). */
export function BarrasEjemplo() {
  return (
    <div className="barras-ejemplo" aria-hidden="true">
      <span className="barras-titulo">Ejemplo ilustrativo</span>
      <span className="barras-item" style={{ "--w": "62%" }} />
      <span className="barras-item" style={{ "--w": "85%" }} />
      <span className="barras-item" style={{ "--w": "48%" }} />
    </div>
  );
}
