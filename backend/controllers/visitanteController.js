import { db } from "../config/db.js";

// LISTAR
export const listarVisitantes = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM visitantes ORDER BY id DESC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("ERRO LISTAR VISITANTES:", err);

    return res.status(500).json({
      error: "Erro ao listar visitantes",
    });
  }
};

// CRIAR
export const criarVisitante = async (req, res) => {
  try {
    let { nome, funcao, telefone, igreja, aceitouJesus } = req.body;

    // ✅ SOMENTE NOME OBRIGATÓRIO
    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        error: "Nome é obrigatório",
      });
    }

    // 🔥 LIMPEZA DE DADOS
    nome = nome.trim();
    funcao = funcao?.trim() || null;
    igreja = igreja?.trim() || null;

    // remove máscara do telefone
    telefone = telefone ? telefone.replace(/\D/g, "") : null;

    // garante boolean correto
    const aceitou = aceitouJesus ? 1 : 0;

    console.log("BODY TRATADO:", {
      nome,
      funcao,
      telefone,
      igreja,
      aceitou,
    });

    const [result] = await db.query(
      `INSERT INTO visitantes 
      (nome, funcao, telefone, igreja, aceitou_jesus, data) 
      VALUES (?, ?, ?, ?, ?, NOW())`,
      [nome, funcao, telefone, igreja, aceitou]
    );

    return res.status(201).json({
      msg: "Visitante criado com sucesso",
      id: result.insertId,
    });

  } catch (err) {
    console.error("ERRO CRIAR VISITANTE:", err);

    return res.status(500).json({
      error: "Erro ao criar visitante",
    });
  }
};

// 🔥 ATUALIZAR ACEITOU JESUS (RADIO BUTTON)
export const atualizarAceitou = async (req, res) => {
  try {
    const { id } = req.params;
    const { aceitouJesus } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "ID é obrigatório",
      });
    }

    const valor = aceitouJesus ? 1 : 0;

    const [result] = await db.query(
      "UPDATE visitantes SET aceitou_jesus = ? WHERE id = ?",
      [valor, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Visitante não encontrado",
      });
    }

    return res.status(200).json({
      msg: "Atualizado com sucesso",
    });

  } catch (err) {
    console.error("ERRO ATUALIZAR ACEITOU:", err);

    return res.status(500).json({
      error: "Erro ao atualizar",
    });
  }
};

// DELETAR
export const deletarVisitante = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "ID é obrigatório",
      });
    }

    const [result] = await db.query(
      "DELETE FROM visitantes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Visitante não encontrado",
      });
    }

    return res.status(200).json({
      msg: "Visitante excluído com sucesso",
    });

  } catch (err) {
    console.error("ERRO DELETAR:", err);

    return res.status(500).json({
      error: "Erro ao deletar visitante",
    });
  }
};