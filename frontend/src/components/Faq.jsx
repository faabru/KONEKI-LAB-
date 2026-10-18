import { useState } from "react";
import { useResource } from "../hooks/useResource.js";
import { FALLBACK_FAQS } from "../data/fallback.js";
import "../styles/components/faq.css";

export default function Faq() {
  const { data } = useResource("/api/faqs", FALLBACK_FAQS);
  const faqs = (Array.isArray(data) ? data : data?.faqs || [])
    .filter((f) => f.publicada)
    .slice()
    .sort((a, b) => a.orden - b.orden);
  const [abierta, setAbierta] = useState(null);

  return (
    <section className="section faq" id="faq" aria-labelledby="tit-faq">
      <div className="container container-estrecho">
        <header className="section-head reveal">
          <p className="kicker">{"// PREGUNTAS FRECUENTES"}</p>
          <h2 id="tit-faq" className="section-title">
            Dudas que suelen aparecer
          </h2>
          <p className="section-lead">
            Si tu pregunta no está acá, escribinos: la resolvemos para tu caso.
          </p>
        </header>

        <div className="faq-lista">
          {faqs.map((f, i) => {
            const id = `faq-${f.slug}`;
            const activa = abierta === i;
            return (
              <div className={`faq-item reveal ${activa ? "is-open" : ""}`} key={f.slug}>
                <h3 className="faq-titulo">
                  <button
                    type="button"
                    className="faq-boton"
                    aria-expanded={activa}
                    aria-controls={id}
                    id={`boton-${id}`}
                    onClick={() => setAbierta(activa ? null : i)}
                  >
                    <span>{f.pregunta}</span>
                    <span className="faq-icono" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="faq-panel"
                  id={id}
                  role="region"
                  aria-labelledby={`boton-${id}`}
                  hidden={!activa}
                >
                  <p>{f.respuesta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
