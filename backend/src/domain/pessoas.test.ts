import { describe, it, expect } from "vitest";
import { calcularIdade } from "./pessoas";

describe("calcularIdade", () => {
  it("desconta um ano quando ainda não fez aniversário", () => {
    expect(calcularIdade("2001-10-21", new Date(2026, 9, 20))).toBe(24);
  });

  it("conta o ano quando faz aniversário no dia", () => {
    expect(calcularIdade("2001-10-20", new Date(2026, 9, 20))).toBe(25);
  });
});
