import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {FaArrowLeft,FaUsers, FaTrash, FaFilePdf, FaCalendarAlt, FaUserSlash} from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { PiUserSwitchLight } from "react-icons/pi";
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
  const [responsavel, setResponsavel] = useState("");
  const [aba, setAba] = useState("visitantes");
 const [aceitaramJesus, setAceitaramJesus] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    try {
      const dados = JSON.parse(localStorage.getItem("visitantes"));
      const dadosAvisos = JSON.parse(localStorage.getItem("avisos"));
      const dadosProg = JSON.parse(localStorage.getItem("programacoes"));
      const dadosJesus = JSON.parse(localStorage.getItem("aceitaramJesus"));

      setVisitantes(Array.isArray(dados) ? dados : []);
      setAvisos(Array.isArray(dadosAvisos) ? dadosAvisos : []);
      setProgramacoes(Array.isArray(dadosProg) ? dadosProg : []);
      setAceitaramJesus(Array.isArray(dadosJesus) ? dadosJesus : []);

      // LIMPA A ABA SALVA
      localStorage.removeItem("abaAtiva");
    } catch {
      setVisitantes([]);
      setAvisos([]);
      setProgramacoes([]);
      setAceitaramJesus([]);
    }
  }, []);

  // EXCLUIR VISITANTE
  const handleDelete = (index) => {
    const novaLista = visitantes.filter((_, i) => i !== index);
    setVisitantes(novaLista);
    localStorage.setItem("visitantes", JSON.stringify(novaLista));
  };

  // ADICIONAR VISITANTE (NOVO)
  const adicionarVisitante = () => {
    if (!nome || !telefone) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const novoVisitante = {
      nome,
      cargo: "Visitante", 
      telefone,
      igreja: endereco,   
      data: new Date().toLocaleString("pt-BR"),
      observacoes,
    };

    const novaLista = [...visitantes, novoVisitante];
    setVisitantes(novaLista);
    localStorage.setItem("visitantes", JSON.stringify(novaLista));

    // limpa os campos
    setNome("");
    setTelefone("");
    setEndereco("");
    setObservacoes("");
  };

  // ADICIONAR AVISO
  const adicionarAviso = () => {
    if (!titulo || !descricao) {
      alert("Preencha os campos!");
      return;
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    const novo = {
      titulo,
      descricao,
      data: dataAtual,
    };

    const novaLista = [...avisos, novo];
    setAvisos(novaLista);
    localStorage.setItem("avisos", JSON.stringify(novaLista));

    setTitulo("");
    setDescricao("");
  };

  // ADICIONAR PROGRAMAÇÃO
  const adicionarProgramacao = () => {
    if (!dia || !horario || !atividade) {
      alert("Preencha todos os campos!");
      return;
    }

    const nova = { dia, horario, atividade, responsavel };

    const novaLista = [...programacoes, nova];
    setProgramacoes(novaLista);
    localStorage.setItem("programacoes", JSON.stringify(novaLista));

    setDia("");
    setHorario("");
    setAtividade("");
    setResponsavel("");
  };

  // PDF DINÂMICO PARA TODAS AS ABAS
// PDF DINÂMICO PARA TODAS AS ABAS
const gerarPDF = (tipo) => {
  const doc = new jsPDF();

  doc.setTextColor(220, 38, 38);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");

  //  TÍTULO CORRIGIDO
  let tituloPDF = tipo.toUpperCase();

  if (tipo === "programacao") {
    tituloPDF = "PROGRAMA\u00C7\u00C3O";
  }

  if (tipo === "aceitaramJesus") {
    tituloPDF = "ACEITARAM A JESUS";
  }

  doc.text(
    tituloPDF,
    doc.internal.pageSize.getWidth() / 2,
    15,
    { align: "center" }
  );

  let tabela = [];
  let head = [];

  if (tipo === "visitantes") {
    head = [["Nome", "Cargo", "Telefone", "Igreja", "Data",]];
    tabela = visitantes.map((v) => [
      v.nome,
      v.cargo,
      v.telefone,
      v.igreja,
      v.data,
    ]);
  }

  if (tipo === "avisos") {
    head = [["Título", "Descrição","Data"]];
    tabela = avisos.map((a) => [a.titulo, a.descricao, a.data]);
  }

  if (tipo === "programacao") {
    head = [["Dia", "Horário", "Atividade", "Data"]];
    tabela = programacoes.map((p) => [p.dia, p.horario, p.atividade, p.data]);
  }

  if (tipo === "aceitaramJesus") {
    head = [["Nome", "Telefone", "Endereço", "Observações", "Data"]];
    tabela = aceitaramJesus.map((v) => [
      v.nome,
      v.telefone,
      v.endereco,
      v.observacoes,
      v.data,
    ]);
  }

  if (tabela.length === 0) {
    alert("Sem dados para gerar PDF!");
    return;
  }

  autoTable(doc, {
    head,
    body: tabela,
    startY: 25,

    styles: {
      fontSize: 10,
      cellPadding: 4,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [220, 38, 38],
      textColor: [255, 255, 255],
    },

    columnStyles: tipo === "aceitaramJesus"
      ? {
          0: { cellWidth: 35 },
          1: { cellWidth: 30 },
          2: { cellWidth: 45 },
          3: { cellWidth: 50 },
          4: { cellWidth: 30 },
        }
      : {},
  });

  //  NOME DO ARQUIVO CORRIGIDO
  let nomeArquivo = tipo;

  if (tipo === "aceitaramJesus") {
    nomeArquivo = "aceitaram_a_jesus";
  }

  doc.save(`${nomeArquivo}.pdf`);
};

function adicionarAceitouJesus() {
  if (!nome.trim()) {
    alert("Nome é obrigatório!");
    return;
  }

  const novo = {
    nome: nome.trim(),
    telefone,
    endereco,
    observacoes,
  };

  const listaAtual = JSON.parse(localStorage.getItem("aceitaramJesus") || "[]");

  const listaAtualizada = [...listaAtual, novo];

  localStorage.setItem("aceitaramJesus", JSON.stringify(listaAtualizada));

  setAceitaramJesus(listaAtualizada);

  setNome("");
  setTelefone("");
  setEndereco("");
  setObservacoes("");
}
return (
    <>
      <Header />

      <div className="pastor-container">

        <div className="back" onClick={() => navigate("/")}>
          <FaArrowLeft />
          Voltar para Cadastro
        </div>

        <div className="menu">
          <button
            className={aba === "visitantes" ? "active" : ""}
            onClick={() => setAba("visitantes")}
          >
            <FaUsers color="#e02020" /> Visitantes
          </button>

          <button
            className={aba === "avisos" ? "active" : ""}
            onClick={() => setAba("avisos")}
          >
            <MdWarning color="#e02020" /> Avisos Importantes
          </button>

          <button
            className={aba === "programacao" ? "active" : ""}
            onClick={() => setAba("programacao")}
          >
            <FaCalendarAlt color="#e02020"/> Programação da Semana
          </button>

          <button
            className={aba === "aceitaramJesus" ? "active" : ""}
            onClick={() => setAba("aceitaramJesus")}
          >
            <PiUserSwitchLight color="#e02020"/> Aceitaram a Jesus
          </button>
        </div>

     {/* VISITANTES */}
{aba === "visitantes" && (
  <div className="painel">
    <div className="card">
      <h2 className="card-title">
        <FaUsers color="#e02020" /> Estatísticas
      </h2>

      <div className="stats-box">
        <span>Total de Visitantes</span>
        <h1>{visitantes.length}</h1>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <FaUsers color="#e02020"/> Visitantes Cadastrados
        </h2>

        <button onClick={() => gerarPDF("visitantes")} className="btn-pdf">
          <FaFilePdf /> Gerar PDF
        </button>
      </div>

      <span>Total: {visitantes.length}</span>

      {visitantes.length === 0 ? (
        <div className="empty">
          <FaUsers size={40} />
          <p>Nenhum visitante cadastrado ainda.</p>
        </div>
      ) : (
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Função/ND</th>
              <th>Telefone</th>
              <th>Igreja/ Visitando, Frequentando</th>
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
                  <FaTrash
                    className="delete"
                    onClick={() => handleDelete(i)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)}
        {/* AVISOS */}
        {aba === "avisos" && (
          <div className="avisos-grid">
            <div className="card">
              <h3><MdWarning color="#e02020"/> Novo Aviso</h3>

              <div className="total-box">
                <span>Total de Avisos</span>
                <h1>{avisos.length}</h1>
              </div>

              <label>Título</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Digite o título" />

              <label>Descrição</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Digite a descrição" />

              <button className="btn-red" onClick={adicionarAviso}>
                Adicionar Aviso
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <h3><MdWarning color="#e02020"/> Avisos Importantes</h3>
                <button onClick={() => gerarPDF("avisos")} className="btn-pdf">
              <FaFilePdf /> Gerar PDF
               </button>
                <span>Total: 
                  {avisos.length}</span>
              </div>

              {/*  NOVA TABELA */}
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {avisos.map((a, i) => (
                    <tr key={i}>
                      <td>{a.titulo}</td>
                      <td>{a.descricao}</td>
                      <td>{a.data}</td>
                      <td>
                        <FaTrash
                          className="delete"
                          onClick={() => {
                            const novaLista = avisos.filter((_, index) => index !== i);
                            setAvisos(novaLista);
                            localStorage.setItem("avisos", JSON.stringify(novaLista));
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROGRAMAÇÃO */}
        {aba === "programacao" && (
          <div className="avisos-grid">

            <div className="card">
              <h3><FaCalendarAlt color="#e02020"/> Novo Evento</h3>

              <label>Dia</label>
              <select value={dia} onChange={(e) => setDia(e.target.value)}>
                <option value="">Selecione</option>
                <option>Domingo</option>
                <option>Segunda-feira</option>
                <option>Terça-feira</option>
                <option>Quarta-feira</option>
                <option>Quinta-feira</option>
                <option>Sexta-feira</option>
                <option>Sábado</option>
              </select>

              <label>Horário</label>
              <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />

              <label>Atividade</label>
              <input value={atividade} onChange={(e) => setAtividade(e.target.value)} placeholder="Digite a atividade" />

              <button className="btn-red" onClick={adicionarProgramacao}>
                Adicionar
              </button>
            </div>

            <div className="card">
              <h3><FaCalendarAlt color="#e02020"/>Programação da Semana <button onClick={() => gerarPDF("programacao")} className="btn-pdf">
             <FaFilePdf /> Gerar PDF
              </button></h3>

              {/*  NOVA TABELA */}
<table className="tabela">
  <thead>
    <tr>
      <th>Dia</th>
      <th>Horário</th>
      <th>Atividade</th>
      <th>Data</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {programacoes.map((p, i) => (
      <tr key={i}>
        <td>{p.dia}</td>
        <td>{p.horario}</td>
        <td>{p.atividade}</td>
        <td>{p.data}</td>
        <td>
          <FaTrash
            className="delete"
            onClick={() => {
              const novaLista = programacoes.filter((_, index) => index !== i);
              setProgramacoes(novaLista);
              localStorage.setItem("programacoes", JSON.stringify(novaLista));
            }}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>

          </div>
        )}

        {/*Aceitaram Jesus*/}
        {aba === "aceitaramJesus" && (
  <div className="avisos-grid">
    <div className="card">
      <h3> <PiUserSwitchLight color="#e02020"/> Estastiscas  aceitou Jesus</h3>

      <div className="total-box">
        <span>Total de Registros</span>
        <h1>{aceitaramJesus.length}</h1>
      </div>
    </div>
    {/* TABELA */}
    <div className="card">
      <div className="card-header">
        <h3> <PiUserSwitchLight color="#e02020"/> Aceitou a Jesus</h3>
        <span>Total: {aceitaramJesus.length}</span>
        <button onClick={() => gerarPDF("aceitaramJesus")} className="btn-pdf">
  <FaFilePdf /> Gerar PDF
</button>
      </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Observações</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aceitaramJesus.map((p, i) => (
            <tr key={i}>
              <td>{p.nome}</td>
              <td>{p.telefone}</td>
              <td>{p.endereco}</td>
              <td>{p.observacoes}</td>
              <td>{p.data}</td>
              <td>
                <FaTrash
                  className="delete"
                  onClick={() => {
                    const novaLista = aceitaramJesus.filter((_, index) => index !== i);
                    setAceitaramJesus(novaLista);
                    localStorage.setItem("aceitaramJesus", JSON.stringify(novaLista));
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
)}

      </div>
    </>
  );
}