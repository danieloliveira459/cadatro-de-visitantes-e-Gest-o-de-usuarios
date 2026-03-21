import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { FaArrowLeft, FaUsers, FaTrash, FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Pastor.css";

export default function Pastor() {
  const navigate = useNavigate();

  const [visitantes, setVisitantes] = useState([]);

  // CARREGA OS DADOS
  useEffect(() => {
    try {
      const dados = JSON.parse(localStorage.getItem("visitantes"));
      setVisitantes(Array.isArray(dados) ? dados : []);
    } catch {
      setVisitantes([]);
    }
  }, []);

  // EXCLUIR VISITANTE
  const handleDelete = (index) => {
    const novaLista = visitantes.filter((_, i) => i !== index);
    setVisitantes(novaLista);
    localStorage.setItem("visitantes", JSON.stringify(novaLista));
  };

  //  GERAR PDF ESTILIZADO
  const gerarPDF = () => {
    const doc = new jsPDF();

    //  TÍTULO CENTRALIZADO E NEGRITO
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Visitantes Cadastrados",
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: "center" }
    );

    //  RESET PADRÃO
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const tabela = visitantes.map((v) => [
      v.nome,
      v.cargo,
      v.telefone,
      v.igreja,
      v.data,
    ]);

    autoTable(doc, {
      head: [["Nome", "Cargo", "Telefone", "Igreja", "Data"]],
      body: tabela,
      startY: 20,

      //  CABEÇALHO
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
      },

      //  CORPO
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },

      //  LINHAS ALTERNADAS
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },

      //  BORDAS
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
    });

    doc.save("visitantes.pdf");
  };

  return (
    <>
      <Header />

      <div className="pastor-container">

        {/* VOLTAR */}
        <div className="back" onClick={() => navigate("/")}>
          <FaArrowLeft />
          Voltar para Cadastro
        </div>

        <div className="painel">

          {/* ESQUERDA */}
          <div className="card">
            <h2 className="card-title">
              <FaUsers className="icon" />
              Estatísticas
            </h2>

            <div className="stats-box">
              <span>Total de Visitantes</span>
              <h1>{visitantes.length}</h1>
            </div>

            <div className="ultimos">
              <strong>Últimos Cadastros</strong>

              {visitantes.length === 0 ? (
                <p>Nenhum visitante ainda</p>
              ) : (
                visitantes
                  .slice(-3)
                  .reverse()
                  .map((v, i) => (
                    <div key={i} className="ultimo-item">
                      <span>{v.nome}</span>
                      <span>{v.igreja}</span>
                      <small>{v.data}</small>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* DIREITA */}
          <div className="card">
            <div 
              className="card-header" 
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              
              <h2 className="card-title">
                <FaUsers className="icon" />
                Visitantes Cadastrados
              </h2>

              {/*  BOTÃO PDF */}
              <button
                onClick={gerarPDF}
                disabled={visitantes.length === 0}
                className={`btn-pdf ${visitantes.length === 0 ? "disabled" : ""}`}
              >
                <FaFilePdf /> Gerar PDF
              </button>

            </div>

            <span>Total: {visitantes.length}</span>

            {visitantes.length === 0 ? (
              <div className="empty">
                <FaUsers size={40} color="#9ca3af" />
                <p>Nenhum visitante cadastrado ainda.</p>
              </div>
            ) : (
              <table className="tabela">
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
      </div>
    </>
  );
}
/**/