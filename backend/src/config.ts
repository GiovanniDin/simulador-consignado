// Carrega o arquivo .env, se existir (sem ele, valem os valores padrão abaixo)
try {
  process.loadEnvFile();
} catch {
  // .env é opcional
}

export const config = {
  bancosUrl: process.env.BANCOS_URL ?? "http://localhost:4000",
  timeoutMs: Number(process.env.TIMEOUT_MS ?? 3000),
};
