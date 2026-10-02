# Contexto do Projeto: Sistema de Recompensas (AWS)

## Stack Tecnológica
- Node.js (v20) + TypeScript
- Express
- Knex.js (Query Builder para MySQL)
- @aws-sdk/client-sqs (AWS SQS para mensageria)

## Regras de Arquitetura e Diretórios (src/)
- **interfaces (ou types):** Contém exclusivamente as tipagens, DTOs (Data Transfer Objects) e as interfaces dos repositórios e serviços. Nenhuma implementação aqui.
- **database:** Configuração da conexão do Knex e possíveis arquivos de migração.
- **repositories:** Responsável exclusivo por acessar o banco de dados. Obrigatoriamente utiliza a instância do Knex exportada de `src/database`.
- **services:** Integrações externas (ex: AWS SQS).
- **useCases:** Contém as regras de negócio. Depende apenas das interfaces, nunca das implementações concretas.
- **controllers:** Lida apenas com requisições e respostas HTTP (Express req/res).
- **factories:** Faz a Injeção de Dependências (instancia Repositories, Services, UseCases e Controllers).
- **middlewares:** Tratamento de erros globais e validação.
- **routes:** Mapeamento de endpoints.
- **utils:** Funções auxiliares.
- **app.ts & server.ts:** Configuração do Express e ponto de entrada.

## Regras de Negócio (API de Pedidos)
1. Recebe `usuario_id` e `valor_total`.
2. O `PedidosRepository` (usando Knex) salva o pedido no MySQL com status 'criado' e retorna o ID inserido.
3. O `SQSService` publica o payload (pedido_id, usuario_id, valor_total) na fila AWS SQS.
4. O Controller responde 201 Created para o cliente rapidamente.

## Regras de Negócio (Worker de Pontos)
1. O Worker atua num loop contínuo (Long Polling) consultando a fila SQS.
2. Ao receber uma mensagem, extrai `pedido_id`, `usuario_id` e `valor_total`.
3. Calcula os pontos: 1 ponto para cada 10 unidades de valor_total (arredondado para baixo).
4. O `UsuariosRepository` inicia uma transação no banco de dados para:
   - Somar os pontos calculados ao `saldo_pontos` na tabela `usuarios`.
   - Inserir um registo na tabela `historico_pontos` (operacao: 'credito', motivo: 'Pedido X').
5. Se a transação for bem-sucedida, o `SQSService` elimina a mensagem da fila.
6. O Worker não tem Controllers ou Rotas HTTP, é um script de background (`src/worker.ts`).