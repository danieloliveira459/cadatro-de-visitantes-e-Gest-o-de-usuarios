import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Rotas
import visitanteRoutes from "./routes/visitanteRoutes.js";
import aceitaramJesusRoutes from "./routes/aceitaramJesusRoutes.js";
import avisoRoutes from "./routes/avisoRoutes.js";
import programacaoRoutes from "./routes/programacaoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

//////////////////////////////////////////////////////
// CONFIG __dirname (ESMODULES)
//////////////////////////////////////////////////////

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//////////////////////////////////////////////////////
// MIDDLEWARES
//////////////////////////////////////////////////////

app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// ROTAS API
//////////////////////////////////////////////////////

app.use("/api/visitantes", visitanteRoutes);
app.use("/api/aceitaramJesus", aceitaramJesusRoutes);
app.use("/api/avisos", avisoRoutes);
app.use("/api/programacoes", programacaoRoutes);
app.use("/api/auth", authRoutes);

//////////////////////////////////////////////////////
// ROTA DE TESTE
//////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});

//////////////////////////////////////////////////////
// FRONTEND (REACT BUILD)
//////////////////////////////////////////////////////

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

//////////////////////////////////////////////////////
// FALLBACK REACT ROUTER (PRODUÇÃO SEGURA)
//////////////////////////////////////////////////////

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();

  res.sendFile(path.join(frontendPath, "index.html"));
});

//////////////////////////////////////////////////////
// PORTA (RENDER)
//////////////////////////////////////////////////////

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});