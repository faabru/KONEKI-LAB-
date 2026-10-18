import { linkWhatsApp } from "../utils/contacto.js";
import "../styles/components/hero.css";

export default function Hero() {
  const wa = linkWhatsApp();

  return (
    <section className="hero" id="inicio" aria-label="Presentación">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/koneki_lab_3d_logo_poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/assets/koneki_lab_3d_logo_720.mp4" type="video/mp4" />
        <source src="/assets/koneki_lab_3d_logo.mp4" type="video/mp4" />
      </video>
      <div className="hero-gradient" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <div className="container hero-content">
        <p className="kicker reveal">{"// ESTUDIO DIGITAL"}</p>
        <h1 className="hero-title reveal">
          Páginas web y aplicaciones <span className="accent">web</span> a tu medida
        </h1>
        <p className="hero-sub reveal">
          Diseñamos y desarrollamos sitios y sistemas web que conectan tu negocio con
          tus clientes.
        </p>
        <div className="hero-actions reveal">
          <a className="btn btn-primary" href="#contacto">
            Solicitar presupuesto
          </a>
          <a className="btn btn-secondary" href="#proyectos">
            Ver proyectos
          </a>
          {wa && (
            <a className="btn btn-tertiary" href={wa} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="hero-ascii ascii-code" aria-hidden="true">
        75 79 78 69 75 73 32 88 32 76 65 66
      </div>
    </section>
  );
}
