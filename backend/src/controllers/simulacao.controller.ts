import type { Request, Response } from "express";
import { z } from "zod";
import { alfaAdapter } from "../banks/alfa.adapter";
import { betaAdapter } from "../banks/beta.adapter";
import { escolherMelhorOferta } from "../domain/ofertas";
import { simularEmTodosOsBancos } from "../services/simulacao.service";
import { mascararCpf, registrarLog } from "../utils/logger";
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

  const dados = resultado.data;
  const inicio = performance.now();
  registrarLog("info", "simulacao_recebida", {
    cpf: mascararCpf(dados.cpf),
    valorSolicitado: dados.valorSolicitado,
    parcelas: dados.parcelas,
  });

  const resultados = await simularEmTodosOsBancos(dados, BANCOS);
  const melhorOferta = escolherMelhorOferta(resultados);

  registrarLog("info", "simulacao_concluida", {
    cpf: mascararCpf(dados.cpf),
    aprovados: resultados.filter((r) => r.status === "APROVADO").length,
    indisponiveis: resultados.filter((r) => r.status === "INDISPONIVEL").length,
    melhorBanco: melhorOferta?.banco ?? null,
    duracaoMs: Math.round(performance.now() - inicio),
  });

  res.status(200).json({ resultados, melhorOferta });
}