import { useMemo, useState } from "react";
import { useResource } from "../hooks/useResource.js";
import { seedCatalogo, NOTAS } from "../data/fallback.js";
import { formatUSD, montoARS } from "../utils/formato.js";
import { CircuitLine } from "./Decorativo.jsx";
import "../styles/components/planes.css";

const CATEGORIAS_TABS = ["paginas-web", "cartas-digitales", "mantenimiento"];

function PlanCard({ plan, categoria, onConsultar }) {
  const precioArs = montoARS(plan.precio_ars);
  const precioUsd = formatUSD(plan.precio_usd);
  const esMensual = /mensual/i.test(plan.etiqueta_precio || "");
  return (
    <article className="card plan-card reveal">
      <span className="chip">{categoria.titulo}</span>
      <h3 className="plan-nombre">{plan.nombre}</h3>
      <p className="plan-precio">
        {precioArs ? (
          <>
            <span className="plan-monto">
              <span className="plan-moneda">ARS</span>
              {precioArs}
            </span>
            <span className="plan-etiqueta">
              {plan.etiqueta_precio || "ARS · PRECIO DE REFERENCIA"}
            </span>
            {precioUsd && (
              <span className="plan-usd">
                {precioUsd}
                {esMensual ? " · mensuales" : " · referencia"}
              </span>
            )}
          </>
        ) : (
          <span className="plan-monto plan-monto-texto">
            {plan.etiqueta_precio || "A cotizar"}
          </span>
        )}
      </p>
      {plan.descripcion && <p className="plan-desc">{plan.descripcion}</p>}
      {plan.items?.length > 0 && (
        <>
          <h4 className="plan-incluye">Incluye</h4>
          <ul className="check-list">
            {plan.items
              .slice()
              .sort((a, b) => a.orden - b.orden)
              .map((item) => (
                <li key={item.orden}>{item.texto}</li>
              ))}
          </ul>
        </>
      )}
      <button
        type="button"
        className="btn btn-primary plan-btn"
        onClick={() => onConsultar(plan, categoria)}
      >
        Consultar este plan
      </button>
    </article>
  );
}

export default function Planes({ onConsultarPlan }) {
  const { data } = useResource("/api/catalogo", seedCatalogo);
  const categorias = useMemo(() => data.categorias || [], [data]);
  const [tab, setTab] = useState(CATEGORIAS_TABS[0]);

  const catActiva = useMemo(
    () => categorias.find((c) => c.slug === tab) || categorias[0],
    [categorias, tab]
  );
  const catAplicaciones = categorias.find((c) => c.slug === "aplicaciones-web");
  const catVideos = categorias.find((c) => c.slug === "videos-contenido");
  const extrasCarta = useMemo(() => {
    const c = categorias.find((x) => x.slug === "cartas-digitales");
    return (c?.extras || []).slice().sort((a, b) => a.orden - b.orden);
  }, [categorias]);

  const tabsDisponibles = CATEGORIAS_TABS.filter((slug) =>
    categorias.some((c) => c.slug === slug)
  );

  return (
    <section className="section planes" id="planes" aria-labelledby="tit-planes">
      <div className="bg-glow" aria-hidden="true" />
      <div className="container">
        <header className="section-head reveal">
          <p className="kicker">{"// PLANES"}</p>
          <h2 id="tit-planes" className="section-title">
            Planes y precios de referencia
          </h2>
          <p className="section-lead">{NOTAS.precios}</p>
        </header>

        <div
          className="segmented reveal"
          role="tablist"
          aria-label="Categorías de planes"
        >
          {tabsDisponibles.map((slug) => {
            const cat = categorias.find((c) => c.slug === slug);
            return (
              <button
                key={slug}
                role="tab"
                id={`tab-${slug}`}
                aria-selected={tab === slug}
                aria-controls={`panel-${slug}`}
                className={`chip ${tab === slug ? "chip-active" : ""}`}
                onClick={() => setTab(slug)}
                type="button"
              >
                {cat?.titulo || slug}
              </button>
            );
          })}
        </div>

        {catActiva?.descripcion && (
          <p className="planes-cat-desc reveal">{catActiva.descripcion}</p>
        )}

        <div
          className="planes-grid"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {catActiva?.planes
            ?.filter((p) => p.activo)
            .slice()
            .sort((a, b) => a.orden - b.orden)
            .map((plan) => (
              <PlanCard
                key={plan.slug}
                plan={plan}
                categoria={catActiva}
                onConsultar={onConsultarPlan}
              />
            ))}
        </div>

        {/* Adicionales de cartas digitales: claramente separados de los planes */}
        {tab === "cartas-digitales" && extrasCarta.length > 0 && (
          <div className="extras reveal" id="extras-cartas">
            <h3 className="extras-titulo">Adicionales de cartas digitales</h3>
            <p className="extras-sub">
              Servicios opcionales, separados de los planes. Se agregan cuando los
              necesitás.
            </p>
            <div className="tabla-scroll">
              <table className="extras-tabla">
                <caption className="visually-hidden">
                  Adicionales de cartas digitales con sus precios de referencia
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Adicional</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {extrasCarta.map((e) => (
                    <tr key={e.slug}>
                      <th scope="row" data-label="Adicional">
                        {e.nombre}
                      </th>
                      <td data-label="Descripción">
                        {e.descripcion}
                        {e.nota && <span className="extra-nota">{e.nota}</span>}
                      </td>
                      <td data-label="Referencia" className="extra-precio">
                        {e.precio_ars ? (
                          <>
                            <span className="extra-ars">ARS {montoARS(e.precio_ars)}</span>
                            {e.precio_usd ? (
                              <span className="extra-usd">{formatUSD(e.precio_usd)}</span>
                            ) : null}
                          </>
                        ) : (
                          "Se cotiza aparte"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <CircuitLine className="planes-linea" />

        {/* Banda de aplicaciones a medida, sin precio fijo */}
        {catAplicaciones && (
          <div className="medida-band reveal">
            <div>
              <p className="kicker">{"// A MEDIDA"}</p>
              <h3>Aplicaciones y sistemas a medida: presupuesto personalizado</h3>
              <p>
                Para turnos, pedidos, inventario, ventas, administración u otros
                procesos. Primero hacemos un relevamiento de necesidades y después
                cotizamos según funcionalidades, complejidad, horas de trabajo y
                alcance. No publicamos precio fijo porque cada sistema es distinto.
              </p>
              <ul className="check-list">
                {catAplicaciones.planes?.[0]?.items
                  ?.slice()
                  .sort((a, b) => a.orden - b.orden)
                  .map((i) => (
                    <li key={i.orden}>{i.texto}</li>
                  ))}
              </ul>
            </div>
            <div className="medida-cta">
              <a className="btn btn-primary" href="#contacto">
                Solicitar presupuesto
              </a>
            </div>
          </div>
        )}

        {/* Videos y contenido: se cotizan */}
        {catVideos && (
          <div className="videos-band reveal">
            <div>
              <h3>Videos y contenido digital</h3>
              <p>{catVideos.planes?.[0]?.descripcion}</p>
            </div>
            <a className="btn btn-secondary" href="#contacto">
              Consultar por este servicio
            </a>
          </div>
        )}

        <p className="planes-nota reveal">
          Los importes son precios de referencia en ARS. {NOTAS.precios_usd} El dominio y
          el alojamiento se presupuestan aparte cuando corresponda.
        </p>
      </div>
    </section>
  );
}
