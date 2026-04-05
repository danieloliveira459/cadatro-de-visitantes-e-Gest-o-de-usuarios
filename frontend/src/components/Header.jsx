import { FaUserPlus, FaRightFromBracket } from "react-icons/fa6";
import { PiUserSwitchLight } from "react-icons/pi";
import { RiAdminFill } from "react-icons/ri";
import { GiChurch } from "react-icons/gi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assents/image/LOGOMARCA_ADTAG_page-0005.jpg";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isPastor = location.pathname === "/pastor";
  const isAceitaramJesus = location.pathname === "/aceitaram-jesus";

  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    usuario = null;
  }

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className="header">

      {/* LOGO */}
      <div className="logo">
        <img src={logo} alt="ADTAG Logo" className="logo-img" />
      </div>

      {/* TÍTULO */}
      <h1 className="titulo">
        Sistema de recepção, acompanhamento e gestão de visitantes{" "}
        <GiChurch color="#e02020" />
      </h1>

      {/* AÇÕES */}
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