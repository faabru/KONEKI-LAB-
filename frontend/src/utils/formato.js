export function formatUSD(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  return `US$ ${Number(valor).toLocaleString("es-AR")}`;
}

export function montoARS(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  return Number(valor).toLocaleString("es-AR");
}

export const ASCII_CODE = "75 79 78 69 75 73 32 88 32 76 65 66";
