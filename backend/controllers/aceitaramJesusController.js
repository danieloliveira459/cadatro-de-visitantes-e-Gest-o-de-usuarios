import { db } from "../config/db.js";

// =======================
// LISTAR
// =======================
export const listarAceitaram = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM aceitaram_jesus ORDER BY data DESC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("ERRO LISTAR ACEITARAM JESUS:", err);

    return res.status(500).json({
      error: "Erro ao listar registros",
      details: err.message,
    });
  }
};

// =======================
// CRIAR
// =======================
export const criarAceitou = async (req, res) => {
  try {
    const { nome, telefone, endereco, observacoes } = req.body;

    // ✅ validação
    if (!nome || !telefone) {
      return res.status(400).json({
        error: "Nome e telefone são obrigatórios",
      });
    }

    // 🔥 DATA NO HORÁRIO DO BRASIL
    const dataCadastro = new Date()
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .replace("T", " ");

    const [result] = await db.query(
      `INSERT INTO aceitaram_jesus 
      (nome, telefone, endereco, observacoes, data)
      VALUES (?, ?, ?, ?, ?)`,
      [
        nome,
        telefone,
        endereco || null,
        observacoes || null,
        dataCadastro,
      ]
    );

    return res.status(201).json({
      msg: "Registro salvo com sucesso",
      id: result.insertId,
      data: dataCadastro,
    });
  } catch (err) {
    console.error("ERRO CRIAR ACEITARAM JESUS:", err);

    return res.status(500).json({
      error: "Erro ao criar registro",
      details: err.message,
    });
  }
};

// =======================
// DELETAR
// =======================
export const deletarAceitou = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "ID é obrigatório",
      });
    }

    const [result] = await db.query(
      "DELETE FROM aceitaram_jesus WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Registro não encontrado",
      });
    }

    return res.status(200).json({
      msg: "Excluído com sucesso",
    });
  } catch (err) {
    console.error("ERRO DELETAR ACEITARAM JESUS:", err);

    return res.status(500).json({
      error: "Erro ao deletar registro",
      details: err.message,
    });
  }
};