import type { ResultadoBanco } from "../types";
import { formatarMoeda, formatarTaxa } from "../utils/formatar";

interface Props {
  resultado: ResultadoBanco;
  melhorOferta: boolean;
}

const ROTULOS = {
  APROVADO: "Aprovado",
  REPROVADO: "Não aprovado",
  INDISPONIVEL: "Indisponível",
};

export function CardBanco({ resultado, melhorOferta }: Props) {
  return (
    <article className={`card card-${resultado.status.toLowerCase()}`}>
      <header>
        <h3>{resultado.banco}</h3>
        <span className="selo">{ROTULOS[resultado.status]}</span>
      </header>

      {melhorOferta && <p className="destaque">★ Melhor oferta</p>}

      {resultado.status === "APROVADO" ? (
        <dl>
          <dt>Parcela</dt>
          <dd className="valor-principal">{formatarMoeda(resultado.parcela)}</dd>
          <dt>Taxa</dt>
          <dd>{formatarTaxa(resultado.taxaMensal)}</dd>
          <dt>Total a pagar</dt>
          <dd>{formatarMoeda(resultado.valorTotal)}</dd>
        </dl>
      ) : (
        <p className="motivo">{resultado.motivo}</p>
      )}
    </article>
  );
}