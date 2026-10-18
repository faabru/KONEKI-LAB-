import { useEffect, useRef, useState } from "react";
import { apiPost } from "../utils/api.js";
import { linkWhatsApp, linkMailto, tieneEmail, tieneWhatsApp } from "../utils/contacto.js";
import "../styles/components/contacto.css";

const SOLUCIONES = [
  { valor: "pagina_web", etiqueta: "Página web" },
  { valor: "carta_digital", etiqueta: "Carta digital" },
  { valor: "aplicacion_web", etiqueta: "Aplicación web / sistema" },
  { valor: "video_contenido", etiqueta: "Video y contenido" },
  { valor: "mantenimiento", etiqueta: "Mantenimiento" },
  { valor: "no_se", etiqueta: "No lo sé todavía" },
];

const LIMITE_NECESIDAD = 1000;

const vacio = {
  nombre_negocio: "",
  rubro: "",
  solucion: "",
  necesidad: "",
  presupuesto_orientativo: "",
  nombre_contacto: "",
  email: "",
  telefono: "",
  acepta_contacto: false,
  website: "", // honeypot
};

function validar(v) {
  const e = {};
  if (!v.nombre_negocio.trim()) e.nombre_negocio = "Contanos el nombre de tu negocio.";
  else if (v.nombre_negocio.trim().length > 120)
    e.nombre_negocio = "Máximo 120 caracteres.";
  if (!v.rubro.trim()) e.rubro = "Contanos el rubro de tu negocio.";
  else if (v.rubro.trim().length > 120) e.rubro = "Máximo 120 caracteres.";
  if (!v.solucion) e.solucion = "Elegí la solución que buscás.";
  if (!v.necesidad.trim()) e.necesidad = "Contanos qué necesitás o qué problema querés resolver.";
  else if (v.necesidad.trim().length > LIMITE_NECESIDAD)
    e.necesidad = `Máximo ${LIMITE_NECESIDAD} caracteres.`;
  if (v.presupuesto_orientativo && v.presupuesto_orientativo.length > 80)
    e.presupuesto_orientativo = "Máximo 80 caracteres.";
  if (v.nombre_contacto && v.nombre_contacto.length > 120)
    e.nombre_contacto = "Máximo 120 caracteres.";
  const emailOk = !v.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim());
  if (v.email && !emailOk) e.email = "Revisá el correo electrónico.";
  if (v.telefono && v.telefono.replace(/[^\d+]/g, "").length < 6)
    e.telefono = "Revisá el número de teléfono.";
  if (!v.email.trim() && !v.telefono.trim())
    e.contacto = "Dejanos al menos un medio de contacto: correo o teléfono.";
  if (!v.acepta_contacto) e.acepta_contacto = "Necesitamos tu ok para poder responderte.";
  return e;
}

