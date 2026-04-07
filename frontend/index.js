import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import visitanteRoutes from "./routes/visitanteRoutes.js";
import aceitaramJesusRoutes from "./routes/aceitaramJesusRoutes.js";
import avisoRoutes from "./routes/avisoRoutes.js";
import programacaoRoutes from "./routes/programacaoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// =========================
// 📁 __dirname no ESModules
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =========================
// 🌐 CORS — deve vir ANTES do helmet
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://cadatro-de-visitantes-e-gest-o-de-ukhv.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin (ex: curl, Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem bloqueada pelo CORS: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Preflight usando as mesmas opções — não usar cors() sem config aqui
app.options("*", cors(corsOptions));

// =========================
// 🛡️ HELMET completo + CSP
// =========================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: [
          "'self'",
          "data:",
          "https://use.typekit.net",
          "https://p.typekit.net",      // verificação de licença do Typekit
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
  })
);

// =========================
// 🧩 BODY PARSER
// =========================
app.use(express.json());

// =========================
// 🚀 ROTAS DA API
// =========================
app.use("/api/visitantes", visitanteRoutes);
app.use("/api/aceitaramJesus", aceitaramJesusRoutes);
app.use("/api/avisos", avisoRoutes);
app.use("/api/programacoes", programacaoRoutes);
app.use("/api/auth", authRoutes);

// Rota de health check
app.get("/api", (req, res) => {
  res.json({ message: "🚀 API rodando com sucesso!" });
});

// ❌ 404 para rotas de API não encontradas
// Deve ficar DEPOIS de todas as rotas /api e ANTES do static/frontend
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Rota da API não encontrada" });
});

// =========================
// 🌍 FRONTEND (React build)
// =========================
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

// Catch-all para o React Router — deve ser o ÚLTIMO handler
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =========================
// 🚀 START
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

// =========================
// 🛡️ LOGS DE ERRO GLOBAIS
// =========================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});