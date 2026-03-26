import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    usuario = null;
  }

  // Não logado
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  //  Sem permissão
  if (allowedRoles && !allowedRoles.includes(usuario.nivel)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}