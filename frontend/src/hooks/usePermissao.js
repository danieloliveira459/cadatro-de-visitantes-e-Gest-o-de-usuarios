// hooks/usePermissao.js

export function usePermissao() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  const nivel = usuario?.nivel || "";

  const PERMISSOES = {
    painelPastor: [
      "PASTOR",
      "VICE PASTOR",
      "PASTOR DIRIGENTE",
      "SECRETÁRIO",
      "TESOUREIRO",
    ],
    cadastroVisitantes: [
      "Diácono",
      "Diaconisa",
      "RECEPCIONISTA",
      "SECRETÁRIO",
      "PASTOR",
      "VICE PASTOR",
      "PASTOR DIRIGENTE",
      "TESOUREIRO",
    ],
    cadastroMembros: [
      "SECRETÁRIO",
      "PASTOR",
      "VICE PASTOR",
      "PASTOR DIRIGENTE",
      "TESOUREIRO",
    ],
  };

  const temAcesso = (tela) => {
    return PERMISSOES[tela]?.includes(nivel) ?? false;
  };

  return { nivel, usuario, temAcesso };
}
