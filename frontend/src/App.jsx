import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Pastor from "./pages/Pastor";
import Admin from "./pages/Admin";
import ProtectedRoute from "./pages/ProtectedRoute";
import AceitaramJesus from "./pages/AceitaramJesus";
import ResetPassword from "./pages/ResetPassword";
import Membros from "./pages/CadastroMembros";
import Qrcode from "./pages/QrExport";
import SemAcesso from "./pages/SemAcesso"; // ← NOVO

// FUNÇÃO SEGURA
function getUsuario() {
  const data = localStorage.getItem("usuarioLogado");
  if (!data || data === "undefined") return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default function App() {
  const [usuario, setUsuario] = useState(getUsuario());

  useEffect(() => {
    const handleStorage = () => {
      setUsuario(getUsuario());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ROTA INICIAL */}
        <Route
          path="/"
          element={
            usuario
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* PÁGINA DE ACESSO NEGADO */}
        <Route path="/sem-acesso" element={<SemAcesso />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADM"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* HOME — todos os logados */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={[
              "ADM",
              "PASTOR",
              "VICE PASTOR",
              "PASTOR DIRIGENTE",
              "SECRETÁRIO",
              "TESOUREIRO",
              "RECEPCIONISTA",
              "Diácono",
              "Diaconisa",
            ]}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* PAINEL DO PASTOR */}
        <Route
          path="/pastor"
          element={
            <ProtectedRoute allowedRoles={[
              "ADM",
              "PASTOR",
              "VICE PASTOR",
              "PASTOR DIRIGENTE",
              "SECRETÁRIO",
              "TESOUREIRO",
            ]}>
              <Pastor />
            </ProtectedRoute>
          }
        />

        {/* CADASTRO DE VISITANTES / ACEITARAM JESUS */}
        <Route
          path="/aceitaram-jesus"
          element={
            <ProtectedRoute allowedRoles={[
              "ADM",
              "PASTOR",
              "VICE PASTOR",
              "PASTOR DIRIGENTE",
              "SECRETÁRIO",
              "TESOUREIRO",
              "RECEPCIONISTA",
              "Diácono",
              "Diaconisa",
            ]}>
              <AceitaramJesus />
            </ProtectedRoute>
          }
        />

        {/* CADASTRO DE MEMBROS */}
        <Route
          path="/membros"
          element={
            <ProtectedRoute allowedRoles={[
              "ADM",
              "PASTOR",
              "VICE PASTOR",
              "PASTOR DIRIGENTE",
              "SECRETÁRIO",
              "TESOUREIRO",
            ]}>
              <Membros />
            </ProtectedRoute>
          }
        />

        {/* QR CODE */}
        <Route
          path="/qrcode"
          element={
            <ProtectedRoute allowedRdaoles={[
              "ADM",
              "PASTOR",
              "VICE PASTOR",
              "PASTOR DIRIGENTE",
              "SECRETÁRIO",
              "TESOUREIRO",
              "RECEPCIONISTA",
            ]}>
              <Qrcode />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            usuario
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