export default function ContactForm({ planPreseleccionado, onPlanConsumido }) {
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("idle"); // idle | enviando | ok | error
  const [msgServidor, setMsgServidor] = useState("");
  const [planMencion, setPlanMencion] = useState(null);
  const refForm = useRef(null);
  const refExito = useRef(null);

  // Preselección cuando llega desde una tarjeta de plan
  useEffect(() => {
    if (!planPreseleccionado) return;
    const { categoriaSlug, plan } = planPreseleccionado;
    const mapa = {
      "paginas-web": "pagina_web",
      "cartas-digitales": "carta_digital",
      mantenimiento: "mantenimiento",
      "aplicaciones-web": "aplicacion_web",
      "videos-contenido": "video_contenido",
    };
    const solucion = mapa[categoriaSlug] || "";
    setForm((f) => ({ ...f, solucion, necesidad: f.necesidad || "" }));
    setPlanMencion({ categoriaSlug, plan });
    onPlanConsumido?.();
    // Desplazar al formulario dejando libre el header fijo
    requestAnimationFrame(() => {
      const destino = refForm.current;
      const seccion = document.getElementById("contacto");
      const objetivo = seccion || destino;
      if (!objetivo) return;
      const headerH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
          10
        ) || 76;
      const top =
        objetivo.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planPreseleccionado]);

  const set = (campo) => (ev) => {
    const valor =
      ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
    setForm((f) => ({ ...f, [campo]: valor }));
    if (errores[campo]) {
      setErrores((e) => ({ ...e, [campo]: undefined }));
    }
  };

  async function enviar(ev) {
    ev.preventDefault();
    if (estado === "enviando") return;

    const errs = validar(form);
    setErrores(errs);
    if (Object.keys(errs).length > 0) {
      setEstado("idle");
      const primerCampo = Object.keys(errs)[0];
      refForm.current?.querySelector(`[name="${primerCampo}"]`)?.focus();
      return;
    }

    setEstado("enviando");
    setMsgServidor("");

    const body = {
      nombre_negocio: form.nombre_negocio.trim(),
      rubro: form.rubro.trim(),
      solucion: form.solucion,
      necesidad: form.necesidad.trim(),
      presupuesto_orientativo: form.presupuesto_orientativo.trim() || null,
      nombre_contacto: form.nombre_contacto.trim() || null,
      email: form.email.trim() || null,
      telefono: form.telefono.trim() || null,
      acepta_contacto: form.acepta_contacto,
      website: form.website, // honeypot
      plan_referencia: planMencion ? planMencion.plan.nombre : null,
      categoria_referencia: planMencion ? planMencion.categoriaSlug : null,
    };

    try {
      await apiPost("/api/solicitudes", body);
      setEstado("ok");
      setForm(vacio);
      setErrores({});
      setPlanMencion(null);
      requestAnimationFrame(() => refExito.current?.focus());
    } catch (err) {
      setEstado("error");
      setMsgServidor(err.message || "No pudimos recibir tu solicitud. Intentá de nuevo.");
    }
  }

  const wa = linkWhatsApp(
    [
      "Hola, quiero consultar por un presupuesto.",
      planMencion ? `Plan de interés: ${planMencion.plan.nombre}` : "",
      "Nombre del negocio:",
      "Rubro:",
      "Solución que busco:",
      "Necesidad o problema a resolver:",
      "Presupuesto orientativo (opcional):",
    ]
      .filter(Boolean)
      .join("\n")
  );
  const mail = linkMailto();

  return (
    <section className="section contacto" id="contacto" aria-labelledby="tit-contacto">
      <div className="bg-glow" aria-hidden="true" />
      <div className="container contacto-grid">
        <div className="contacto-info reveal">
          <p className="kicker">{"// CONTACTO"}</p>
          <h2 id="tit-contacto" className="section-title">
            Contanos qué necesitás
          </h2>
          <p className="section-lead">
            Completá el formulario y te respondemos para entender tu caso y preparar un
            presupuesto. La primera consulta no compromete nada.
          </p>

          {planMencion && (
            <p className="contacto-plan">
              <span className="chip chip-active">Plan seleccionado</span>
              {planMencion.categoriaSlug === "mantenimiento"
                ? `${planMencion.plan.nombre} · mantenimiento`
                : `${planMencion.plan.nombre} de ${(
                    planMencion.categoriaSlug === "paginas-web"
                      ? "páginas web"
                      : planMencion.categoriaSlug === "cartas-digitales"
                      ? "cartas digitales"
                      : "la categoría"
                  )}`}
            </p>
          )}

          <div className="contacto-canales">
            {tieneWhatsApp && wa && (
              <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
                Consultar por WhatsApp
              </a>
            )}
            {tieneEmail && mail && (
              <a className="btn btn-secondary" href={mail}>
                Escribir por correo
              </a>
            )}
            {!tieneWhatsApp && !tieneEmail && (
              <p className="contacto-sin-canales">
                Canales directos (WhatsApp y correo) disponibles cuando se configuren
                en el entorno.
              </p>
            )}
          </div>

          <p className="contacto-privacidad">
            Usamos tus datos solo para responder tu consulta. No los compartimos con
            terceros.
          </p>
        </div>

        <form
          className="contacto-form card reveal"
          ref={refForm}
          onSubmit={enviar}
          noValidate
          aria-describedby="form-estado"
        >
          {planMencion && (
            <p className="form-plan-mencion">
              Sobre tu consulta del <strong>{planMencion.plan.nombre}</strong>:
            </p>
          )}

          {/* Honeypot: oculto para humanos y para bots */}
          <div className="form-hp" aria-hidden="true">
            <label htmlFor="website">No completar este campo</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </div>

          <div className="form-fila">
            <Campo
              nombre="nombre_negocio"
              etiqueta="Nombre del negocio"
              valor={form.nombre_negocio}
              error={errores.nombre_negocio}
              onChange={set("nombre_negocio")}
              autocomplete="organization"
              requerido
            />
            <Campo
              nombre="rubro"
              etiqueta="Rubro"
              valor={form.rubro}
              error={errores.rubro}
              onChange={set("rubro")}
              autocomplete="organization-title"
              requerido
              placeholder="Ej.: barbería, restaurante, consultorio"
            />
          </div>

          <div className="form-campo">
            <label htmlFor="solucion">
              Solución que buscás {<span className="req">*</span>}
            </label>
            <select
              id="solucion"
              name="solucion"
              value={form.solucion}
              onChange={set("solucion")}
              aria-invalid={Boolean(errores.solucion)}
              aria-describedby={errores.solucion ? "err-solucion" : undefined}
            >
              <option value="">Elegí una opción</option>
              {SOLUCIONES.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.etiqueta}
                </option>
              ))}
            </select>
            {errores.solucion && <ErrorCampo id="err-solucion" texto={errores.solucion} />}
          </div>

          <div className="form-campo">
            <label htmlFor="necesidad">
              Necesidad o problema a resolver <span className="req">*</span>
            </label>
            <textarea
              id="necesidad"
              name="necesidad"
              rows={5}
              maxLength={LIMITE_NECESIDAD + 50}
              value={form.necesidad}
              onChange={set("necesidad")}
              aria-invalid={Boolean(errores.necesidad)}
              aria-describedby={
                errores.necesidad
                  ? "err-necesidad contador-necesidad"
                  : "contador-necesidad"
              }
              placeholder="Contanos qué necesitás y qué querés resolver."
            />
            <div className="form-meta">
              {errores.necesidad && (
                <ErrorCampo id="err-necesidad" texto={errores.necesidad} />
              )}
              <span
                id="contador-necesidad"
                className={`contador ${form.necesidad.length > LIMITE_NECESIDAD ? "contador-rojo" : ""}`}
              >
                {form.necesidad.length}/{LIMITE_NECESIDAD}
              </span>
            </div>
          </div>

          <div className="form-fila">
            <Campo
              nombre="presupuesto_orientativo"
              etiqueta="Presupuesto orientativo (opcional)"
              valor={form.presupuesto_orientativo}
              error={errores.presupuesto_orientativo}
              onChange={set("presupuesto_orientativo")}
              autocomplete="off"
              placeholder="Ej.: $300.000, a definir"
            />
            <Campo
              nombre="nombre_contacto"
              etiqueta="Tu nombre (opcional)"
              valor={form.nombre_contacto}
              error={errores.nombre_contacto}
              onChange={set("nombre_contacto")}
              autocomplete="name"
            />
          </div>

          <div className="form-fila">
            <Campo
              nombre="email"
              etiqueta="Correo electrónico (opcional)"
              tipo="email"
              valor={form.email}
              error={errores.email}
              onChange={set("email")}
              autocomplete="email"
            />
            <Campo
              nombre="telefono"
              etiqueta="Teléfono / WhatsApp (opcional)"
              tipo="tel"
              valor={form.telefono}
              error={errores.telefono}
              onChange={set("telefono")}
              autocomplete="tel"
            />
          </div>
          {errores.contacto && (
            <ErrorCampo id="err-contacto" texto={errores.contacto} />
          )}

          <div className="form-check">
            <input
              type="checkbox"
              id="acepta_contacto"
              name="acepta_contacto"
              checked={form.acepta_contacto}
              onChange={set("acepta_contacto")}
              aria-invalid={Boolean(errores.acepta_contacto)}
              aria-describedby={errores.acepta_contacto ? "err-acepta" : undefined}
            />
            <label htmlFor="acepta_contacto">
              Acepto que me contacten para responder esta consulta.{" "}
              <span className="req">*</span>
            </label>
          </div>
          {errores.acepta_contacto && (
            <ErrorCampo id="err-acepta" texto={errores.acepta_contacto} />
          )}

          <div
            className="form-estado"
            id="form-estado"
            role="status"
            aria-live="polite"
          >
            {estado === "enviando" && <p className="estado-cargando">Enviando…</p>}
            {estado === "ok" && (
              <p className="estado-ok" ref={refExito} tabIndex={-1}>
                ✓ Recibimos tu solicitud. Te vamos a contactar al medio que nos dejaste.
              </p>
            )}
            {estado === "error" && (
              <p className="estado-error">
                No pudimos guardar tu solicitud: {msgServidor}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={estado === "enviando"}
          >
            {estado === "enviando"
              ? "Enviando…"
              : estado === "error"
              ? "Reintentar envío"
              : "Solicitar presupuesto"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Campo({
  nombre,
  etiqueta,
  valor,
  onChange,
  error,
  tipo = "text",
  requerido = false,
  placeholder = "",
  autocomplete = "on",
}) {
  const id = `campo-${nombre}`;
  const errId = `err-${nombre}`;
  return (
    <div className="form-campo">
      <label htmlFor={id}>
        {etiqueta} {requerido && <span className="req">*</span>}
      </label>
      <input
        type={tipo}
        id={id}
        name={nombre}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autocomplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
      />
      {error && <ErrorCampo id={errId} texto={error} />}
    </div>
  );
}

function ErrorCampo({ id, texto }) {
  return (
    <span className="form-error" id={id}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
        <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2a.9.9 0 0 0-.9.9l.2 2.6a.7.7 0 0 0 1.4 0l.2-2.6a.9.9 0 0 0-.9-.9Zm0 5.1a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z" />
      </svg>
      {texto}
    </span>
  );
}
