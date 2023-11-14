export function formatDate(date: string | null): string | null {
  if (date === null) {
    return null;
  }

  const parts = date.split("-");
  if (parts.length !== 3) {
    throw new Error(
      "Formato de data inválido. Deve estar no formato aaaa-mm-dd."
    );
  }

  const [year, month, day] = parts;
  return `${year}-${month}-${day}`;
}
