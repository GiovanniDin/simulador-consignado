# Simulador de Empréstimo Consignado

MVP de uma aplicação em que o cliente informa seus dados e recebe, de uma só vez, a avaliação de vários bancos para um empréstimo consignado, com a melhor oferta destacada.

O foco é a integração com serviços de terceiros: cada banco responde em um formato diferente, pode demorar e pode falhar. A aplicação **interpreta, consolida e apresenta** o resultado de cada instituição sem quebrar quando um banco está instável.

## Como executar

**Pré-requisito:** Node.js 22 ou superior.

Nesse projeto, são três aplicações, cada uma em um terminal:

```bash
# 1. API (porta 3000)
cd backend
npm install
npm run dev

# 2. Bancos simulados (porta 4000)
cd mock-banks
npm install
npm run dev

# 3. Interface (porta 5173)
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173**.

> Os bancos simulados têm *atraso aleatório (0,2 a 4 s) e 15% de chance de erro 500*, de propósito, para demonstrar a resiliência. Para respostas previsíveis, rode-os com o caos desligado:
> `$env:CAOS="off"; npm run dev` (PowerShell) ou `CAOS=off npm run dev` (Linux/macOS).

### Dados fictícios para teste

| Campo | Valor |
|---|---|
| CPF | 529.982.247-25 |
| CNPJ do empregador | 11.222.333/0001-81 |
| CNPJ em lista restrita (Banco Beta recusa) | 11.444.777/0001-61 |

Ex.: salário **R$ 3.000** e valor **R$ 30.000** em 48x → o Alfa recusa e o Beta aprova. Salário **R$ 10.000** → os dois aprovam, e o Alfa é a melhor oferta.

### Testes

```bash
cd backend
npm test
```

São 24 testes automatizados: regras de negócio, validação de CPF/CNPJ, escolha da melhor oferta, mascaramento de CPF e o comportamento do serviço quando bancos falham ou estouram o tempo.

Os arquivos `backend/request.http` e `mock-banks/requests.http` têm requisições prontas (extensão REST Client do VS Code), incluindo os casos de erro.

## Arquitetura

```
simulador-consignado/
├── backend/        API em Node.js + Express + TypeScript (porta 3000)
├── mock-banks/     "Bancos de terceiros" simulados (porta 4000)
└── frontend/       Interface em React + Vite + TypeScript (porta 5173)
```

### Backend: separação de responsabilidades

```
backend/src/
├── routes/        URL → controller
├── controllers/   Recebe a requisição, valida e responde
├── validation/    Schema Zod + validação de CPF/CNPJ (dígitos verificadores)
├── services/      Consulta todos os bancos em paralelo e trata falhas
├── banks/         Um adapter por banco + o contrato comum (BankAdapter)
├── domain/        Regras puras: parcela (Tabela Price), margem, idade, melhor oferta
├── middlewares/   Tratamento global de erros e 404
└── utils/         Log estruturado com CPF mascarado
```

### Fluxo de uma simulação

1. O **controller** valida a entrada com Zod. Se a entrada for inválida, responde **400** com a mensagem de cada campo.
2. O **service** chama todos os bancos **ao mesmo tempo** (`Promise.allSettled`).
3. Cada **adapter** chama o seu banco com **timeout de 3 s**, confere o status HTTP, **valida a resposta** e a **traduz** para um formato único (`APROVADO`, `REPROVADO` ou `INDISPONIVEL`).
4. Banco que falhou ou estourou o tempo vira `INDISPONIVEL`, **sem derrubar os demais**.
5. A API devolve o resultado de cada banco e a **melhor oferta** (menor custo total).

### Bancos simulados

| | Banco Alfa | Banco Beta |
|---|---|---|
| Formato | Português, taxa em % | Inglês, taxa decimal, códigos de recusa (R01–R03) |
| Taxa | 1,79% a.m. | 1,99% a.m. |
| Regras | Parcela até 30% do salário | Parcela até 35% do salário, idade até 75 anos no fim do contrato, empregador fora da lista restrita |

## Decisões técnicas

- **TypeScript com `strict`** em todo o projeto, por preferência da vaga e para pegar erros enquanto se programa.
- **Adapter por banco:** isola o formato de cada instituição. Para adicionar um banco, basta criar um adapter e incluí-lo na lista, sem alterar o service nem o controller.
- **`Promise.allSettled` + timeout (`AbortSignal.timeout`):** as chamadas são paralelas, o tempo de espera é limitado, e a falha de um banco não afeta os outros.
- **Zod na entrada e nas respostas dos bancos:** os tipos do TypeScript não existem em tempo de execução. O Zod valida os dados de fato e gera os tipos (`z.infer`). Nas respostas dos bancos, uma mudança inesperada de formato vira `INDISPONIVEL`, em vez de um valor errado para o cliente.
- **Injeção de dependência no service:** ele recebe os adapters por parâmetro, o que permite testar falhas com bancos falsos, sem rede.
- **Bancos simulados como servidor separado:** comunicação HTTP real e nenhum código compartilhado, como aconteceria com terceiros.
- **Configuração por variáveis de ambiente** (`backend/.env.example`): URL dos bancos e timeout.
- **Vitest** para testes e **Prettier** para formatação padronizada.

## Propostas

Formato: **Problema → Proposta → Por quê**.

### Implementadas

1. **Um banco fora do ar derrubaria a simulação inteira.**
   → Consulta com `Promise.allSettled`; o banco com falha aparece como "Indisponível";
   → O cliente continua vendo as outras ofertas, e a operação não para por causa de um terceiro.

2. **Um banco lento deixaria o cliente esperando indefinidamente.**
   → Timeout de 3 s por banco, com chamadas em paralelo;
   → O tempo de resposta fica previsível (no máximo ~3 s), mesmo com bancos instáveis.

3. **Um banco pode mudar o formato da resposta sem avisar.**
   → Validação das respostas com Zod em cada adapter;
   → O sistema nunca mostra um valor errado ao cliente; a falha aparece no log.

4. **Dados pessoais em logs violam a LGPD.**
   → Logs estruturados (JSON) com **CPF mascarado** (`***.982.247-**`); nome e e-mail não são registrados;
   → Observabilidade (tempo e falhas de cada banco) sem expor o cliente.

5. **Erros inesperados expunham detalhes internos** (um JSON malformado devolvia o stack trace com os caminhos do servidor);
   → Tratador global de erros: o cliente sempre recebe um JSON padronizado, e o detalhe fica só no log. Também foi removido o cabeçalho `X-Powered-By`.
   → Reduz a superfície de ataque e mantém a API consistente.

6. **O cliente precisa comparar ofertas por conta própria.**
   → Destaque da **melhor oferta**, pelo **menor custo total**, e exibição do total a pagar;
   → Decisão mais simples e transparente; o critério é o que o cliente efetivamente paga.

7. **"Recusado" e "banco fora do ar" são situações diferentes para o cliente.**
   → Mensagens distintas: Quando todos os bancos estão fora do ar, a mensagem sugere tentar novamente, em vez de mudar o valor;
   → Evita que o cliente desista achando que foi recusado.

### Planejadas (em ordem de prioridade)

1. **Processamento assíncrono:** devolver um protocolo imediatamente e o cliente acompanhar o status. Bancos reais podem levar minutos para analisar.
2. **Circuit breaker por banco:** parar de chamar, por um tempo, um banco que está falhando repetidamente. Poupa o tempo do cliente e a infraestrutura.
3. **"Tentar novamente" apenas nos bancos indisponíveis**, sem refazer toda a simulação.
4. **Persistência e histórico das simulações**, para auditoria e para o cliente retomar depois.
5. **Rate limiting e autenticação**, como proteção contra abuso e uso indevido de dados pessoais.
6. **Métricas por banco** (taxa de aprovação, latência e falhas), para a empresa negociar com os parceiros.
7. **Suporte ao CNPJ alfanumérico**, adotado pela Receita Federal a partir de julho de 2026.

## Limitações

- Bancos e dados são fictícios; não há integração com instituições reais.
- Não há banco de dados nem autenticação.
- Os valores monetários usam `number` com arredondamento em centavos (em produção: centavos inteiros ou tipo decimal).
- O validador de CNPJ aceita apenas o formato numérico; o novo formato alfanumérico, adotado pela Receita Federal em julho de 2026, ainda não é suportado.  
- As regras de margem e as taxas são simplificadas.

## Uso de IA

Usei inteligência artificial como tutora durante o projeto. Ela me ajudou a planejar as etapas, explicou conceitos novos para mim (como o padrão Adapter, Promise.allSettled e validação com Zod) e forneceu exemplos de código como ponto de partida. A partir deles, montei, adaptei e testei cada parte do sistema, investiguei e corrigi os erros que apareceram no caminho (de configuração de ambiente a Git) e implementei por conta própria trechos como a validação de CNPJ, a regra R02 do banco simulado e diversos testes. Também usei a IA para revisar o código. Todas as decisões finais foram minhas, e consigo explicar cada uma delas e cada parte da solução.