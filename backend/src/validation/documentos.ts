/** Remove tudo que não for dígito: "529.982.247-25" → "52998224725" */
export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Calcula um dígito verificador do CPF a partir da base e do peso inicial */
function calcularDigitoCpf(base: string, pesoInicial: number): number {
  let soma = 0;
  let peso = pesoInicial;

  for (const digito of base) {
    soma += Number(digito) * peso;
    peso--;
  }

  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/** Valida um CPF, com ou sem máscara */
export function validarCpf(valor: string): boolean {
  const cpf = somenteDigitos(valor);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // todos os dígitos iguais

  const digito1 = calcularDigitoCpf(cpf.slice(0, 9), 10);
  const digito2 = calcularDigitoCpf(cpf.slice(0, 10), 11);

  return digito1 === Number(cpf[9]) && digito2 === Number(cpf[10]);
}

const PESOS_CNPJ_DIGITO1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ_DIGITO2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcularDigitoCnpj(base: string, pesos: number[]): number {
  let soma = 0;

  for (let i = 0; i < base.length; i++) {
    soma += Number(base[i]) * pesos[i];
  }

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCnpj(valor: string): boolean {
  const cnpj = somenteDigitos(valor);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const digito1 = calcularDigitoCnpj(cnpj.slice(0, 12), PESOS_CNPJ_DIGITO1);
  const digito2 = calcularDigitoCnpj(cnpj.slice(0, 13), PESOS_CNPJ_DIGITO2);

  return digito1 === Number(cnpj[12]) && digito2 === Number(cnpj[13]);
}
