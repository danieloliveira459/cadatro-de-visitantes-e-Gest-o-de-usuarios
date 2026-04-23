// components/RotaProtegida.jsx

import { Navigate } from "react-router-dom";
import { usePermissao } from "../hooks/usePermissao";

export default function RotaProtegida({ children, tela }) {
  const token = localStorage.getItem("token");
  const { temAcesso } = usePermissao();

  // Se não estiver logado, redireciona para login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se estiver logado mas sem permissão para a tela
  if (tela && !temAcesso(tela)) {
    return <Navigate to="/sem-acesso" replace />;
  }

  return children;
}
