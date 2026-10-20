export const PERCENTUAL_MARGEM_CONSIGNAVEL = 0.35;

/** Arredonda para centavos (2 casas decimais) */
export function arredondarCentavos(valor:number):
number{
    return Math.round(valor * 100) / 100;
}   
/**
 * Calcula o valor da parcela pela Tabela Price.
 * @param valor valor solicitado em reais
 * @param taxaMensal taxa mensal em decimal (ex.: 0.018 = 1,8%)
 * @param meses número de parcelas
 */
export function calcularParcela(valor: number, taxaMensal: number, meses: number): 
number{
    if( valor <= 0 || meses <= 0 || taxaMensal <0) {
       throw new Error("Parâmetros inválidos para cálculo da parcela.");
    }

    if (taxaMensal === 0) {
        return arredondarCentavos(valor/meses);
    
    }

    const parcela = (valor * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));
    return arredondarCentavos(parcela);
}

export function calcularMargemConsignavel(salario: number): number {
   return arredondarCentavos(salario * PERCENTUAL_MARGEM_CONSIGNAVEL);
}

export function calcularValorTotal(parcela: number, meses: number): number{
    return arredondarCentavos(parcela * meses);
}