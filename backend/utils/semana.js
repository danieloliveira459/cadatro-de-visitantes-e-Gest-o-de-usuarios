export function getSegundaFeira() {
  const hoje = new Date();
  const dia = hoje.getDay(); // 0=dom, 1=seg...
  const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1);
  const seg = new Date(hoje);
  seg.setDate(diff);
  return seg.toISOString().split("T")[0]; // "2026-04-27"
}
