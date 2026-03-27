/**
 * Genera un código único para reservas en el formato: KOR-YYYYMMDD-XXXXXX
 * Ejemplo: KOR-20260327-A7K9P2
 */
export function generateCodigoReserva(): string {
  const now = new Date();

  // Formato de fecha: YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  // Generar 6 caracteres aleatorios (letras mayúsculas y números)
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPart += characters[randomIndex];
  }

  return `KOR-${datePart}-${randomPart}`;
}
