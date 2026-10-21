import { useState, type FormEvent } from "react";
import type { ErrosCampos, PedidoSimulacao } from "../types";
import { formatarCnpj, formatarCpf } from "../utils/formatar";
import { CampoFormulario } from "./CampoFormulario";

interface Props {
  carregando: boolean;
  erros: ErrosCampos;
  onSimular: (pedido: PedidoSimulacao) => void;
}

const VAZIO = {
  nome: "",
  email: "",
  cpf: "",
  dataNascimento: "",
  salario: "",
  cnpjEmpregador: "",
  valorSolicitado: "",
  parcelas: "48",
};

export function FormularioSimulacao({ carregando, erros, onSimular }: Props) {
  const [campos, setCampos] = useState(VAZIO);

  function alterar(nome: keyof typeof VAZIO, valor: string) {
    setCampos((anteriores) => ({ ...anteriores, [nome]: valor }));
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault(); // impede o navegador de recarregar a página
    onSimular({
      ...campos,
      salario: Number(campos.salario),
      valorSolicitado: Number(campos.valorSolicitado),
      parcelas: Number(campos.parcelas),
    });
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <CampoFormulario
        id="nome"
        rotulo="Nome completo"
        value={campos.nome}
        onChange={(e) => alterar("nome", e.target.value)}
        erros={erros.nome}
      />
      <CampoFormulario
        id="email"
        rotulo="E-mail"
        type="email"
        value={campos.email}
        onChange={(e) => alterar("email", e.target.value)}
        erros={erros.email}
      />
      <div className="linha">
        <CampoFormulario
          id="cpf"
          rotulo="CPF"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={campos.cpf}
          onChange={(e) => alterar("cpf", formatarCpf(e.target.value))}
          erros={erros.cpf}
        />
        <CampoFormulario
          id="dataNascimento"
          rotulo="Data de nascimento"
          type="date"
          value={campos.dataNascimento}
          onChange={(e) => alterar("dataNascimento", e.target.value)}
          erros={erros.dataNascimento}
        />
      </div>
      <div className="linha">
        <CampoFormulario
          id="salario"
          rotulo="Salário líquido (R$)"
          type="number"
          min="0"
          step="0.01"
          value={campos.salario}
          onChange={(e) => alterar("salario", e.target.value)}
          erros={erros.salario}
        />
        <CampoFormulario
          id="cnpjEmpregador"
          rotulo="CNPJ do empregador"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={campos.cnpjEmpregador}
          onChange={(e) => alterar("cnpjEmpregador", formatarCnpj(e.target.value))}
          erros={erros.cnpjEmpregador}
        />
      </div>
      <div className="linha">
        <CampoFormulario
          id="valorSolicitado"
          rotulo="Valor desejado (R$)"
          type="number"
          min="500"
          step="100"
          value={campos.valorSolicitado}
          onChange={(e) => alterar("valorSolicitado", e.target.value)}
          erros={erros.valorSolicitado}
        />
        <CampoFormulario
          id="parcelas"
          rotulo="Número de parcelas"
          type="number"
          min="6"
          max="96"
          value={campos.parcelas}
          onChange={(e) => alterar("parcelas", e.target.value)}
          erros={erros.parcelas}
        />
      </div>

      <button type="submit" disabled={carregando}>
        {carregando ? "Consultando bancos…" : "Simular"}
      </button>
    </form>
  );
}