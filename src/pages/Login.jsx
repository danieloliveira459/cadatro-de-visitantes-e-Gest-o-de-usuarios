import { useState, useEffect } from "react";
import { GiChurch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

      // ✅ cria admin padrão com nível
      if (usuarios.length === 0) {
        const admin = [
          {
            id: 1,
            nome: "Admin",
            email: "admin@admin.com",
            senha: "123456",
            nivel: "ADM",
          },
        ];
        localStorage.setItem("usuarios", JSON.stringify(admin));
      }

      // ✅ verifica se já está logado
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

      if (usuarioLogado) {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioValido = usuarios.find(
      (u) =>
        u.email.trim() === email.trim() &&
        u.senha.trim() === senha.trim()
    );

    if (usuarioValido) {
      // ✅ salva usuário completo
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioValido)
      );

      setErro("");

      // ✅ redireciona corretamente
      if (usuarioValido.nivel === "ADM") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }

    } else {
      setErro("Email ou senha incorretos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1><GiChurch color="#e02020" /> ADTAG</h1>
        <h2>LOGIN</h2>

        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

        <button
          type="button"
          className="btn-register"
          onClick={() => navigate("/admin")}
        >
          Cadastrar Usuário
        </button>
      </div>
    </div>
  );
}