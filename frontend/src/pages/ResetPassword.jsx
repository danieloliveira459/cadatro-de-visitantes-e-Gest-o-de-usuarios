import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GiPadlock } from "react-icons/gi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const redefinirSenha = async () => {
    setErro("");

    if (!token) {
      setErro("Token inválido ou expirado. Solicite um novo link.");
      return;
    }
    if (!novaSenha) {
      setErro("Digite a nova senha.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const API = import.meta.env.VITE_API_URL || "/api";

      const res = await fetch(`${API}/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErro(data.erro || "Erro ao redefinir senha.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Token ausente na URL
  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ ...styles.title, color: "#e02020" }}>
            <GiPadlock color="#e02020" /> Link Inválido
          </h2>
          <p style={styles.subtitle}>
            Este link é inválido ou expirou. Solicite um novo link de
            redefinição de senha.
          </p>
          <button style={styles.button} onClick={() => navigate("/")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Senha redefinida com sucesso
  if (sucesso) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ ...styles.title, color: "#28a745" }}>✅ Senha Redefinida!</h2>
          <p style={styles.subtitle}>
            Sua senha foi alterada com sucesso. Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <GiPadlock color="#e02020" /> Redefinir Senha
        </h2>

        <p style={styles.subtitle}>Digite sua nova senha abaixo</p>

        {erro && <p style={styles.erro}>{erro}</p>}

        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

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
  },
  title: {
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#555",
    fontSize: "14px",
  },
  erro: {
    marginBottom: "16px",
    padding: "10px",
    backgroundColor: "#ffeaea",
    color: "#c0392b",
    borderRadius: "8px",
    fontSize: "13px",
    border: "1px solid #f5c6cb",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
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
    transition: "opacity 0.2s",
  },
};