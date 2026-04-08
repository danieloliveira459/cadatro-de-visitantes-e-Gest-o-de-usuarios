import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GiPadlock } from "react-icons/gi";

const API =
  import.meta.env.VITE_API_URL ||
  "https://cadatro-de-visitantes-e-gest-o-de.onrender.com";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

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

      const res = await fetch(`${API}/api/auth/reset`, {
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

  // — Token inválido —
  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <GiPadlock size={40} color="#e02020" />
          <h2 style={{ ...styles.title, color: "#e02020" }}>Link inválido</h2>
          <p style={styles.subtitle}>Esse link expirou ou não é válido.</p>
          <button style={styles.button} onClick={() => navigate("/")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // — Sucesso —
  if (sucesso) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={{ ...styles.title, color: "#16a34a" }}>Senha redefinida!</h2>
          <p style={styles.subtitle}>Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  // — Formulário —
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <GiPadlock size={40} color="#e02020" />
        <h2 style={styles.title}>Redefinir Senha</h2>
        <p style={styles.subtitle}>Digite e confirme sua nova senha abaixo</p>

        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          style={styles.input}
          disabled={loading}
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          style={styles.input}
          disabled={loading}
          autoComplete="new-password"
          onKeyDown={(e) => e.key === "Enter" && redefinirSenha()}
        />

        {erro && <p style={styles.erro}>{erro}</p>}

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
    width: "350px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  title: {
    margin: "8px 0 4px",
    color: "#333",
    fontSize: "20px",
  },
  subtitle: {
    marginBottom: "12px",
    color: "#555",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#e02020",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "4px",
  },
  erro: {
    color: "#e02020",
    fontSize: "13px",
    marginBottom: "8px",
    width: "100%",
    textAlign: "left",
  },
  successIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};