import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import visitanteRoutes from "./routes/visitanteRoutes.js";
import aceitaramJesusRoutes from "./routes/aceitaramJesusRoutes.js";
import avisoRoutes from "./routes/avisoRoutes.js";
import programacaoRoutes from "./routes/programacaoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Corrigir __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// 🔐 CSP (CORRIGIDO)
// =======================
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self' data: https://use.typekit.net;
    connect-src 'self' https://cadatro-de-visitantes-e-gest-o-de.onrender.com https://cadatro-de-visitantes-e-gest-o-de-ukhv.onrender.com;
    `
  );
  next();
});

// =======================
// 🌍 CORS CONFIGURADO (CORRIGIDO)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://cadatro-de-visitantes-e-gest-o-de-ukhv.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite postman / server-to-server

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS bloqueado: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// 🔥 IMPORTANTE: middleware manual para garantir preflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// aplicar CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =======================
// 📦 MIDDLEWARE
// =======================
app.use(express.json());

// =======================
// 🔗 ROTAS API
// =======================
app.use("/api/visitantes", visitanteRoutes);
app.use("/api/aceitaram-jesus", aceitaramJesusRoutes);
app.use("/api/avisos", avisoRoutes);
app.use("/api/programacoes", programacaoRoutes);
app.use("/api/auth", authRoutes);

// =======================
// 🧪 TESTE API
// =======================
app.get("/api", (req, res) => {
  res.json({ message: "API rodando com sucesso!" });
});

// =======================
// 🌐 FRONTEND (React)
// =======================
const frontendPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  console.warn("Pasta dist não encontrada. Frontend não será servido.");
}

// =======================
// ❌ 404 SOMENTE API
// =======================
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Rota da API não encontrada" });
});

// =======================
// 🚀 START
// =======================
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// =======================
// 🧯 LOGS GLOBAIS
// =======================
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});