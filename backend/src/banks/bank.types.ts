import type { SimulacaoInput } from "../validation/simulacao.schema";

/** Formato único que o sistema usa, seja qual for o banco */
export type ResultadoBanco =
  | { banco: string; status: "APROVADO"; taxaMensal: number; parcela: number; valorTotal: number }
  | { banco: string; status: "REPROVADO"; motivo: string }
  | { banco: string; status: "INDISPONIVEL"; motivo: string };

/** Contrato que todo banco integrado precisa cumprir */
export interface BankAdapter {
  nome: string;
  simular(input: SimulacaoInput): Promise<ResultadoBanco>;
}
