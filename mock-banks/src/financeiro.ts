/** Parcela pela Tabela Price, arredondada em centavos */
export function calcularParcela(valor: number, taxaMensal: number, meses: number): number {
  const parcela = (valor * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));
  return Math.round(parcela * 100) / 100;
}

/** Idade em anos completos na data de hoje */
export function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) idade--;
  return idade;
}