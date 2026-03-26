import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  //  Carregar usuários
  useEffect(() => {
    try {
      const lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
      setUsuarios(lista);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsuarios([]);
    }
  }, []);

  // =========================
  // FORMATAÇÕES
  // =========================
  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatarTelefone = (valor) => {
    valor = valor.replace(/\D/g, "");

    if (valor.length <= 10) {
      return valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    } else {
      return valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }
  };

  // =========================
  // CADASTRAR
  // =========================
  const handleCadastrar = (e) => {
    e.preventDefault();

    const existe = usuarios.find((u) => u.email === email.trim());

    if (existe) {
      alert("Usuário já existe!");
      return;
    }

    const novoUsuario = {
      id: Date.now(), // ✅ ID único
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
      cpf,
      telefone,
      nivel: "Atendente", // padrão
    };

    const listaAtualizada = [...usuarios, novoUsuario];

    localStorage.setItem("usuarios", JSON.stringify(listaAtualizada));
    setUsuarios(listaAtualizada);

    alert("Usuário cadastrado com sucesso!");

    setNome("");
    setEmail("");
    setSenha("");
    setCpf("");
    setTelefone("");
  };

  // =========================
  // REMOVER
  // =========================
  const handleRemover = (emailUsuario) => {
    const usuario = usuarios.find((u) => u.email === emailUsuario);

    //  Protege admin padrão
    if (usuario?.email === "admin@admin.com") {
      alert("Não pode excluir o admin padrão!");
      return;
    }

    const listaAtualizada = usuarios.filter(
      (u) => u.email !== emailUsuario
    );

    localStorage.setItem("usuarios", JSON.stringify(listaAtualizada));
    setUsuarios(listaAtualizada);
  };

  return (
    <div className="admin-container">
      <div className="admin-card">

        <button
          className="btn-voltar"
          onClick={() => navigate("/home")}
        >
          ← Voltar
        </button>

        <h2>Administração de Usuários</h2>

        <form className="admin-form" onSubmit={handleCadastrar}>
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(formatarCPF(e.target.value))}
            required
          />

          <input
            placeholder="Telefone"
            value={telefone}
            onChange={(e) =>
              setTelefone(formatarTelefone(e.target.value))
            }
            required
          />

          <input
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Cadastrar Usuário</button>
        </form>

        <div className="admin-list">
          <h3>Usuários Cadastrados</h3>

          {usuarios.length === 0 ? (
            <p>Nenhum usuário cadastrado</p>
          ) : (
            <table className="tabela-usuarios">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.cpf}</td>
                    <td>{u.telefone}</td>
                    <td>
                      <button
                        className="btn-remover"
                        onClick={() => handleRemover(u.email)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}