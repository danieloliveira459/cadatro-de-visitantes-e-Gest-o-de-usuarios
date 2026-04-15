import express from "express";
import {
  listarCriancas,
  criarCrianca,
  deletarCrianca
} from "../controllers/criancasController.js";

const router = express.Router();

router.get("/", listarCriancas);
router.post("/", criarCrianca);
router.delete("/:id", deletarCrianca);

export default router;