import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "../data/navegacion.js";
import "../styles/components/header.css";

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [scroll, setScroll] = useState(false);
  const navRef = useRef(null);
  const botonRef = useRef(null);

  useEffect(() => {
    const alScroll = () => setScroll(window.scrollY > 12);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // Cerrar con Escape y atrapar foco mientras el menú está abierto
  useEffect(() => {
    if (!abierto) return;
    const alKey = (e) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !navRef.current) return;
      const foco = navRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!foco.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", alKey);
    const primeroFoco = navRef.current?.querySelector("a[href]");
    primeroFoco?.focus();
    return () => document.removeEventListener("keydown", alKey);
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <header className={`header ${scroll ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#inicio" className="header-logo" aria-label="Koneki X Lab · Inicio">
          <img src="/assets/logo-koneki-x-lab.png" alt="Koneki X Lab" width="116" height="54" />
        </a>

        <nav
          className={`header-nav ${abierto ? "is-open" : ""}`}
          id="nav-principal"
          aria-label="Principal"
          ref={navRef}
        >
          <ul className="header-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={cerrar}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-primary header-cta" href="#contacto" onClick={cerrar}>
            Solicitar presupuesto
          </a>
        </nav>

        <button
          ref={botonRef}
          className="header-burger"
          aria-expanded={abierto}
          aria-controls="nav-principal"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
