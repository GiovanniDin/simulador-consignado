import { Router } from "express";
import { calcularParcela } from "../financeiro";

const TAXA_MENSAL_PERCENTUAL = 1.79;
const COMPROMETIMENTO_MAXIMO_DA_RENDA = 0.3;

export const bancoAlfa = Router();

/**
 * Banco Alfa: API "em português", taxa em percentual.
 * Reprova se a parcela passar de 30% do salário.
 */
bancoAlfa.post("/banco-alfa/propostas", (req, res) => {
  const { salario, valor, prazoMeses } = req.body ?? {};

  if (typeof salario !== "number" || typeof valor !== "number" || typeof prazoMeses !== "number") {
    res.status(422).json({ status: "ERRO", motivo: "Payload inválido" });
    return;
  }

  const valorParcela = calcularParcela(valor, TAXA_MENSAL_PERCENTUAL / 100, prazoMeses);

  if (valorParcela > salario * COMPROMETIMENTO_MAXIMO_DA_RENDA) {
    res.json({ status: "NEGADO", motivo: "Comprometimento de renda acima de 30%" });
    return;
  }

  res.json({ status: "APROVADO", taxaMensal: TAXA_MENSAL_PERCENTUAL, valorParcela, prazoMeses });
});
