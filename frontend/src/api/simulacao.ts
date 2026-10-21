import type { ErrosCampos, PedidoSimulacao, RespostaSimulacao } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Erro de validação: carrega as mensagens de cada campo para mostrar no formulário */
export class ErroDeValidacao extends Error {
  campos: ErrosCampos;

  constructor(campos: ErrosCampos) {
    super("Verifique os campos informados");
    this.campos = campos;
  }
}

export async function simular(pedido: PedidoSimulacao): Promise<RespostaSimulacao> {
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/simulacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
  }

  const corpo = await resposta.json();

  if (resposta.status === 400 && corpo.campos) {
    throw new ErroDeValidacao(corpo.campos);
  }
  if (!resposta.ok) {
    throw new Error(corpo.mensagem ?? "Ocorreu um erro inesperado. Tente novamente.");
  }

  return corpo as RespostaSimulacao;
}