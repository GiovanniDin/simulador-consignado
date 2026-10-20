import { simulacaoRoutes } from "./routes/simulacao.routes";
import express from "express";
import cors from "cors";

const app = express();
app.disable("x-powered-by");
const PORT = 3000;

// Permite que o frontend (outra porta) chame esta API
app.use(cors());
// Faz o Express entender JSON no corpo das requisições
app.use(express.json());

// Rota de "saúde": serve para checar se a API está no ar
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(simulacaoRoutes);

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
