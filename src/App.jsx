import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Pastor from "./pages/Pastor";
import NaoEvangelico from "./pages/NaoEvangelico";
import Admin from "./pages/Admin";

//  Função TOTALMENTE segura
function getUsuario() {
  const data = localStorage.getItem("usuarioLogado");

  if (!data || data === "undefined") {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

//  Rota protegida
function PrivateRoute({ children, allowedRoles }) {
  const usuarioLogado = getUsuario();

  //  não logado
  if (!usuarioLogado || !usuarioLogado.nivel) {
    return <Navigate to="/login" replace />;
  }

  //  sem permissão
  if (allowedRoles && !allowedRoles.includes(usuarioLogado.nivel)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  const usuarioLogado = getUsuario();

  return (
    <BrowserRouter>
      <Routes>

        {/*  Redirecionamento inicial */}
        <Route
          path="/"
          element={
            <Navigate
              to={usuarioLogado ? "/home" : "/login"}
              replace
            />
          }
        />

        {/*  Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["ADM"]}>
              <Admin />
            </PrivateRoute>
          }
        />

        {/*  ROTAS PROTEGIDAS */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={["ADM","Pastor","Vice","Dirigente Jovens","Atendente"]}>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/pastor"
          element={
            <PrivateRoute allowedRoles={["ADM","Pastor","Vice","Dirigente Jovens"]}>
              <Pastor />
            </PrivateRoute>
          }
        />

        <Route
          path="/nao-evangelico"
          element={
            <PrivateRoute allowedRoles={["ADM","Pastor","Vice","Dirigente Jovens","Atendente"]}>
              <NaoEvangelico />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;