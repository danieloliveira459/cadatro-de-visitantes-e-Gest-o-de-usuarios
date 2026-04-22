import { db } from "../config/db.js";
import { getSegundaFeira } from "../utils/semana.js";

// LISTAR — só da semana atual
export const listarCadastroGeral = async (req, res) => {
  try {
    const semana = getSegundaFeira();
    const [rows] = await db.query(
      "SELECT * FROM cadastro_geral WHERE semana = ? ORDER BY data DESC",
      [semana]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("ERRO LISTAR:", err);
    return res.status(500).json({ error: "Erro ao listar registros" });
  }
};

// CRIAR — salva com a semana atual
export const criarCadastroGeral = async (req, res) => {
  try {
    let { nome, idade, telefone, endereco, observacoes } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    nome = nome.trim();
    endereco = endereco?.trim() || null;
    observacoes = observacoes?.trim() || null;
    telefone = telefone ? telefone.replace(/\D/g, "") : null;
    const semana = getSegundaFeira();

    console.log("BODY TRATADO:", { nome, idade, telefone, endereco, observacoes, semana });

    const [result] = await db.query(
      `INSERT INTO cadastro_geral (nome, idade, telefone, endereco, observacoes, semana)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, idade, telefone, endereco, observacoes, semana]
    );

    return res.status(201).json({ msg: "Registro salvo com sucesso", id: result.insertId });
  } catch (err) {
    console.error("ERRO CRIAR:", err);
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
};

// DELETAR
export const deletarCadastroGeral = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID é obrigatório" });

    const [result] = await db.query("DELETE FROM cadastro_geral WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Registro não encontrado" });

    return res.status(200).json({ msg: "Excluído com sucesso" });
  } catch (err) {
    console.error("ERRO DELETAR:", err);
    return res.status(500).json({ error: "Erro ao deletar" });
  }
};
