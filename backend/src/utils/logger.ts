type NivelLog = "info" | "warn" | "error";

/** "529.982.247-25" → "***.982.247-**": esconde o início e os dígitos verificadores (LGPD) */
export function mascararCpf(cpf: string): string {
  const digitos = cpf.replace(/\D/g, "");
  if (digitos.length !== 11) return "***";
  return `***.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-**`;
}

/** Log estruturado: uma linha JSON por evento, fácil de buscar e filtrar */
export function registrarLog(
  nivel: NivelLog,
  evento: string,
  dados: Record<string, unknown> = {},
): void {
  const linha = JSON.stringify({ momento: new Date().toISOString(), nivel, evento, ...dados });

  if (nivel === "error") {
    console.error(linha);
  } else {
    console.log(linha);
  }
}
