import type { Request, Response } from "express";
import { z } from "zod";
import { alfaAdapter } from "../banks/alfa.adapter";
import { betaAdapter } from "../banks/beta.adapter";
import { simularEmTodosOsBancos } from "../services/simulacao.service";
import { simulacaoSchema } from "../validation/simulacao.schema";

const BANCOS = [alfaAdapter, betaAdapter];

export async function criarSimulacao(req: Request, res: Response): Promise<void> {
  // Sem corpo, o Express deixa req.body undefined; o ?? {} faz cada campo acusar o próprio erro
  const resultado = simulacaoSchema.safeParse(req.body ?? {});

  if (!resultado.success) {
    res.status(400).json({
      erro: "DADOS_INVALIDOS",
      mensagem: "Verifique os campos informados",
      campos: z.flattenError(resultado.error).fieldErrors,
    });
    return;
  }

  const resultados = await simularEmTodosOsBancos(resultado.data, BANCOS);
  res.status(200).json({ resultados });
}