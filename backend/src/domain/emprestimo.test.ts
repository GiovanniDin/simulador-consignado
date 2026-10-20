import { describe, it, expect } from "vitest";
import { calcularParcela, calcularMargemConsignavel, calcularValorTotal } from "./emprestimo";

describe("calcularParcela", () => {
  it("calcula pela Tabbela Price", () => {
    expect(calcularParcela(10000, 0.018, 48)).toBe(312.89);
  });
  it("divide igualmente quando não há juros", () => {
    expect(calcularParcela(1200, 0, 12)).toBe(100);
  });

  it("rejeita parâmetros inválidos", () => {
    expect(() => calcularParcela(-100, 0.018, 12)).toThrow();
  });
});

describe("calcularMargemConsignavel", () => {
  it("calcula 35% do salário", () => {
    expect(calcularMargemConsignavel(3000)).toBe(1050);
  });
});

describe("calcularValorTotal", () => {
  it("multiplica a parcela pelo numero de meses", () => {
    expect(calcularValorTotal(312.89, 48)).toBe(15018.72);
  });
});
