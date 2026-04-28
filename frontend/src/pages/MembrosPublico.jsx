import { useState, useEffect, useRef } from "react";
import { FaChildren, FaPerson, FaPersonDress, FaCamera, FaDownload, FaTrash, FaCheck, FaPlus, FaUsers } from "react-icons/fa6";

/* ================= COMPONENTE CAMERA MODAL ================= */
function CameraModal({ onCapturar, onFechar }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamAtivo, setStreamAtivo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamAtivo(true);
        }
      })
      .catch(() => setErro("Câmera não disponível ou permissão negada."));
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const capturar = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.85);
    
    video.srcObject?.getTracks().forEach((t) => t.stop());
    onCapturar(base64);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 20,
        maxWidth: 400, width: "90%", textAlign: "center",
      }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Tirar Foto</h3>
        {erro ? (
          <p style={{ color: "#dc2626", fontSize: 13 }}>{erro}</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline
            style={{ width: "100%", borderRadius: 10, background: "#000" }} />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
          {streamAtivo && (
            <button onClick={capturar} style={{
              padding: "9px 20px", background: "#dc2626", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer",
            }}>
              📸 Capturar
            </button>
          )}
          <button onClick={onFechar} style={{
            padding: "9px 20px", background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer",
          }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= CONFIGURAÇÕES E HELPERS ================= */
const ABAS = [
  { id: "criancas", label: "Crianças",  Icon: FaChildren    },
  { id: "jovens",   label: "Jovens",    Icon: FaPerson      },
  { id: "mulheres", label: "Mulheres",  Icon: FaPersonDress },
  { id: "homens",   label: "Homens",    Icon: FaPerson      },
];

const BASE_URL = import.meta.env.VITE_API_URL || "https://cadatro-de-visitantes-e-gest-o-de-ukhv.onrender.com";

const OPCOES_SEXO           = ["Masculino", "Feminino", "Outro"];
const OPCOES_ESTADO_CIVIL   = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "Outro"];
const OPCOES_GRAU_INSTRUCAO = ["Sem instrução", "Fundamental Incompleto", "Fundamental Completo", "Médio Incompleto", "Médio Completo", "Superior Incompleto", "Superior Completo", "Pós-Graduação", "Mestrado", "Doutorado"];

function formatarCPF(v) { return v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"); }
function formatarTelefone(v) { const d = v.replace(/\D/g, "").slice(0, 11); if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2"); return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2"); }
function ocultarCPF(cpf) { if (!cpf) return "—"; const d = cpf.replace(/\D/g, ""); if (d.length < 11) return "—"; return `${d.slice(0, 3)}.***.***-${d.slice(9, 11)}`; }

function lerArquivoBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

function baixarFoto(base64, nome) {
  const a = document.createElement("a");
  a.href = base64;
  a.download = nome || "foto.jpg";
  a.click();
}

const formVazio = () => ({
  nome: "", cpf: "", dataNascimento: "", sexo: "",
  tituloEclesiastico: "", estadoCivil: "", grauInstrucao: "",
  nacionalidade: "", naturalidade: "", telefone: "",
  foto: "", fotoMime: "", fotoNome: "",
});

/* ================= COMPONENTE PRINCIPAL ================= */
export default function MembrosPublico({ abaInicial = "criancas" }) {
  const abaValida = ABAS.find((a) => a.id === abaInicial) ? abaInicial : "criancas";

  const [aba, setAba]           = useState(abaValida);
  const [view, setView]         = useState("lista");
  const [membros, setMembros]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso]   = useState(false);
  const [erro, setErro]         = useState("");
  const [form, setForm]         = useState(formVazio());
  const fotoRef                 = useRef(null);

  // NOVO: Estado para controlar o Modal da Câmera
  const [cameraAberta, setCameraAberta] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/${aba}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setMembros)
      .catch(() => setMembros([]))
      .finally(() => setLoading(false));
  }, [aba]);

  const trocarAba = (id) => {
    setAba(id);
    setView("lista");
    setForm(formVazio());
    setErro("");
    setSucesso(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cpf")      v = formatarCPF(value);
    if (name === "telefone") v = formatarTelefone(value);
    setForm((p) => ({ ...p, [name]: v }));
  };

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await lerArquivoBase64(file);
    setForm((p) => ({ ...p, foto: base64, fotoMime: file.type, fotoNome: file.name }));
  };

  // NOVO: Função para receber foto da câmera
  const handleFotoCamera = (base64) => {
    setForm((prev) => ({
      ...prev,
      foto: base64,
      fotoMime: "image/jpeg",
      fotoNome: `foto-camera-${Date.now()}.jpg`,
    }));
    setCameraAberta(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) { setErro("Nome é obrigatório."); return; }
    setSalvando(true);
    setErro("");

    try {
      const res = await fetch(`${BASE_URL}/api/${aba}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Erro ao salvar.");
      }

      const salvo = await res.json();
      setMembros((p) => [salvo, ...p]);
      setSucesso(true);
      setForm(formVazio());
      if (fotoRef.current) fotoRef.current.value = "";
      setTimeout(() => { setSucesso(false); setView("lista"); }, 1800);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const abaAtual = ABAS.find((a) => a.id === aba);
  const IconeAba = abaAtual?.Icon;

  return (
    <div style={{ minHeight: "100vh", background: "#fff8f8", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* NOVO: Renderização condicional do Modal */}
      {cameraAberta && (
        <CameraModal 
          onCapturar={handleFotoCamera} 
          onFechar={() => setCameraAberta(false)} 
        />
      )}

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        color: "#fff", padding: "18px 20px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 3px 12px rgba(220,38,38,0.35)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FaUsers size={22} />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.3 }}>Cadastro de Membros</span>
        </div>
        <button
          onClick={() => { setView(view === "form" ? "lista" : "form"); setErro(""); setSucesso(false); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: view === "form" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.5)",
            color: "#fff", borderRadius: 8, padding: "7px 14px",
            cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}
        >
          {view === "form" ? "← Lista" : <><FaPlus size={12} /> Cadastrar</>}
        </button>
      </div>

      {/* ABAS */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "2.5px solid #fca5a5", background: "#fff" }}>
        {ABAS.map((a) => (
          <button key={a.id} onClick={() => trocarAba(a.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", border: "none",
            borderBottom: aba === a.id ? "3px solid #dc2626" : "3px solid transparent",
            cursor: "pointer", fontWeight: aba === a.id ? 700 : 500, fontSize: 13,
            background: "transparent", color: aba === a.id ? "#dc2626" : "#9ca3af",
          }}>
            <a.Icon size={14} /> {a.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 14px", maxWidth: 700, margin: "0 auto" }}>
        {view === "form" && (
          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 8 }}>
              {IconeAba && <IconeAba color="#fff" size={18} />}
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Cadastrar em {abaAtual?.label}</span>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "20px 20px 24px" }}>
              {/* SEÇÃO DE FOTO ATUALIZADA */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 24 }}>
                {form.foto ? (
                  <img src={form.foto} alt="preview" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #dc2626" }} />
                ) : (
                  <div onClick={() => fotoRef.current?.click()} style={{ width: 100, height: 100, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", border: "2.5px dashed #fca5a5", cursor: "pointer" }}>
                    <FaCamera size={28} color="#dc2626" />
                  </div>
                )}

                <input ref={fotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFoto} />

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  <BtnSecundario onClick={() => fotoRef.current?.click()}>
                    <FaPlus size={12} /> Arquivo
                  </BtnSecundario>
                  
                  {/* BOTÃO DA CÂMERA */}
                  <BtnSecundario onClick={() => setCameraAberta(true)} cor="#dc2626">
                    <FaCamera size={12} /> Tirar Foto
                  </BtnSecundario>

                  {form.foto && (
                    <BtnSecundario cor="#dc2626" onClick={() => { setForm((p) => ({ ...p, foto: "", fotoMime: "", fotoNome: "" })); if (fotoRef.current) fotoRef.current.value = ""; }}>
                      <FaTrash size={11} /> Remover
                    </BtnSecundario>
                  )}
                </div>
              </div>

              {/* CAMPOS DO FORMULÁRIO */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                <Campo label="Nome Completo *" span={2}>
                  <input name="nome" value={form.nome} onChange={handleChange} placeholder="Digite o nome completo" style={inputStyle} />
                </Campo>
                <Campo label="CPF">
                  <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} style={inputStyle} />
                </Campo>
                <Campo label="Data de Nascimento">
                  <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} style={inputStyle} />
                </Campo>
                <Campo label="Sexo">
                  <select name="sexo" value={form.sexo} onChange={handleChange} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {OPCOES_SEXO.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Campo>
                <Campo label="Número de Telefone">
                  <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" maxLength={16} style={inputStyle} />
                </Campo>
                {/* ... outros campos permanecem iguais ... */}
              </div>

              <button type="submit" disabled={salvando} style={{
                marginTop: 20, width: "100%", padding: "13px",
                background: salvando ? "#fca5a5" : "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: salvando ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                {salvando ? "Salvando..." : <><FaCheck size={14} /> Cadastrar Membro</>}
              </button>
            </form>
          </div>
        )}

        {/* LISTA (CardMembro) permanece igual */}
        {view === "lista" && (
           <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
             {/* ... conteúdo da lista ... */}
             {loading ? <p style={{textAlign: 'center', padding: 20}}>Carregando...</p> : membros.map((m, i) => <CardMembro key={i} m={m} index={i} />)}
           </div>
        )}
      </div>
    </div>
  );
}

// Mantenha os sub-componentes (CardMembro, Campo, BtnSecundario, DetalheItem) e o inputStyle originais abaixo...
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#111", background: "#fafafa", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };

function Campo({ label, children, span = 1 }) { return <div style={{ gridColumn: `span ${span}` }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>{label}</label>{children}</div>; }
function BtnSecundario({ children, onClick, cor = "#374151" }) { return <button type="button" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, color: cor, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{children}</button>; }

function CardMembro({ m, index }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #fee2e2", background: index % 2 === 0 ? "#fff" : "#fff8f8" }}>
      <div onClick={() => setAberto(!aberto)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
        {m.foto ? <img src={m.foto} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} /> : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}><FaCamera size={16} color="#dc2626" /></div>}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{m.nome}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{m.tituloEclesiastico || "Membro"}</div>
        </div>
        <span>{aberto ? "▲" : "▼"}</span>
      </div>
      {aberto && <div style={{ padding: "10px 16px 16px 72px", fontSize: 13 }}>
          <p><strong>CPF:</strong> {ocultarCPF(m.cpf)}</p>
          <p><strong>Telefone:</strong> {m.telefone || "—"}</p>
      </div>}
    </div>
  );
}