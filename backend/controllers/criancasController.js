import { db } from "../config/db.js";

export const listarCriancas = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM crianca ORDER BY data_nascimento DESC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("ERRO LISTAR:", err);
    return res.status(500).json({ error: "Erro ao listar registros" });
  }
};

export const criarCrianca = async (req, res) => {
  try {
    let { nome, cpf, naturalidade, data_nascimento, foto, cargo } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    if (!cpf || cpf.trim() === "") {
      return res.status(400).json({ error: "CPF é obrigatório" });
    }

    nome = nome.trim();
    cpf = cpf.replace(/\D/g, "");
    naturalidade = naturalidade?.trim() || null;
    data_nascimento = data_nascimento || null;
    foto = foto || null;
    cargo = cargo?.trim() || null;

    const [result] = await db.query(
      `INSERT INTO crianca (nome, cpf, naturalidade, data_nascimento, foto, cargo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, naturalidade, data_nascimento, foto, cargo]
    );

    return res.status(201).json({
      msg: "Registro salvo com sucesso",
      id: result.insertId,
    });

  } catch (err) {
    console.error("ERRO CRIAR:", err);
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
};

export const deletarCrianca = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const [result] = await db.query("DELETE FROM crianca WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    return res.status(200).json({ msg: "Excluído com sucesso" });

  } catch (err) {
    console.error("ERRO DELETAR:", err);
    return res.status(500).json({ error: "Erro ao deletar" });
  }
};