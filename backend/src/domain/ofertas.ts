import type { ResultadoBanco } from "../banks/bank.types";

export type OfertaAprovada = Extract<ResultadoBanco, { status: "APROVADO" }>;

/**Entre as propostas aprovadas, irá escolher a de menor custo total para o cliente */
export function escolherMelhorOferta(resultados: ResultadoBanco[]): OfertaAprovada | null {
  const aprovadas = resultados.filter(
    (resultado): resultado is OfertaAprovada => resultado.status === "APROVADO",
  );
  if (aprovadas.length === 0) return null;

  return aprovadas.reduce((melhor, atual) =>
    atual.valorTotal < melhor.valorTotal ? atual : melhor,
  );
}
