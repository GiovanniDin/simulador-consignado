import { useState } from "react";
import { ErroDeValidacao, simular } from "./api/simulacao";
import { CardBanco } from "./components/CardBanco";
import { FormularioSimulacao } from "./components/FormularioSimulacao";
import type { ErrosCampos, PedidoSimulacao, RespostaSimulacao } from "./types";

/** Sem oferta aprovada: explica se foi recusa dos bancos ou instabilidade */
function mensagemSemOferta(resposta: RespostaSimulacao): string {
  const todosIndisponiveis = resposta.resultados.every((r) => r.status === "INDISPONIVEL");

  if (todosIndisponiveis) {
    return "Os bancos não responderam agora. Tente novamente em instantes.";
  }
  return "Nenhum banco aprovou esta simulação. Tente outro valor ou prazo.";
}

export default function App() {
  const [carregando, setCarregando] = useState(false);
  const [resposta, setResposta] = useState<RespostaSimulacao | null>(null);
  const [errosCampos, setErrosCampos] = useState<ErrosCampos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  async function aoSimular(pedido: PedidoSimulacao) {
    setCarregando(true);
    setErrosCampos({});
    setErroGeral(null);
    setResposta(null);

    try {
      setResposta(await simular(pedido));
    } catch (erro) {
      if (erro instanceof ErroDeValidacao) {
        setErrosCampos(erro.campos);
      } else {
        setErroGeral(erro instanceof Error ? erro.message : "Ocorreu um erro inesperado.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="pagina">
      <header className="topo">
        <h1>Simulador de Consignado</h1>
        <p>Preencha seus dados e compare as propostas de vários bancos de uma só vez.</p>
      </header>

      <section className="painel">
        <FormularioSimulacao carregando={carregando} erros={errosCampos} onSimular={aoSimular} />
      </section>

      {erroGeral && (
        <p className="alerta" role="alert">
          {erroGeral}
        </p>
      )}

      {resposta && (
        <section className="resultados" aria-live="polite">
          <h2>Resultado</h2>
          {!resposta.melhorOferta && <p className="aviso">{mensagemSemOferta(resposta)}</p>}
          <div className="grade">
            {resposta.resultados.map((resultado) => (
              <CardBanco
                key={resultado.banco}
                resultado={resultado}
                melhorOferta={resultado.banco === resposta.melhorOferta?.banco}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}