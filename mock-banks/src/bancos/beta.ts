import { Router } from "express";
import { calcularIdade, calcularParcela } from "../financeiro";

const TAXA_MENSAL = 0.0199;
const MARGEM_MAXIMA = 0.35;
const IDADE_MAXIMA_NO_FIM_DO_CONTRATO = 75;
const EMPREGADORES_RESTRITOS = ["11444777000161"];

export const bancoBeta = Router();

/**
 * Banco Beta: API "em inglês", taxa em decimal e reprovação por código.
 * R01 = idade no fim do contrato acima de 75 anos
 * R02 = parcela acima da margem consignável (35%)
 * R03 = empregador em lista restrita
 */
bancoBeta.post("/banco-beta/v1/credit-analysis", (req, res) => {
  const { monthly_income, amount, installments, birth_date, employer_document } = req.body ?? {};

  if (
    typeof monthly_income !== "number" ||
    typeof amount !== "number" ||
    typeof installments !== "number" ||
    typeof birth_date !== "string" ||
    typeof employer_document !== "string"
  ) {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }

  if (EMPREGADORES_RESTRITOS.includes(employer_document)) {
    res.json({ approved: false, reason_code: "R03" });
    return;
  }

  const idadeNoFimDoContrato = calcularIdade(birth_date) + installments / 12;
  if (idadeNoFimDoContrato > IDADE_MAXIMA_NO_FIM_DO_CONTRATO) {
    res.json({ approved: false, reason_code: "R01" });
    return;
  }

  const installmentValue = calcularParcela(amount, TAXA_MENSAL, installments);

  if (installmentValue > monthly_income * MARGEM_MAXIMA) {
    res.json({ approved: false, reason_code: "R02" });
    return;
  }

  res.json({
    approved: true,
    rate: TAXA_MENSAL,
    installment_value: installmentValue,
    term: installments,
  });
});
