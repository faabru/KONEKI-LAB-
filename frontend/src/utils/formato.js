export function formatARS(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  } catch {
    return `$${Number(valor).toLocaleString("es-AR")}`;
  }
}

export const ASCII_CODE = "75 79 78 69 75 73 32 88 32 76 65 66";
