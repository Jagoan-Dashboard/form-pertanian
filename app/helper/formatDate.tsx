export const formatDateFromIsoToString = (value?: string | Date) => {
  if (!value) return ""; // atau return undefined jika mau skip field kosong
  const d = new Date(value);
  if (isNaN(d.getTime())) return ""; // Handle invalid dates
  // Convert to local date to avoid timezone issues
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0]; // YYYY-MM-DD
};
