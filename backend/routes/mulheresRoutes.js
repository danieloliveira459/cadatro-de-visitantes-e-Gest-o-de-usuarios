import express from "express";
import {
  listarMulheres,
  criarMulher,
  deletarMulher
} from "../controllers/mulheresController.js";

const router = express.Router();

router.get("/", listarMulheres);
router.post("/", criarMulher);
router.delete("/:id", deletarMulher);

export default router;