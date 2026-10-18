const RAW = import.meta.env.VITE_API_URL;
// En desarrollo, sin configurar se usa el proxy de Vite (/api → backend).
// En producción, sin configurar no se consulta: el sitio usa el contenido de respaldo.
const API_URL =
  RAW === undefined || RAW === null || RAW === ""
    ? import.meta.env.DEV
      ? ""
      : null
    : RAW.replace(/\/$/, "");

export async function apiGet(path, { timeout = 6000 } = {}) {
  if (API_URL === null) {
    throw new Error("API no configurada");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function apiPost(path, body, { timeout = 12000 } = {}) {
  if (API_URL === null) {
    throw new Error("API no configurada");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        Array.isArray(data?.detail) && data.detail[0]?.msg
          ? data.detail.map((d) => d.msg).join(" ")
          : data?.detail || `Error ${res.status}`;
      throw new Error(msg);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}
