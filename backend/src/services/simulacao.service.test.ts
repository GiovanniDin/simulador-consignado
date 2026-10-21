import { describe, it, expect } from "vitest";
import type { BankAdapter } from "../banks/bank.types";
import type { SimulacaoInput } from "../validation/simulacao.schema";
import { simularEmTodosOsBancos } from "./simulacao.service";

const input: SimulacaoInput = {
  nome: "Maria Zélia",
  email: "maria@email.com",
  cpf: "52998224725",
  dataNascimento: "1990-05-10",
  salario: 3000,
  cnpjEmpregador: "11222333000181",
  valorSolicitado: 10000,
  parcelas: 48,
};

/** Banco falso que sempre aprova */
function bancoQueAprova(nome: string): BankAdapter {
  return {
    nome,
    simular: async () => ({
      banco: nome,
      status: "APROVADO",
      taxaMensal: 0.02,
      parcela: 326,
      valorTotal: 15648,
    }),
  };
}

/** Banco falso que sempre falha com o erro informado */
function bancoQueFalha(nome: string, erro: Error): BankAdapter {
  return {
    nome,
    simular: async () => {
      throw erro;
    },
  };
}

describe("simularEmTodosOsBancos", () => {
  it("mantém o resultado dos outros bancos quando um falha", async () => {
    const resultados = await simularEmTodosOsBancos(input, [
      bancoQueAprova("Banco A"),
      bancoQueFalha("Banco B", new Error("HTTP 500")),
    ]);

    expect(resultados).toHaveLength(2);
    expect(resultados[0].status).toBe("APROVADO");
    expect(resultados[1]).toEqual({
      banco: "Banco B",
      status: "INDISPONIVEL",
      motivo: "O banco está indisponível no momento",
    });
  });

  it("informa quando o banco não responde a tempo", async () => {
    const timeout = new DOMException("The operation was aborted due to timeout", "TimeoutError");
    const [resultado] = await simularEmTodosOsBancos(input, [bancoQueFalha("Banco A", timeout)]);

    expect(resultado).toEqual({
      banco: "Banco A",
      status: "INDISPONIVEL",
      motivo: "O banco não respondeu a tempo",
    });
  });

  it("não lança erro mesmo se todos os bancos falharem", async () => {
    const resultados = await simularEmTodosOsBancos(input, [
      bancoQueFalha("Banco A", new Error("x")),
      bancoQueFalha("Banco B", new Error("y")),
    ]);

    expect(resultados.every((r) => r.status === "INDISPONIVEL")).toBe(true);
  });
});