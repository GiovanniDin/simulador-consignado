import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erros?: string[];
}

/** Um campo com rótulo e, se houver, a mensagem de erro logo abaixo */
export function CampoFormulario({ rotulo, erros, id, ...inputProps }: Props) {
  const mensagemErro = erros?.[0];

  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <input id={id} aria-invalid={Boolean(mensagemErro)} {...inputProps} />
      {mensagemErro && <span className="campo-erro">{mensagemErro}</span>}
    </div>
  );
}