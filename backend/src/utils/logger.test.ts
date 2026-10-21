import { describe, it, expect } from "vitest";
import { mascararCpf } from "./logger";

describe("mascararCpf", () => {
  it("mascara CPF sem pontuação", () => {
    expect(mascararCpf("52998224725")).toBe("***.982.247-**");
  });

  it("mascara CPF com pontuação", () => {
    expect(mascararCpf("529.982.247-25")).toBe("***.982.247-**");
  });

  it("não revela nada se o valor não for um CPF", () => {
    expect(mascararCpf("123")).toBe("***");
  });
});
