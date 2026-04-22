import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  let usuario = null;

  try {
    const data = localStorage.getItem("usuarioLogado");
    if (data && data !== "undefined" && data !== "null") {
      usuario = JSON.parse(data);
    }
  } catch (error) {
    console.warn("Erro ao ler usuário do localStorage");
    usuario = null;
  }

  // ✅ NÃO LOGADO → LOGIN
  // Passa { from: location } para o Login poder redirecionar de volta
  // NÃO passa logout:true aqui, pois isso bloqueava o redirect automático
  if (!token || !usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // VERIFICA PERMISSÃO
  const nivel = usuario?.nivel?.toUpperCase();

  if (allowedRoles && (!nivel || !allowedRoles.includes(nivel))) {
    return <Navigate to="/home" replace />;
  }

  // LIBERADO
  return children;
}
