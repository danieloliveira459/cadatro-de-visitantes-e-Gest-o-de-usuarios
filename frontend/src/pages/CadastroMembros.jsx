import { useState } from "react";
import {
  FaChildren,
  FaPerson,
  FaPersonDress,
  FaUsers,
  FaQrcode,
} from "react-icons/fa6";
import QRCode from "react-qr-code";
import "./CadastroMembros.css";

const ABAS = [
  { id: "criancas", label: "Crianças", icon: <FaChildren /> },
  { id: "jovens", label: "Jovens", icon: <FaPerson /> },
  { id: "irmas", label: "Irmãs", icon: <FaPersonDress /> },
  { id: "varoes", label: "Varões", icon: <FaPerson /> },
  { id: "geral", label: "Cadastro Geral", icon: <FaUsers /> },
  { id: "qrcode", label: "QR Code", icon: <FaQrcode /> },
];

export default function CadastroMembros() {
  const [aba, setAba] = useState("criancas");
  const [membros, setMembros] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
  });

  const [qrNome, setQrNome] = useState("");
  const [qrEmail, setQrEmail] = useState("");
  const [gerado, setGerado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setMembros((prev) => [
      ...prev,
      { ...form, categoria: aba, id: Date.now() },
    ]);

    setForm({ nome: "", telefone: "" });
  };

  const url = `${window.location.origin}/login?email=${qrEmail}`;

  return (
    <div className="container">

      {/* 🔙 VOLTAR */}
      <div style={{ marginBottom: 20 }}>
        ← Voltar para Cadastro
      </div>

      {/* 📑 ABAS */}
      <div className="tabs">
        {ABAS.map((item) => (
          <button
            key={item.id}
            className={`tab ${aba === item.id ? "active" : ""}`}
            onClick={() => setAba(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* 📊 CONTEÚDO */}
      {aba !== "qrcode" && (
        <div className="painel">

          {/* CARD ESTATÍSTICAS */}
          <div className="card">
            <h2 className="card-title">
              <FaUsers /> Estatísticas
            </h2>

            <div className="stats-box">
              <span>Total de Membros</span>
              <h1>{membros.length}</h1>
            </div>
          </div>

          {/* CARD LISTA */}
          <div className="card">
            <h2 className="card-title">
              <FaUsers /> Membros Cadastrados
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="form">
              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
                required
              />

              <input
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
                }
              />

              <button className="btn-primary">
                Cadastrar
              </button>
            </form>

            {/* TABELA */}
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Categoria</th>
                </tr>
              </thead>

              <tbody>
                {membros.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nome}</td>
                    <td>{m.telefone}</td>
                    <td>{m.categoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🔳 QR CODE */}
      {aba === "qrcode" && (
        <div className="painel">

          <div className="card">
            <h2 className="card-title">
              <FaQrcode /> Gerar QR Code
            </h2>

            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                setGerado(true);
              }}
            >
              <input
                placeholder="Nome"
                value={qrNome}
                onChange={(e) => setQrNome(e.target.value)}
                required
              />

              <input
                placeholder="Email"
                value={qrEmail}
                onChange={(e) => setQrEmail(e.target.value)}
                required
              />

              <button className="btn-primary">
                Gerar QR Code
              </button>
            </form>
          </div>

          {gerado && (
            <div className="card" style={{ textAlign: "center" }}>
              <h3>{qrNome}</h3>

              <QRCode value={url} size={180} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}