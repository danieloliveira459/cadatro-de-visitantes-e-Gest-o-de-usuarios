import { db } from "../config/db.js";

function normalizarMembro(m) {
  return {
    ...m,
    dataNascimento: m.data_nascimento ?? m.dataNascimento ?? null,
    createdAt: m.created_at ?? m.createdAt ?? null,
  };
}

export const listarJovens = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM jovens ORDER BY data_nascimento DESC"
    );
    return res.status(200).json(rows.map(normalizarMembro));
  } catch (err) {
    console.error("ERRO LISTAR:", err);
    return res.status(500).json({ error: "Erro ao listar registros" });
  }
};

export const criarJovem = async (req, res) => {
  try {
    let { nome, cpf, naturalidade, dataNascimento, foto, cargo } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    nome = nome.trim();
    cpf = cpf ? cpf.replace(/\D/g, "") : null;
    naturalidade = naturalidade?.trim() || null;
    const data_nascimento = dataNascimento || null;
    foto = foto || null;
    cargo = cargo?.trim() || null;

    const [result] = await db.query(
      `INSERT INTO jovens (nome, cpf, naturalidade, data_nascimento, foto, cargo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, naturalidade, data_nascimento, foto, cargo]
    );

    const [rows] = await db.query("SELECT * FROM jovens WHERE id = ?", [result.insertId]);
    return res.status(201).json(normalizarMembro(rows[0]));

  } catch (err) {
    console.error("ERRO CRIAR:", err);
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
};

export const deletarJovem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const [result] = await db.query("DELETE FROM jovens WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    return res.status(200).json({ msg: "Excluído com sucesso" });

  } catch (err) {
    console.error("ERRO DELETAR:", err);
    return res.status(500).json({ error: "Erro ao deletar" });
  }
};