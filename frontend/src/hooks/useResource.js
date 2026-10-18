import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../utils/api.js";

/**
 * Carga un recurso desde la API. Si la API no responde o no está configurada,
 * usa el contenido de respaldo (content/catalogo.seed.json) para que el sitio
 * nunca quede en blanco.
 */
export function useResource(path, fallback) {
  const [data, setData] = useState(fallback);
  const [estado, setEstado] = useState("cargando"); // cargando | ok | respaldo | error
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setEstado("cargando");
    setError(null);
    try {
      const res = await apiGet(path);
      setData(res);
      setEstado("ok");
    } catch (err) {
      setData(fallback);
      setEstado(fallback ? "respaldo" : "error");
      setError(err.message);
    }
  }, [path, fallback]);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const res = await apiGet(path);
        if (!vivo) return;
        setData(res);
        setEstado("ok");
      } catch (err) {
        if (!vivo) return;
        setData(fallback);
        setEstado(fallback ? "respaldo" : "error");
        setError(err.message);
      }
    })();
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, estado, error, recargar };
}
