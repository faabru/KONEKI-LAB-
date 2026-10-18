import { useEffect, useRef } from "react";

/**
 * Aparición al hacer scroll: agrega .is-visible cuando el elemento entra en pantalla.
 * Respeta prefers-reduced-motion (las animaciones se desactivan desde CSS).
 */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.classList.contains("reveal")
      ? [el]
      : Array.from(el.querySelectorAll(".reveal"));

    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            io.unobserve(entrada.target);
          }
        });
      },
      { threshold: options.threshold ?? 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [options.threshold]);

  return ref;
}
