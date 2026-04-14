import { useState, useEffect } from "react";
import {
  FaChildren,
  FaPerson,
  FaPersonDress,
  FaQrcode,
  FaUsers,
  FaDownload,
} from "react-icons/fa6";
import QRCode from "react-qr-code";
import "./CadastroMembros.css";
import Header from "../components/Header";

const ABAS = [
  { id: "criancas", label: "Crianças", icon: <FaChildren /> },
  { id: "jovens", label: "Jovens", icon: <FaPerson /> },
  { id: "irmas", label: "Irmãs", icon: <FaPersonDress /> },
  { id: "varoes", label: "Varões", icon: <FaPerson /> },
  { id: "geral", label: "Cadastro Geral", icon: <FaUsers /> },
  { id: "qrcode", label: "QR Code", icon: <FaQrcode /> },
];

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cadatro-de-visitantes-e-gest-o-de.onrender.com";

/* ================= FORM + LISTA ================= */
function Formulario({ tipo }) {
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 🔥 CARREGAR MEMBROS
  useEffect(() => {
    buscarMembros();
  }, [tipo]);

  const buscarMembros = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/membros`);
      const data = await res.json();

      // filtra por tipo (aba)
      const filtrados =
        tipo === "geral"
          ? data
          : data.filter((m) => m.tipo === tipo);

      setMembros(filtrados);
    } catch {
      setMembros([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const novo = { ...form, tipo };

    try {
      const res = await fetch(`${BASE_URL}/api/membros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      });

      if (!res.ok) throw new Error();

      setMsg("✅ Cadastrado com sucesso!");
      buscarMembros();
    } catch {
      setMsg("⚠️ Salvo localmente");

      setMembros((prev) => [
        ...prev,
        { ...novo, id: Date.now() },
      ]);
    }

    setForm({
      nome: "",
      idade: "",
      telefone: "",
      endereco: "",
    });

    setLoading(false);
  };

  const abaAtual = ABAS.find((a) => a.id === tipo);

  return (
    <div className="membro-layout">
      {/* FORM */}
      <div className="membro-form-box">
        <h2 className="membro-titulo">
          {abaAtual?.icon} Cadastro de {abaAtual?.label}
        </h2>

        {msg && <p className="msg-sucesso">{msg}</p>}

        <form onSubmit={handleSubmit} className="membro-form">
          <input
            name="nome"
            placeholder="Digite o nome completo"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <input
            name="idade"
            placeholder="Digite a idade"
            value={form.idade}
            onChange={handleChange}
          />

          <input
            name="telefone"
            placeholder="(00) 00000-0000"
            value={form.telefone}
            onChange={handleChange}
          />

          <input
            name="endereco"
            placeholder="Digite o endereço completo"
            value={form.endereco}
            onChange={handleChange}
          />

          <button className="btn-cadastrar" disabled={loading}>
            {loading ? "Salvando..." : `Cadastrar ${abaAtual?.label}`}
          </button>
        </form>
      </div>

      {/* LISTA (IGUAL VISITANTES) */}
      <div className="membro-lista-box">
        <h3>
          Membros cadastrados{" "}
          <span className="badge-count">{membros.length}</span>
        </h3>

        {membros.length === 0 ? (
          <p className="lista-vazia">Nenhum membro cadastrado.</p>
        ) : (
          <table className="membro-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Telefone</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}</td>
                  <td>{m.idade || "-"}</td>
                  <td>{m.telefone || "-"}</td>
                  <td>{m.endereco || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================= QR CODE ================= */
function AbaQRCode() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [gerado, setGerado] = useState(false);

  const url = `${window.location.origin}/login?email=${encodeURIComponent(email)}`;

  const baixar = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;

    const blob = new Blob(
      [new XMLSerializer().serializeToString(svg)],
      { type: "image/svg+xml" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `qrcode-${nome}.svg`;
    a.click();
  };

  return (
    <div className="qr-layout">
      <div className="qr-form-box">
        <h2 className="membro-titulo">
          <FaQrcode /> Gerar QR Code
        </h2>

        <form
          className="membro-form"
          onSubmit={(e) => {
            e.preventDefault();
            setGerado(true);
          }}
        >
          <input
            placeholder="Nome do membro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="btn-cadastrar">
            Gerar QR Code
          </button>
        </form>
      </div>

      {gerado && (
        <div className="qr-resultado">
          <div className="qr-card">
            <h3>{nome}</h3>
            <QRCode value={url} size={180} />

            <button className="btn-qr-acao" onClick={baixar}>
              <FaDownload /> Baixar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MAIN ================= */
export default function CadastroMembros() {
  const [aba, setAba] = useState("criancas");

  return (
    <>
      <Header />

      <div className="membros-container">
        {/* TABS */}
        <div className="membros-tabs">
          {ABAS.map((a) => (
            <button
              key={a.id}
              className={`tab-btn ${aba === a.id ? "tab-ativa" : ""}`}
              onClick={() => setAba(a.id)}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO */}
        {aba === "qrcode" ? (
          <AbaQRCode />
        ) : (
          <Formulario tipo={aba} />
        )}
      </div>
    </>
  );
}