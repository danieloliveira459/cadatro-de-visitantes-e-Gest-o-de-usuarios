import express from "express";
import {
  listarVisitantes,
  criarVisitante,
  deletarVisitante,
  atualizarAceitou
} from "../controllers/visitanteController.js";

const router = express.Router();

router.get("/", listarVisitantes);
router.post("/", criarVisitante);
router.put("/:id/aceitou", atualizarAceitou);
router.delete("/:id", deletarVisitante);

export default router;