import { NAV_LINKS } from "../data/navegacion.js";
import { linkWhatsApp, linkMailto, tieneEmail, tieneWhatsApp } from "../utils/contacto.js";
import { ASCII_CODE } from "../utils/formato.js";
import "../styles/components/footer.css";

export default function Footer() {
  const wa = linkWhatsApp();
  const mail = linkMailto();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img
            src="/assets/logo-koneki-x-lab.png"
            alt="Koneki X Lab"
            width="154"
            height="72"
            className="footer-logo"
          />
          <p className="footer-desc">
            Páginas web y aplicaciones web a tu medida para negocios y emprendimientos.
          </p>
          <p className="ascii-code footer-ascii" aria-hidden="true">
            {ASCII_CODE}
          </p>
        </div>

        <nav className="footer-nav" aria-label="Pie de página">
          <h2 className="footer-title">Navegación</h2>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-contact">
          <h2 className="footer-title">Contacto</h2>
          <ul>
            <li>
              <a href="#contacto">Solicitar presupuesto</a>
            </li>
            {tieneWhatsApp && wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  Consultar por WhatsApp
                </a>
              </li>
            )}
            {tieneEmail && mail && (
              <li>
                <a href={mail}>{import.meta.env.VITE_CONTACT_EMAIL}</a>
              </li>
            )}
          </ul>
          <p className="footer-note">
            Los importes publicados son precios de referencia en ARS. El alcance se
            acuerda con cada cliente.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>KONEKI X LAB</span>
        <span aria-hidden="true">K · O · N · E · K · I · <b>X</b> · LAB</span>
      </div>
    </footer>
  );
}
