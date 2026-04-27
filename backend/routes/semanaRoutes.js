import express from "express";
import { listarSemanas, dadosDaSemana } from "../controllers/semanaController.js";

const router = express.Router();

// GET /api/semanas           → lista todas as semanas com totais
// GET /api/semanas/:semana/dados → dados completos de uma semana (ex: /api/semanas/2026-04-21/dados)
router.get("/", listarSemanas);
router.get("/:semana/dados", dadosDaSemana);

export default router;
