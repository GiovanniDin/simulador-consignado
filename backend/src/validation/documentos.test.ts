import { describe, it, expect } from "vitest";
import { validarCpf, validarCnpj } from "./documentos";

describe("validarCpf", () => {
  it("aceita CPF válido com máscara", () => {
    expect(validarCpf("529.982.247-25")).toBe(true);
  });

  it("aceita CPF válido sem máscara", () => {
    expect(validarCpf("52998224725")).toBe(true);
  });

  it("rejeita CPF com dígito verificador errado", () => {
    expect(validarCpf("529.982.247-24")).toBe(false);
  });

  it("rejeita CPF com todos os dígitos iguais", () => {
    expect(validarCpf("111.111.111-11")).toBe(false);
  });

  it("rejeita CPF com tamanho errado", () => {
    expect(validarCpf("123")).toBe(false);
  });
});

describe("validarCnpj", () => {
  it("aceita CNPJ válido", () => {
    expect(validarCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita CNPJ com dígito verificador errado", () => {
    expect(validarCnpj("11.222.333/0001-80")).toBe(false);
  });

  it("rejeita CNPJ com todos os dígitos iguais", () => {
    expect(validarCnpj("00.000.000/0000-00")).toBe(false);
  });

  it("reijeita o CNPJ com o tamanho incorreto", () =>{
    expect(validarCnpj("255")) .toBe(false);
  });
});
