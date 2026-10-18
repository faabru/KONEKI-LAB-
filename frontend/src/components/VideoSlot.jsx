import "../styles/components/video-slot.css";

/**
 * Espacio para un video explicativo.
 * - Si el video tiene archivo/URL y está publicado, lo muestra.
 * - Si no, muestra un estado neutro "Próximamente".
 * No inventa enlaces: los datos llegan desde la API o desde content.
 */
export default function VideoSlot({ video }) {
  const tieneArchivo = Boolean(video?.archivo_o_url);
  const publicado = video?.publicado && tieneArchivo;

  return (
    <article className="video-slot card reveal">
      <div className="video-frame">
        {publicado ? (
          <video
            controls
            preload="metadata"
            poster="/assets/koneki_lab_3d_logo_poster.jpg"
            aria-label={video.titulo}
          >
            <source src={video.archivo_o_url} />
          </video>
        ) : (
          <div className="video-placeholder">
            <span className="video-placeholder-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.5" y="5" width="19" height="14" rx="3" />
                <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="video-placeholder-texto">Próximamente</span>
          </div>
        )}
      </div>
      <h4 className="video-titulo">{video.titulo}</h4>
      {video.descripcion && <p className="video-desc">{video.descripcion}</p>}
    </article>
  );
}
