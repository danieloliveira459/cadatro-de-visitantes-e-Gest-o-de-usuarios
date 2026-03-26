import { FaUserPlus, FaUserSlash, FaRightFromBracket } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { RiAdminFill } from "react-icons/ri";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isPastor = location.pathname === "/pastor";
  const isNaoEvangelico = location.pathname === "/nao-evangelico";

  // forma segura
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    usuario = null;
  }

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="logo">ADTAG Expansão Setor "O"</div>
      <h1 className="titulo">Sistema de Cadastro de Visitantes</h1>

      <div className="acoes">
        <button
          className={`btn-outline ${!isPastor && !isNaoEvangelico ? "active-outline" : ""}`}
          onClick={() => navigate("/home")}
        >
          <FaUserPlus /> Cadastrar Visitante
        </button>

        <button
          className={`btn-outline ${isNaoEvangelico ? "active-outline" : ""}`}
          onClick={() => navigate("/nao-evangelico")}
        >
          <FaUserSlash /> Cadastrar quem aceitou Jesus
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