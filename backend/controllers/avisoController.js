import { db } from "../config/db.js";

// =====================
// LISTAR AVISOS
// =====================
export const listarAvisos = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM avisos ORDER BY id DESC"
    );

    return res.json(rows);
  } catch (err) {
    console.error("ERRO LISTAR AVISOS:", err);

    return res.status(500).json({
      error: "Erro ao listar avisos",
      details: err.message,
    });
  }
};

// =====================
// CRIAR AVISO
// =====================
export const criarAviso = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    // validação mais segura
    if (!titulo?.trim() || !descricao?.trim()) {
      return res.status(400).json({
        error: "Título e descrição são obrigatórios",
      });
    }

    console.log("BODY RECEBIDO:", req.body);

    await db.query(
      `INSERT INTO avisos (titulo, descricao, data)
       VALUES (?, ?, NOW())`,
      [titulo.trim(), descricao.trim()]
    );

    return res.status(201).json({
      msg: "Aviso criado com sucesso",
    });
  } catch (err) {
    console.error("ERRO CRIAR AVISO:", err);

    return res.status(500).json({
      error: "Erro ao criar aviso",
      details: err.message,
    });
  }
};

// =====================
// DELETAR AVISO
// =====================
export const deletarAviso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    const [result] = await db.query(
      "DELETE FROM avisos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Aviso não encontrado",
      });
    }

    return res.status(200).json({
      msg: "Aviso excluído com sucesso",
    });
  } catch (err) {
    console.error("ERRO DELETAR AVISO:", err);

    return res.status(500).json({
      error: "Erro ao deletar aviso",
      details: err.message,
    });
  }
};