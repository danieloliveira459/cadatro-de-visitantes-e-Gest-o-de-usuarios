import { useState, useEffect } from "react";
import { GiChurch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // cadastro
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [emailCad, setEmailCad] = useState("");
  const [senhaCad, setSenhaCad] = useState("");
  const [nivel, setNivel] = useState("USER");

  useEffect(() => {
    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

      // cria admin padrão
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

      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

      if (usuarioLogado) {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  }, [navigate]);

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioValido = usuarios.find(
      (u) =>
        u.email.trim() === email.trim() &&
        u.senha.trim() === senha.trim()
    );

    if (usuarioValido) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));
      setErro("");
      navigate("/home", { replace: true });
    } else {
      setErro("Email ou senha incorretos");
    }
  };

  // ABRIR CADASTRO (SEM RESTRIÇÃO)
  const abrirCadastro = () => {
    setMostrarCadastro(!mostrarCadastro);
    setErro("");
  };

  // RECUPERAR SENHA
  const recuperarSenha = () => {
    if (!email) {
      setErro("Digite seu email para recuperar a senha");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
      setErro("Email não encontrado");
      return;
    }

    alert(`Sua senha é: ${usuario.senha}`);
  };

  // CADASTRAR USUÁRIO (SEM RESTRIÇÃO)
  const handleCadastrarUsuario = () => {
    if (!nome || !emailCad || !senhaCad) {
      setErro("Preencha todos os campos");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const existe = usuarios.some((u) => u.email === emailCad);

    if (existe) {
      setErro("Este usuário já existe");
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      nome,
      email: emailCad,
      senha: senhaCad,
      nivel,
    };

    const atualizados = [...usuarios, novoUsuario];

    localStorage.setItem("usuarios", JSON.stringify(atualizados));

    setErro("");
    setMostrarCadastro(false);

    setNome("");
    setEmailCad("");
    setSenhaCad("");
    setNivel("USER");

    alert("Usuário cadastrado com sucesso!");
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

        {/* ESQUECI SENHA */}
        <button
          type="button"
          className="btn-login"
          onClick={recuperarSenha}
        >
          Esqueci minha senha
        </button>

        {/* ABRIR CADASTRO */}
        <button
          type="button"
          className="btn-register"
          onClick={abrirCadastro}
        >
          Cadastrar Usuário
        </button>

        {/* FORM CADASTRO */}
        {mostrarCadastro && (
          <div className="cadastro-box">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={emailCad}
              onChange={(e) => setEmailCad(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              value={senhaCad}
              onChange={(e) => setSenhaCad(e.target.value)}
            />

            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option value="USER">Usuário</option>
              <option value="DIRIGENTE">Dirigente</option>
              <option value="PASTOR">Pastor</option>
              <option value="VICE">Vice</option>
              <option value="ADM">ADM</option>
            </select>

            <button
              type="button"
              onClick={handleCadastrarUsuario}
              className="btn-login"
            >
              Salvar Usuário
            </button>
          </div>
        )}
      </div>
    </div>
  );
}