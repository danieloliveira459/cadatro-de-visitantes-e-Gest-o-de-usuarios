import Header from "../components/Header";
import "./AceitaramJesus.css";
import { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { PiUserSwitchLight } from "react-icons/pi";

export default function AceitaramJesus() {

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [total, setTotal] = useState(() => {
    const dados = JSON.parse(localStorage.getItem("aceitaramJesus") || "[]");
    return dados.length;
  });

  const handleCadastrar = () => {
    if (!nome) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const novo = {
      nome,
      telefone,
      endereco,
      observacoes,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    const lista = JSON.parse(localStorage.getItem("aceitaramJesus")) || [];
    lista.push(novo);

    localStorage.setItem("aceitaramJesus", JSON.stringify(lista));

    // Atualiza total
    setTotal(lista.length);

    // Limpa campos
    setNome("");
    setTelefone("");
    setEndereco("");
    setObservacoes("");

    alert("Cadastro realizado com sucesso!");
  };

  return (
    <>
      <Header />

      <div className="container">
        <div className="grid">

          {/* FORMULÁRIO */}
          <div className="card">
            <h2><PiUserSwitchLight color="#e02020" /> Cadastro de quem aceitou Jesus</h2>

            <label>Nome *</label>
            <input
              type="text"
              placeholder="Ex: Daniel"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Telefone</label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <label>Endereço</label>
            <input
              type="text"
              placeholder="Rua, número, bairro, cidade"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <label>Observações Gerais</label>
            <textarea
              placeholder="Informações adicionais..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />

            <button className="btn-cadastrar" onClick={handleCadastrar}>
              Cadastrar 
            </button>
          </div>

          {/* LADO DIREITO */}
          <div className="card">
            <h2><PiUserSwitchLight color="#e02020" /> Informações</h2>

            <div className="alert">
              <FaUserSlash color="#e02020" />
              <div className="total-info">
                <p>Total de Registros</p>
                <h1>{total}</h1>
              </div>
            </div>

            <h3>Sobre este Cadastro</h3>

            <p>
              Este formulário permite registrar informações de pessoas que aceitaram Jesus.
            </p>

            <p>
              Os dados ajudam no acompanhamento e relacionamento com essas pessoas.
            </p>

            <p>
              Todos os registros ficam disponíveis no Painel do Pastor.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}