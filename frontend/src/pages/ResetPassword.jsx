import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GiPadlock } from "react-icons/gi";

// ✅ BASE_URL seguro (igual ao Login)
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

      // ✅ USANDO API CORRETA (sem BASE_URL perdido)
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

  // ❌ Token inválido
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

  // ✅ Sucesso
  if (sucesso) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={{ ...styles.title, color: "#16a34a" }}>
            Senha redefinida!
          </h2>
          <p style={styles.subtitle}>Redirecionando...</p>
        </div>
      </div>
    );
  }

  // 🧾 Formulário
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <GiPadlock size={40} color="#e02020" />
        <h2 style={styles.title}>Redefinir Senha</h2>
        <p style={styles.subtitle}>
          Digite e confirme sua nova senha abaixo
        </p>

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
          onKeyDown={(e) => e.key === "Enter" && redefinirSenha()}
        />

        {erro && <p style={styles.erro}>{erro}</p>}

        <button
          onClick={redefinirSenha}
          style={styles.button}
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
    margin: "10px 0",
  },
  subtitle: {
    marginBottom: "15px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#e02020",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  erro: {
    color: "red",
    fontSize: "13px",
  },
  successIcon: {
    fontSize: "30px",
    color: "green",
  },
};