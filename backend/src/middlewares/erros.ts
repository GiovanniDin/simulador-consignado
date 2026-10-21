import type { NextFunction, Request, Response } from "express";

/** Rota inexistente: responde em JSON, no mesmo padrão dos outros erros da API */
export function rotaNaoEncontrada(req: Request, res: Response): void {
  res.status(404).json({
    erro: "ROTA_NAO_ENCONTRADA",
    mensagem: `A rota ${req.method} ${req.path} não existe`,
  });
}

/** Último recurso: nenhum erro inesperado chega ao cliente com detalhes internos */
export function tratarErros(erro: unknown, req: Request, res: Response, _next: NextFunction): void {
  // JSON malformado no corpo (erro gerado pelo express.json)
  if (erro instanceof SyntaxError && "type" in erro && erro.type === "entity.parse.failed") {
    res.status(400).json({
      erro: "JSON_INVALIDO",
      mensagem: "O corpo da requisição não é um JSON válido",
    });
    return;
  }

  // O detalhe fica só no log do servidor; o cliente recebe uma mensagem genérica
  console.error(`[erro] ${req.method} ${req.path}:`, erro instanceof Error ? erro.message : erro);
  res.status(500).json({
    erro: "ERRO_INTERNO",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  });
}
