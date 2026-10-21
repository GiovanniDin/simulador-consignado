import { describe, it, expect } from "vitest";
import type { ResultadoBanco } from "../banks/bank.types";
import { escolherMelhorOferta } from "./ofertas";

describe("escolherMelhorOferta", () => {
  it("escolhe a aprovada com menor valor total", () => {
    const resultados: ResultadoBanco[] = [
      { banco: "Banco A", status: "APROVADO", taxaMensal: 0.02, parcela: 326, valorTotal: 15648 },
      { banco: "Banco B", status: "APROVADO", taxaMensal: 0.018, parcela: 312, valorTotal: 14976 },
    ];

    expect(escolherMelhorOferta(resultados)?.banco).toBe("Banco B");
  });

  it("devolve null quando nenhum banco aprova", () => {
    const resultados: ResultadoBanco[] = [
      { banco: "Banco A", status: "REPROVADO", motivo: "Margem insuficiente" },
      { banco: "Banco B", status: "INDISPONIVEL", motivo: "O banco não respondeu a tempo" },
    ];

    expect(escolherMelhorOferta(resultados)) .toBeNull();
  });
});