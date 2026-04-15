import express from "express";
import { listarHomens, criarHomem, deletarHomem } from "../controllers/homensController.js";

const router = express.Router();

router.get("/", listarHomens);
router.post("/", criarHomem);
router.delete("/:id", deletarHomem);

export default router;
