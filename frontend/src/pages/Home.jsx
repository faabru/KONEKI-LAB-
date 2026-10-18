import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Hero from "../components/Hero.jsx";
import Servicios from "../components/Servicios.jsx";
import Planes from "../components/Planes.jsx";
import Informacion from "../components/Informacion.jsx";
import Proyectos from "../components/Proyectos.jsx";
import Proceso from "../components/Proceso.jsx";
import Faq from "../components/Faq.jsx";
import ContactForm from "../components/ContactForm.jsx";

const DESCRIPTION =
  "Koneki X Lab: páginas web, cartas digitales, aplicaciones a medida, video y mantenimiento. Presupuesto claro, trato cercano y resultados a la altura.";

export default function Home() {
  const [contactoPlan, setContactoPlan] = useState(null);

  return (
    <>
      <Helmet>
        <title>Koneki X Lab · Páginas web, aplicaciones y contenido</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content="Koneki X Lab · Soluciones digitales" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero />
      <Servicios />
      <Planes
        onConsultarPlan={(plan, categoria) =>
          setContactoPlan({ plan, categoriaSlug: categoria?.slug || "" })
        }
      />
      <Informacion />
      <Proyectos />
      <Proceso />
      <Faq />
      <ContactForm
        planPreseleccionado={contactoPlan}
        onPlanConsumido={() => setContactoPlan(null)}
      />
    </>
  );
}
