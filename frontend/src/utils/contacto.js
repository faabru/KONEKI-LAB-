const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "";
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "";

export const tieneWhatsApp = /^\d{8,15}$/.test(WHATSAPP.replace(/[^\d]/g, ""));
export const tieneEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL);

const MENSAJE_BASE = [
  "Hola, quiero consultar por un presupuesto.",
  "Nombre del negocio:",
  "Rubro:",
  "Solución que busco:",
  "Necesidad o problema a resolver:",
  "Presupuesto orientativo (opcional):",
].join("\n");

export function linkWhatsApp(texto = MENSAJE_BASE) {
  if (!tieneWhatsApp) return null;
  return `https://wa.me/${WHATSAPP.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    texto
  )}`;
}

export function linkMailto(asunto = "Consulta de presupuesto", cuerpo = MENSAJE_BASE) {
  if (!tieneEmail) return null;
  return `mailto:${EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(
    cuerpo
  )}`;
}
