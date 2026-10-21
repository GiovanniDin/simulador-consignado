import { Router } from "express";
import { criarSimulacao } from "../controllers/simulacao.controller";

export const simulacaoRoutes = Router();

simulacaoRoutes.post("/simulacoes", criarSimulacao);
