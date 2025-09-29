export const formatDateFromIsoToString = (value?: string | Date) => {
  if (!value) return ""; // atau return undefined jika mau skip field kosong
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0]; // YYYY-MM-DD
};
