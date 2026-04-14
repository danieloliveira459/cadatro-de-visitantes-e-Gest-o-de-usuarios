import { FaUserPlus, FaRightFromBracket } from "react-icons/fa6";
import { PiUserSwitchLight } from "react-icons/pi";
import { RiAdminFill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Header.css";
import adtagLogo from "../assets/adtag.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggingOut = useRef(false); // 👈 flag para evitar conflito

  const isPastor = location.pathname === "/pastor";
  const isAceitaramJesus = location.pathname === "/aceitaram-jesus";

  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    usuario = null;
  }

  // Proteção de rota: só redireciona se NÃO estiver em processo de logout
  useEffect(() => {
    if (!usuario && !isLoggingOut.current) {
      navigate("/login", { replace: true });
    }
  }, [usuario, navigate]);

  const handleLogout = () => {
    isLoggingOut.current = true; // 👈 sinaliza que o logout é intencional
    localStorage.removeItem("usuarioLogado");
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div
        className="logo-container"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <img src={adtagLogo} alt="ADTAG Logo" className="logo-img" />
        <span className="logo-text">ADTAG Expansão Setor "O"</span>
      </div>

      <h1 className="titulo">
        Sistema de recepção, acompanhamento e gestão de visitantes
      </h1>

      <div className="acoes">
        <button
          className={`btn-outline ${!isPastor && !isAceitaramJesus ? "active-outline" : ""}`}
          onClick={() => navigate("/home")}
        >
          <FaUserPlus /> Cadastrar Visitante
        </button>

        <button
          className={`btn-outline ${isAceitaramJesus ? "active-outline" : ""}`}
          onClick={() => navigate("/aceitaram-jesus")}
        >
          <PiUserSwitchLight color="#e02020" /> Cadastrar quem aceitou Jesus
        </button>

        <button
          className={`btn-outline ${isPastor ? "active-outline" : ""}`}
          onClick={() => navigate("/pastor")}
        >
          Painel do Pastor
        </button>

        <span className="usuario-logado">
          <RiAdminFill />
          {usuario?.nome || "Usuário"}
        </span>

        <button className="btn-logout" onClick={handleLogout}>
          <FaRightFromBracket /> Logout
        </button>
      </div>
    </header>
  );
}