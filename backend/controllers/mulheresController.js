import { db } from "../config/db.js";

/* ================= LISTAR ================= */
export const listarMulheres = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM mulheres ORDER BY data DESC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("ERRO LISTAR:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao listar registros",
    });
  }
};

/* ================= CRIAR ================= */
export const criarMulher = async (req, res) => {
  try {
    let { nome, idade, telefone, endereco, observacoes } = req.body;

    // 🔥 VALIDAÇÃO
    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Nome é obrigatório",
      });
    }

    // 🔥 TRATAMENTO
    nome = nome.trim();
    idade = idade ? Number(idade) : null;
    telefone = telefone ? telefone.replace(/\D/g, "") : null;
    endereco = endereco?.trim() || null;
    observacoes = observacoes?.trim() || null;

    console.log("BODY TRATADO:", {
      nome,
      idade,
      telefone,
      endereco,
      observacoes,
    });

    // 🔥 INSERT CORRIGIDO
    const [result] = await db.query(
      `INSERT INTO mulheres (nome, idade, telefone, endereco, observacoes)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, idade, telefone, endereco, observacoes]
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

/* ================= DELETAR ================= */
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