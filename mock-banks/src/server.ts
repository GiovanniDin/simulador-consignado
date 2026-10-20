import express from "express";
import { simularInstabilidade } from "./caos";
import { bancoAlfa } from "./bancos/alfa";
import { bancoBeta } from "./bancos/beta";

const app = express();
app.disable("x-powered-by");
const PORT = 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Tudo abaixo desta linha fica sujeito a atraso e falhas aleatórias
app.use(simularInstabilidade);
app.use(bancoAlfa);
app.use(bancoBeta);

app.listen(PORT, () => {
  console.log(`Bancos simulados rodando em http://localhost:${PORT}`);
});