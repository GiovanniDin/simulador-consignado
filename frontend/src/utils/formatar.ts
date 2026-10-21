const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 1234.5 → "R$ 1.234,50" */
export function formatarMoeda(valor: number): string {
  return moeda.format(valor);
}

/** 0.0199 → "1,99% a.m." */
export function formatarTaxa(taxaMensal: number): string {
  return `${(taxaMensal * 100).toFixed(2).replace(".", ",")}% a.m.`;
}

/** Aplica a máscara enquanto o usuário digita: "52998224725" → "529.982.247-25" */
export function formatarCpf(valor: string): string {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** "11222333000181" → "11.222.333/0001-81" */
export function formatarCnpj(valor: string): string {
  return valor
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}