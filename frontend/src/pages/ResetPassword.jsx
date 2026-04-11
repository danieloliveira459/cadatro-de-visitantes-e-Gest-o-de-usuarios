import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GiPadlock } from "react-icons/gi";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cadatro-de-visitantes-e-gest-o-de.onrender.com";

const API = `${BASE_URL}/api/auth`;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validar = () => {
    if (!novaSenha) return "Digite a nova senha.";
    if (novaSenha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (novaSenha !== confirmarSenha) return "As senhas não coincidem.";
    return null;
  };

  const redefinirSenha = async () => {
    if (loading) return;
    setErro("");

    const mensagemErro = validar();
    if (mensagemErro) return setErro(mensagemErro);

    try {
      setLoading(true);

      const res = await fetch(`${API}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Resposta inválida do servidor.");
      }

      if (!res.ok) throw new Error(data?.erro || "Erro ao redefinir senha.");

      setSucesso(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error("Erro:", err.message);
      setErro(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Token inválido
  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconBox}>
            <GiPadlock size={40} color="#e02020" />
          </div>
          <h2 style={{ ...styles.title, color: "#e02020" }}>Link inválido</h2>
          <p style={styles.subtitle}>Esse link expirou ou não é válido.</p>
          <button style={styles.button} onClick={() => navigate("/")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Sucesso
  if (sucesso) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIconBox}>✓</div>
          <h2 style={{ ...styles.title, color: "#16a34a" }}>Senha redefinida!</h2>
          <p style={styles.subtitle}>Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  // Formulário
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconBox}>
          <GiPadlock size={40} color="#e02020" />
        </div>

        <h2 style={styles.title}>Redefinir Senha</h2>
        <p style={styles.subtitle}>Digite e confirme sua nova senha abaixo</p>

        {/* Campo Nova Senha */}
        <div style={styles.inputWrapper}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </div>

        {/* Campo Confirmar Senha */}
        <div style={styles.inputWrapper}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            style={styles.input}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && redefinirSenha()}
          />
        </div>

        {/* Mostrar senha */}
        <label style={styles.checkLabel}>
          <input
            type="checkbox"
            checked={mostrarSenha}
            onChange={() => setMostrarSenha(!mostrarSenha)}
            style={{ marginRight: "6px" }}
          />
          Mostrar senha
        </label>

        {/* Requisitos de senha */}
        <div style={styles.requisitos}>
          <span style={{ color: novaSenha.length >= 6 ? "#16a34a" : "#aaa" }}>
            {novaSenha.length >= 6 ? "✓" : "○"} Mínimo 6 caracteres
          </span>
          <span style={{ color: novaSenha && novaSenha === confirmarSenha ? "#16a34a" : "#aaa" }}>
            {novaSenha && novaSenha === confirmarSenha ? "✓" : "○"} Senhas coincidem
          </span>
        </div>

        {erro && <p style={styles.erro}>⚠ {erro}</p>}

        <button
          onClick={redefinirSenha}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Redefinindo..." : "Redefinir Senha"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },
  iconBox: {
    marginBottom: "8px",
  },
  title: {
    margin: "10px 0 4px",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
  inputWrapper: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: "13px",
    color: "#555",
    marginBottom: "12px",
    cursor: "pointer",
  },
  requisitos: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    fontSize: "13px",
    marginBottom: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#e02020",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "15px",
    marginTop: "4px",
  },
  erro: {
    color: "#e02020",
    fontSize: "13px",
    marginBottom: "10px",
    textAlign: "left",
  },
  successIconBox: {
    fontSize: "48px",
    color: "#16a34a",
    marginBottom: "8px",
  },
};