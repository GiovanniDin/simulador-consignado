import { z } from "zod";
import { calcularIdade } from "../domain/pessoas";
import { somenteDigitos, validarCnpj, validarCpf } from "./documentos";

const IDADE_MINIMA = 18;
const IDADE_MAXIMA = 80;

export const simulacaoSchema = z.object({
  nome: z.string("Informe o nome").trim().min(3, "Informe o nome completo"),
  email: z.email("E-mail inválido"),
  cpf: z.string("Informe o CPF").refine(validarCpf, "CPF inválido").transform(somenteDigitos),
  dataNascimento: z.iso
    .date("Data de nascimento inválida (use AAAA-MM-DD)")
    .refine((data) => {
      const idade = calcularIdade(data);
      return idade >= IDADE_MINIMA && idade <= IDADE_MAXIMA;
    }, `Idade deve estar entre ${IDADE_MINIMA} e ${IDADE_MAXIMA} anos`),
  salario: z.number("Salário deve ser um número").positive("Salário deve ser maior que zero"),
  cnpjEmpregador: z
    .string("Informe o CNPJ do empregador")
    .refine(validarCnpj, "CNPJ do empregador inválido")
    .transform(somenteDigitos),
  valorSolicitado: z
    .number("Valor solicitado deve ser um número")
    .min(500, "Valor mínimo é R$ 500")
    .max(200000, "Valor máximo é R$ 200.000"),
  parcelas: z
    .number("Parcelas deve ser um número")
    .int("Parcelas deve ser um número inteiro")
    .min(6, "Mínimo de 6 parcelas")
    .max(96, "Máximo de 96 parcelas"),
});

export type SimulacaoInput = z.infer<typeof simulacaoSchema>;