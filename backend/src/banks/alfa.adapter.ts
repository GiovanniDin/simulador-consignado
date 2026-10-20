import { z } from "zod";
import { config } from "../config";
import { calcularValorTotal } from "../domain/emprestimo";
import type{ BankAdapter } from  "./bank.types";    

const NOME = "Banco Alfa";

/** Formato da resposta do Banco Alfa: nunca confiamos sem validar */
const respostaAlfaSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("APROVADO"),
    taxaMensal: z.number(),
    valorParcela: z.number(),
    prazoMeses: z.number(),
  }),

  z.object({
    status: z.literal("NEGADO"),
    motivo: z.string(),
  }),
]);

export const alfaAdapter: BankAdapter = {
  nome: NOME,

  async simular(input) {
    const resposta = await fetch(`${config.bancosUrl}/banco-alfa/propostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salario: input.salario,
        valor: input.valorSolicitado,
        prazoMeses: input.parcelas,
      }),
      signal: AbortSignal.timeout(config.timeoutMs),
    });

    if (!resposta.ok) {
      throw new Error(`${NOME} respondeu HTTP ${resposta.status}`);
    }

    const dados = respostaAlfaSchema.parse(await resposta.json());

    if (dados.status === "NEGADO") {
      return { banco: NOME, status: "REPROVADO", motivo: dados.motivo };
    }

    return {
      banco: NOME,
      status: "APROVADO",
      taxaMensal: dados.taxaMensal / 100, // o Alfa manda em %, o nosso padrão é decimal
      parcela: dados.valorParcela,
      valorTotal: calcularValorTotal(dados.valorParcela, dados.prazoMeses),
    };
  },
};
