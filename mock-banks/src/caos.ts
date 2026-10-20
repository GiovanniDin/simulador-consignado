import type { NextFunction, Request, Response } from "express";

const ATRASO_MINIMO_MS = 200;
const ATRASO_MAXIMO_MS = 4000;
const CHANCE_DE_FALHA = 0.15;

/** Simula a instabilidade de uma API real: demora aleatória e falhas ocasionais */
export function simularInstabilidade(_req: Request, res: Response, next: NextFunction): void {
  if (process.env.CAOS === "off") {
    next();
    return;
  }

  const atraso = ATRASO_MINIMO_MS + Math.random() * (ATRASO_MAXIMO_MS - ATRASO_MINIMO_MS);

  setTimeout(() => {
    if (Math.random() < CHANCE_DE_FALHA) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    next();
  }, atraso);
}
