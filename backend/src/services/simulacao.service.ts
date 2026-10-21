import type { BankAdapter, ResultadoBanco } from "../banks/bank.types";
import { registrarLog } from "../utils/logger";
import type { SimulacaoInput } from "../validation/simulacao.schema";

/** Consulta todos os bancos ao mesmo tempo; a falha de um não derruba os outros */
export async function simularEmTodosOsBancos(
  input: SimulacaoInput,
  adapters: BankAdapter[],
): Promise<ResultadoBanco[]> {
  const respostas = await Promise.allSettled(
    adapters.map((adapter) => consultarComMedicao(adapter, input)),
  );

  return respostas.map((resposta, i): ResultadoBanco => {
    if (resposta.status === "fulfilled") {
      return resposta.value;
    }
    return { banco: adapters[i].nome, status: "INDISPONIVEL", motivo: descreverFalha(resposta.reason) };
  });
}

/** Chama um banco e registra quanto tempo ele levou e como terminou */
async function consultarComMedicao(adapter: BankAdapter, input: SimulacaoInput): Promise<ResultadoBanco> {
  const inicio = performance.now();
  const duracaoMs = () => Math.round(performance.now() - inicio);

  try {
    const resultado = await adapter.simular(input);
    registrarLog("info", "banco_respondeu", {
      banco: adapter.nome,
      status: resultado.status,
      duracaoMs: duracaoMs(),
    });
    return resultado;
  } catch (erro) {
    registrarLog("warn", "banco_falhou", {
      banco: adapter.nome,
      motivo: erro instanceof Error ? erro.message : String(erro),
      duracaoMs: duracaoMs(),
    });
    throw erro;
  }
}

function descreverFalha(erro: unknown): string {
  if (erro instanceof Error && erro.name === "TimeoutError") {
    return "O banco não respondeu a tempo";
  }
  return "O banco está indisponível no momento";
}