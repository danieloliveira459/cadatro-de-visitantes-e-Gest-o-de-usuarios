// Retorna a data da segunda-feira da semana atual no formato YYYY-MM-DD
export function getSegundaFeira(data = new Date()) {
  const d = new Date(data);
  const dia = d.getDay(); // 0=dom, 1=seg, ..., 6=sab
  const diff = dia === 0 ? -6 : 1 - dia;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0]; // "2026-04-20"
}
