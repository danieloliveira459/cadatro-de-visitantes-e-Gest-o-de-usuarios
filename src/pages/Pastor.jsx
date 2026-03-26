import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaUsers,
  FaTrash,
  FaFilePdf,
  FaCalendarAlt,
  FaUserSlash,
} from "react-icons/fa";
import { PiUserSwitchLight } from "react-icons/pi";
import { MdWarning } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Pastor.css";

export default function Pastor() {
  const navigate = useNavigate();

  const [visitantes, setVisitantes] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [programacoes, setProgramacoes] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");
  const [atividade, setAtividade] = useState("");

  const [aba, setAba] = useState("visitantes");

  useEffect(() => {
    try {
      setVisitantes(JSON.parse(localStorage.getItem("visitantes")) || []);
      setAvisos(JSON.parse(localStorage.getItem("avisos")) || []);
      setProgramacoes(JSON.parse(localStorage.getItem("programacoes")) || []);
    } catch {
      setVisitantes([]);
      setAvisos([]);
      setProgramacoes([]);
    }
  }, []);

  const handleDelete = (index) => {
    const nova = visitantes.filter((_, i) => i !== index);
    setVisitantes(nova);
    localStorage.setItem("visitantes", JSON.stringify(nova));
  };

  const adicionarAviso = () => {
    if (!titulo || !descricao) return alert("Preencha os campos!");

    const novo = {
      titulo,
      descricao,
      data: new Date().toLocaleDateString(),
    };

    const lista = [...avisos, novo];
    setAvisos(lista);
    localStorage.setItem("avisos", JSON.stringify(lista));

    setTitulo("");
    setDescricao("");
  };

  const adicionarProgramacao = () => {
    if (!dia || !horario || !atividade)
      return alert("Preencha todos os campos!");

    const nova = { dia, horario, atividade };
    const lista = [...programacoes, nova];

    setProgramacoes(lista);
    localStorage.setItem("programacoes", JSON.stringify(lista));

    setDia("");
    setHorario("");
    setAtividade("");
  };

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.text("Visitantes Cadastrados", 105, 15, { align: "center" });

    autoTable(doc, {
      head: [["Nome", "Cargo", "Telefone", "Igreja", "Data"]],
      body: visitantes.map((v) => [
        v.nome,
        v.cargo,
        v.telefone,
        v.igreja,
        v.data,
      ]),
    });

    doc.save("visitantes.pdf");
  };

  return (
    <>
      <Header />

      <div className="pastor-container">
        <div className="back" onClick={() => navigate("/")}>
          <FaArrowLeft /> Voltar
        </div>

        {/* MENU */}
        <div className="menu">
          <button onClick={() => setAba("visitantes")}>
            <FaUsers /> Visitantes
          </button>

          <button onClick={() => setAba("avisos")}>
            <MdWarning /> Avisos
          </button>

          <button onClick={() => setAba("programacao")}>
            <FaCalendarAlt /> Programação
          </button>
        </div>

        {/* VISITANTES */}
        {aba === "visitantes" && (
          <div className="card">
            <h2>
              <FaUsers /> Visitantes
            </h2>

            <button onClick={gerarPDF}>
              <FaFilePdf /> PDF
            </button>

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Telefone</th>
                  <th>Igreja</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {visitantes.map((v, i) => (
                  <tr key={i}>
                    <td>{v.nome}</td>
                    <td>{v.cargo}</td>
                    <td>{v.telefone}</td>
                    <td>{v.igreja}</td>
                    <td>{v.data}</td>
                    <td>
                      <FaTrash onClick={() => handleDelete(i)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AVISOS */}
        {aba === "avisos" && (
          <div className="card">
            <h2>
              <MdWarning /> Avisos
            </h2>

            <input
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <textarea
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <button onClick={adicionarAviso}>Adicionar</button>

            <ul>
              {avisos.map((a, i) => (
                <li key={i}>
                  {a.titulo} - {a.data}
                  <FaTrash
                    onClick={() => {
                      const nova = avisos.filter((_, index) => index !== i);
                      setAvisos(nova);
                      localStorage.setItem("avisos", JSON.stringify(nova));
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PROGRAMAÇÃO */}
        {aba === "programacao" && (
          <div className="card">
            <h2>
              <FaCalendarAlt /> Programação
            </h2>

            <select value={dia} onChange={(e) => setDia(e.target.value)}>
              <option value="">Dia</option>
              <option>Domingo</option>
              <option>Segunda</option>
            </select>

            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />

            <input
              placeholder="Evento"
              value={atividade}
              onChange={(e) => setAtividade(e.target.value)}
            />

            <button onClick={adicionarProgramacao}>Adicionar</button>
          </div>
        )}
      </div>
    </>
  );
}