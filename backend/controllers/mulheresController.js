import { db } from "../config/db.js";

export const listarMulheres = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM mulheres ORDER BY data_nascimento DESC"
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ERRO LISTAR:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao listar registros",
    });
  }
};

export const criarMulher = async (req, res) => {
  try {
    let { nome, cpf, naturalidade, data_nascimento, foto, cargo } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Nome é obrigatório",
      });
    }

    if (!cpf || cpf.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "CPF é obrigatório",
      });
    }

    nome = nome.trim();
    cpf = cpf.replace(/\D/g, "");
    naturalidade = naturalidade?.trim() || null;
    data_nascimento = data_nascimento || null;
    foto = foto || null;
    cargo = cargo?.trim() || null;

    const [result] = await db.query(
      `INSERT INTO mulheres (nome, cpf, naturalidade, data_nascimento, foto, cargo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, naturalidade, data_nascimento, foto, cargo]
    );

    return res.status(201).json({
      success: true,
      msg: "Registro salvo com sucesso",
      id: result.insertId,
    });
  } catch (err) {
    console.error("ERRO CRIAR:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao cadastrar",
    });
  }
};

export const deletarMulher = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID é obrigatório",
      });
    }

    const [result] = await db.query(
      "DELETE FROM mulheres WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Registro não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Excluído com sucesso",
    });
  } catch (err) {
    console.error("ERRO DELETAR:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao deletar",
    });
  }
};