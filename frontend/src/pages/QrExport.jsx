import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function QrExport() {
  const [params] = useSearchParams();

  useEffect(() => {
    const dataParam = params.get("data");

    if (!dataParam) return;

    try {
      const membros = JSON.parse(decodeURIComponent(dataParam));

      gerarPDF(membros);
    } catch (err) {
      console.error("Erro ao ler QR Code");
    }
  }, []);

  const gerarPDF = async (membros) => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF("landscape");

    doc.text("Lista de Membros (QR Code)", 14, 16);

    autoTable(doc, {
      head: [["Nome", "CPF", "Naturalidade", "Nascimento", "Cargo"]],
      body: membros.map((m) => [
        m.nome,
        m.cpf,
        m.naturalidade,
        m.dataNascimento,
        m.cargo,
      ]),
    });

    doc.save("membros-qrcode.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gerando PDF...</h2>
      <p>Aguarde, o download começará automaticamente.</p>
    </div>
  );
}