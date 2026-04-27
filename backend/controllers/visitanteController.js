import { db } from "../config/db.js";
import { getSegundaFeira } from "../utils/semana.js";

// ─── LISTAR — só da semana atual ─────────────────────────────────────────────
export const listarVisitantes = async (req, res) => {
  try {
    const semana = getSegundaFeira();
    const [rows] = await db.query(
      "SELECT * FROM visitantes WHERE semana = ? ORDER BY id DESC",
      [semana]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("ERRO LISTAR VISITANTES:", err);
    return res.status(500).json({ error: "Erro ao listar visitantes" });
  }
};

// ─── CRIAR — salva com a semana atual ────────────────────────────────────────
export const criarVisitante = async (req, res) => {
  try {
    let { nome, funcao, telefone, igreja, aceitouJesus } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    nome     = nome.trim();
    funcao   = funcao?.trim()  || null;
    igreja   = igreja?.trim()  || null;
    telefone = telefone ? telefone.replace(/\D/g, "") : null;
    const aceitou = aceitouJesus ? 1 : 0;
    const semana  = getSegundaFeira();

    const [result] = await db.query(
      `INSERT INTO visitantes (nome, funcao, telefone, igreja, aceitou_jesus, data, semana)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [nome, funcao, telefone, igreja, aceitou, semana]
    );

    return res.status(201).json({ msg: "Visitante criado com sucesso", id: result.insertId });
  } catch (err) {
    console.error("ERRO CRIAR VISITANTE:", err);
    return res.status(500).json({ error: "Erro ao criar visitante" });
  }
};

// ─── ATUALIZAR ACEITOU JESUS ──────────────────────────────────────────────────
export const atualizarAceitou = async (req, res) => {
  try {
    const { id } = req.params;
    const { aceitouJesus } = req.body;

    if (!id) return res.status(400).json({ error: "ID é obrigatório" });

    const valor = aceitouJesus ? 1 : 0;

    const [result] = await db.query(
      "UPDATE visitantes SET aceitou_jesus = ? WHERE id = ?",
      [valor, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Visitante não encontrado" });

    return res.status(200).json({ msg: "Atualizado com sucesso" });
  } catch (err) {
    console.error("ERRO ATUALIZAR ACEITOU:", err);
    return res.status(500).json({ error: "Erro ao atualizar" });
  }
};

// ─── DELETAR ──────────────────────────────────────────────────────────────────
export const deletarVisitante = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID é obrigatório" });

    const [result] = await db.query("DELETE FROM visitantes WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Visitante não encontrado" });

    return res.status(200).json({ msg: "Visitante excluído com sucesso" });
  } catch (err) {
    console.error("ERRO DELETAR:", err);
    return res.status(500).json({ error: "Erro ao deletar visitante" });
  }
};
