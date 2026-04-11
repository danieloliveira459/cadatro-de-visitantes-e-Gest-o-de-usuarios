import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "segredo_super";
const resend = new Resend(process.env.RESEND_API_KEY);

// LOGIN
export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: "Email e senha obrigatórios" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ erro: "Usuário não encontrado" });

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida)
      return res.status(401).json({ erro: "Senha inválida" });

    const token = jwt.sign(
      { id: usuario.id, nivel: usuario.nivel },
      SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivel: usuario.nivel,
      },
    });
  } catch (err) {
    console.log("ERRO LOGIN:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// REGISTER
export const register = async (req, res) => {
  const { nome, email, senha, nivel } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: "Preencha todos os campos" });

  try {
    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      "INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)",
      [nome, email, hash, nivel || "user"]
    );

    return res.status(201).json({ msg: "Usuário criado" });
  } catch (err) {
    console.log("ERRO REGISTER:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ erro: "Email é obrigatório" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    // Responde igual mesmo se não encontrar (segurança — não revela se email existe)
    if (rows.length === 0)
      return res.json({ msg: "Se o email existir, você receberá um link." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 30; // 30 min

    // Salva token no banco
    await db.query(
      "UPDATE usuarios SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    const frontendURL = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/$/, "");

    const link = `${frontendURL}/reset?token=${token}`;

    console.log("LINK RESET:", link);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "ADTAG — Recuperação de senha",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #e02020;">Recuperação de senha</h2>
          <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo:</p>
          <a href="${link}" style="display:inline-block; margin: 16px 0; padding: 12px 24px; background:#e02020; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
            Redefinir senha
          </a>
          <p style="color:#888; font-size:13px;">Este link expira em <strong>30 minutos</strong>. Se não foi você, ignore este email.</p>
        </div>
      `,
    });

    return res.json({ msg: "Se o email existir, você receberá um link." });

  } catch (err) {
    console.log("ERRO FORGOT:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha)
    return res.status(400).json({ erro: "Dados inválidos" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE reset_token = ?",
      [token]
    );

    if (rows.length === 0)
      return res.status(400).json({ erro: "Token inválido ou expirado" });

    const usuario = rows[0];

    if (Date.now() > usuario.reset_expires) {
      // Limpa token expirado
      await db.query(
        "UPDATE usuarios SET reset_token = NULL, reset_expires = NULL WHERE id = ?",
        [usuario.id]
      );
      return res.status(400).json({ erro: "Token expirado. Solicite um novo link." });
    }

    const hash = await bcrypt.hash(novaSenha, 10);

    // Atualiza senha e limpa token
    await db.query(
      "UPDATE usuarios SET senha = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hash, usuario.id]
    );

    return res.json({ msg: "Senha atualizada com sucesso!" });

  } catch (err) {
    console.log("ERRO RESET:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// NIVEL POR EMAIL
export const getNivelByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT nivel FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    return res.json({ nivel: rows[0].nivel });
  } catch (err) {
    console.log("ERRO NIVEL:", err);
    return res.status(500).json({ erro: err.message });
  }
};