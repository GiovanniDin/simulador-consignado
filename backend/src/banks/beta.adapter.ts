import { z } from "zod";
import { config } from "../config";
import { calcularValorTotal } from "../domain/emprestimo";
import type { BankAdapter } from "./bank.types";

const NOME = "Banco Beta";

/** Tradução dos códigos de reprovação do Beta para mensagens ao cliente */
const MOTIVOS_BETA: Record<string, string> = {
  R01: "Idade ao fim do contrato acima do limite do banco",
  R02: "Parcela acima da margem consignável",
  R03: "Empregador não conveniado ao banco",
};

const respostaBetaSchema = z.discriminatedUnion("approved", [
  z.object({
    approved: z.literal(true),
    rate: z.number(),
    installment_value: z.number(),
    term: z.number(),
  }),
  z.object({
    approved: z.literal(false),
    reason_code: z.string(),
  }),
]);

export const betaAdapter: BankAdapter = {
  nome: NOME,

  async simular(input) {
    const resposta = await fetch(`${config.bancosUrl}/banco-beta/v1/credit-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthly_income: input.salario,
        amount: input.valorSolicitado,
        installments: input.parcelas,
        birth_date: input.dataNascimento,
        employer_document: input.cnpjEmpregador,
      }),
      signal: AbortSignal.timeout(config.timeoutMs),
    });

    if (!resposta.ok) {
      throw new Error(`${NOME} respondeu HTTP ${resposta.status}`);
    }

    const dados = respostaBetaSchema.parse(await resposta.json());

    if (!dados.approved) {
      return {
        banco: NOME,
        status: "REPROVADO",
        motivo: MOTIVOS_BETA[dados.reason_code] ?? "Proposta recusada pelo banco",
      };
    }

     return {
          banco: NOME,
          status: "APROVADO",
          taxaMensal: dados.rate, // o Beta já manda em decimal 
          parcela: dados.installment_value,
          valorTotal: calcularValorTotal(dados.installment_value, dados.term),
        };
  },
};