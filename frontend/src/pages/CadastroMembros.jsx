import { useState, useEffect } from "react";
import {
  FaChildren,
  FaPerson,
  FaPersonDress,
  FaQrcode,
  FaUsers,
  FaDownload,
  FaTrash,
} from "react-icons/fa6";
import QRCode from "react-qr-code";
import "./CadastroMembros.css";
import Header from "../components/Header";

const ABAS = [
  { id: "criancas", label: "Crianças", singular: "Criança", icon: <FaChildren /> },
  { id: "jovens", label: "Jovens", singular: "Jovem", icon: <FaPerson /> },
  { id: "irmas", label: "Irmãs", singular: "Irmã", icon: <FaPersonDress /> },
  { id: "homens", label: "Homens", singular: "Homem", icon: <FaPerson /> },
  { id: "geral", label: "Cadastro Geral", singular: null, icon: <FaUsers /> },
  { id: "qrcode", label: "QR Code", singular: null, icon: <FaQrcode /> },
];

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cadatro-de-visitantes-e-gest-o-de.onrender.com";

/* ================= FORMULÁRIO ================= */
function Formulario({ tipo, onAtualizar }) {
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const abaAtual = ABAS.find((a) => a.id === tipo);

  useEffect(() => {
    setForm({ nome: "", idade: "", telefone: "", endereco: "" });
    setMsg("");
  }, [tipo]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${BASE_URL}/api/membros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tipo }),
      });

      if (!res.ok) throw new Error();

      setMsg("✅ Cadastrado com sucesso!");
      onAtualizar(); // 🔥 atualiza lista do banco
    } catch {
      setMsg("❌ Erro ao salvar no banco");
    }

    setForm({ nome: "", idade: "", telefone: "", endereco: "" });
    setLoading(false);
  };

  return (
    <div className="card-padrao">
      <h2 className="titulo-card">
        {abaAtual?.icon} Cadastro de {abaAtual?.label}
      </h2>

      {msg && <p className="msg">{msg}</p>}

      <form onSubmit={handleSubmit} className="form-padrao">
        <input
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          name="idade"
          placeholder="Idade"
          value={form.idade}
          onChange={handleChange}
        />

        <input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
        />

        <input
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
        />

        <button className="btn-padrao" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

/* ================= LISTA ================= */
function Lista({ tipo, membros, onAtualizar }) {
  const abaAtual = ABAS.find((a) => a.id === tipo);

  const handleDelete = async (id) => {
    if (!confirm("Deseja remover este membro?")) return;

    try {
      await fetch(`${BASE_URL}/api/membros/${id}`, {
        method: "DELETE",
      });

      onAtualizar();
    } catch {
      alert("Erro ao excluir");
    }
  };

  return (
    <div className="card-padrao">
      <h2 className="titulo-card">
        {abaAtual?.icon} {abaAtual?.label}
      </h2>

      {membros.length === 0 ? (
        <p>Nenhum membro encontrado</p>
      ) : (
        <table className="membro-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {membros.map((m) => (
              <tr key={m.id}>
                <td>{m.nome}</td>
                <td>{m.idade || "-"}</td>
                <td>{m.telefone || "-"}</td>
                <td>
                  <button onClick={() => handleDelete(m.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ================= QR CODE ================= */
function AbaQRCode() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [gerado, setGerado] = useState(false);

  const url = `${window.location.origin}/login?email=${encodeURIComponent(email)}`;

  return (
    <div className="card-padrao">
      <h2 className="titulo-card">
        <FaQrcode /> QR Code
      </h2>

      <form
        className="form-padrao"
        onSubmit={(e) => {
          e.preventDefault();
          setGerado(true);
        }}
      >
        <input
          placeholder="Nome"
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

        <button className="btn-padrao">Gerar</button>
      </form>

      {gerado && (
        <div className="qr-box">
          <h3>{nome}</h3>
          <QRCode value={url} size={180} />
        </div>
      )}
    </div>
  );
}

/* ================= MAIN ================= */
export default function CadastroMembros() {
  const [aba, setAba] = useState("criancas");
  const [membros, setMembros] = useState([]);

  const carregarMembros = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/membros`);
      const data = await res.json();

      setMembros(data);
    } catch {
      console.error("Erro ao carregar membros");
    }
  };

  useEffect(() => {
    carregarMembros();
  }, []);

  const membrosFiltrados = membros.filter((m) => m.tipo === aba);

  return (
    <>
      <Header />

      <div className="membros-container">
        <div className="tabs">
          {ABAS.map((a) => (
            <button
              key={a.id}
              className={aba === a.id ? "tab ativa" : "tab"}
              onClick={() => setAba(a.id)}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        {aba === "qrcode" ? (
          <AbaQRCode />
        ) : (
          <div className="two-col">
            <Formulario tipo={aba} onAtualizar={carregarMembros} />
            <Lista
              tipo={aba}
              membros={membrosFiltrados}
              onAtualizar={carregarMembros}
            />
          </div>
        )}
      </div>
    </>
  );
}