import type { Request, Response } from "express";
import { z } from "zod";
import { simulacaoSchema } from "../validation/simulacao.schema";

export function criarSimulacao(req: Request, res: Response): void {
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

  // Por enquanto devolve os dados validados; depois chamaremos os bancos aqui
  res.status(200).json({ dados: resultado.data });
}
