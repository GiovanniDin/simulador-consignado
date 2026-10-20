import type { BankAdapter, ResultadoBanco } from "../banks/bank.types";
import type { SimulacaoInput } from "../validation/simulacao.schema";

/** Consulta todos os bancos ao mesmo tempo; a falha de um não derruba os outros */
export async function simularEmTodosOsBancos(
  input: SimulacaoInput,
  adapters: BankAdapter[],
): Promise<ResultadoBanco[]> {
  const respostas = await Promise.allSettled(adapters.map((adapter) => adapter.simular(input)));

  return respostas.map((resposta, i): ResultadoBanco => {
    if (resposta.status === "fulfilled") {
      return resposta.value;
    }
    return { banco: adapters[i].nome, status: "INDISPONIVEL", motivo: descreverFalha(resposta.reason) };
  });
}

function descreverFalha(erro: unknown): string {
  if (erro instanceof Error && erro.name === "TimeoutError") {
    return "O banco não respondeu a tempo";
  }
  return "O banco está indisponível no momento";
}