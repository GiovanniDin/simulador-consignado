/** Mesmo formato que a API devolve (ver backend/src/banks/bank.types.ts) */
export type ResultadoBanco =
  | { banco: string; status: "APROVADO"; taxaMensal: number; parcela: number; valorTotal: number }
  | { banco: string; status: "REPROVADO"; motivo: string }
  | { banco: string; status: "INDISPONIVEL"; motivo: string };

export type OfertaAprovada = Extract<ResultadoBanco, { status: "APROVADO" }>;

export interface RespostaSimulacao {
  resultados: ResultadoBanco[];
  melhorOferta: OfertaAprovada | null;
}

/** O que o cliente preenche no formulário */
export interface PedidoSimulacao {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  salario: number;
  cnpjEmpregador: string;
  valorSolicitado: number;
  parcelas: number;
}

/** Erros por campo, no formato que a API devolve no 400 */
export type ErrosCampos = Partial<Record<keyof PedidoSimulacao, string[]>>;