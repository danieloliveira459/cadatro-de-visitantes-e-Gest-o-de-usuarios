import { useState } from "react";
import { FaChildren, FaPerson, FaPersonDress, FaQrcode, FaUsers, FaDownload, FaPrint } from "react-icons/fa6";
import { QRCodeSVG } from "qrcode.react";
import "./CadastroMembros.css";

const ABAS = [
  { id: "criancas",      label: "Crianças",      icon: <FaChildren /> },
  { id: "jovens",        label: "Jovens",         icon: <FaPerson /> },
  { id: "irmas",         label: "Irmãs",          icon: <FaPersonDress /> },
  { id: "varones",       label: "Varões",         icon: <FaPerson /> },
  { id: "geral",         label: "Cadastro Geral", icon: <FaUsers /> },
  { id: "qrcode",        label: "QR Code",        icon: <FaQrcode /> },
];

const CAMPOS_BASE = [
  { name: "nome",      label: "Nome completo *", type: "text",  required: true },
  { name: "telefone",  label: "Telefone",        type: "tel",   required: false },
  { name: "endereco",  label: "Endereço",        type: "text",  required: false },
  { name: "dataNasc",  label: "Data de nascimento", type: "date", required: false },
];

const CAMPOS_EXTRA = {
  criancas: [
    { name: "responsavel", label: "Nome do responsável *", type: "text", required: true },
    { name: "idade",       label: "Idade",                 type: "number", required: false },
  ],
  jovens: [
    { name: "funcao", label: "Função na igreja", type: "text", required: false },
  ],
  irmas: [
    { name: "ministerio", label: "Ministério", type: "text", required: false },
  ],
  varones: [
    { name: "ministerio", label: "Ministério", type: "text", required: false },
  ],
  geral: [
    { name: "categoria",  label: "Categoria", type: "select", required: false,
      options: ["Criança", "Jovem", "Irmã", "Varão", "Outro"] },
    { name: "ministerio", label: "Ministério", type: "text", required: false },
  ],
};

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cadatro-de-visitantes-e-gest-o-de.onrender.com";

function FormularioMembro({ categoria }) {
  const camposExtras = CAMPOS_EXTRA[categoria] || [];
  const todosCampos = [...CAMPOS_BASE, ...camposExtras];

  const estadoInicial = todosCampos.reduce((acc, c) => ({ ...acc, [c.name]: "" }), {});
  const [form, setForm]         = useState(estadoInicial);
  const [loading, setLoading]   = useState(false);
  const [sucesso, setSucesso]   = useState("");
  const [erro, setErro]         = useState("");
  const [membros, setMembros]   = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/membros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, categoria }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErro(data?.erro || "Erro ao cadastrar membro.");
        return;
      }

      setSucesso("Membro cadastrado com sucesso!");
      setMembros((prev) => [...prev, { ...form, categoria, id: Date.now() }]);
      setForm(estadoInicial);
    } catch {
      // fallback local se API não tiver a rota ainda
      setSucesso("Membro salvo localmente!");
      setMembros((prev) => [...prev, { ...form, categoria, id: Date.now() }]);
      setForm(estadoInicial);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="membro-layout">
      {/* Formulário */}
      <div className="membro-form-box">
        <h2 className="membro-titulo">
          {ABAS.find((a) => a.id === categoria)?.icon} Cadastrar{" "}
          {ABAS.find((a) => a.id === categoria)?.label}
        </h2>

        {erro    && <p className="msg-erro">{erro}</p>}
        {sucesso && <p className="msg-sucesso">{sucesso}</p>}

        <form onSubmit={handleSubmit} className="membro-form">
          {todosCampos.map((campo) => (
            <div key={campo.name} className="campo-grupo">
              <label>{campo.label}</label>
              {campo.type === "select" ? (
                <select name={campo.name} value={form[campo.name]} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  {campo.options.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={campo.type}
                  name={campo.name}
                  value={form[campo.name]}
                  onChange={handleChange}
                  required={campo.required}
                  placeholder={campo.label.replace(" *", "")}
                />
              )}
            </div>
          ))}

          <button type="submit" className="btn-cadastrar" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="membro-lista-box">
        <h3>Membros cadastrados <span className="badge-count">{membros.length}</span></h3>
        {membros.length === 0 ? (
          <p className="lista-vazia">Nenhum membro cadastrado ainda.</p>
        ) : (
          <table className="membro-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Data Nasc.</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}</td>
                  <td>{m.telefone || "—"}</td>
                  <td>{m.dataNasc || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AbaQRCode() {
  const [nomeQR, setNomeQR]   = useState("");
  const [emailQR, setEmailQR] = useState("");
  const [gerado, setGerado]   = useState(false);

  // URL que o QR vai apontar — leva o membro direto para o login com email pré-preenchido
  const urlAcesso = `${window.location.origin}/login?email=${encodeURIComponent(emailQR)}`;

  const handleGerar = (e) => {
    e.preventDefault();
    if (!nomeQR || !emailQR) return;
    setGerado(true);
  };

  const handleImprimir = () => window.print();

  const handleDownload = () => {
    const svg = document.querySelector("#qr-svg svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${nomeQR}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="qr-layout">
      <div className="qr-form-box">
        <h2 className="membro-titulo"><FaQrcode /> Gerar QR Code de Acesso</h2>
        <p className="qr-desc">
          O QR Code gerado leva o membro direto para a tela de login
          com o e-mail pré-preenchido.
        </p>

        <form onSubmit={handleGerar} className="membro-form">
          <div className="campo-grupo">
            <label>Nome do membro *</label>
            <input
              type="text"
              value={nomeQR}
              onChange={(e) => { setNomeQR(e.target.value); setGerado(false); }}
              placeholder="Nome completo"
              required
            />
          </div>
          <div className="campo-grupo">
            <label>E-mail de acesso *</label>
            <input
              type="email"
              value={emailQR}
              onChange={(e) => { setEmailQR(e.target.value); setGerado(false); }}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <button type="submit" className="btn-cadastrar">Gerar QR Code</button>
        </form>
      </div>

      {gerado && (
        <div className="qr-resultado" id="qr-svg">
          <div className="qr-card">
            <p className="qr-nome">{nomeQR}</p>
            <QRCodeSVG
              value={urlAcesso}
              size={200}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
              level="H"
              includeMargin
            />
            <p className="qr-url">{urlAcesso}</p>
            <p className="qr-hint">Escaneie para acessar o sistema</p>

            <div className="qr-acoes">
              <button className="btn-qr-acao" onClick={handleDownload}>
                <FaDownload /> Baixar SVG
              </button>
              <button className="btn-qr-acao" onClick={handleImprimir}>
                <FaPrint /> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CadastroMembros() {
  const [abaAtiva, setAbaAtiva] = useState("criancas");

  return (
    <div className="membros-container">
      {/* Tabs */}
      <nav className="membros-tabs">
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            className={`tab-btn ${abaAtiva === aba.id ? "tab-ativa" : ""}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.icon} {aba.label}
          </button>
        ))}
      </nav>

      {/* Conteúdo */}
      <div className="membros-conteudo">
        {abaAtiva === "qrcode" ? (
          <AbaQRCode />
        ) : (
          <FormularioMembro categoria={abaAtiva} />
        )}
      </div>
    </div>
  );
}