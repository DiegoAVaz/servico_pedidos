import type { Request, Response } from 'express';
import type CriarPedidoUseCase = require('../useCases/CriarPedidoUseCase');

class CriarPedidoController {
  constructor(private readonly criarPedidoUseCase: CriarPedidoUseCase) {}

  handle = async (request: Request, response: Response): Promise<void> => {
    const { usuario_id, valor_total } = request.body;
    const pedido_id = await this.criarPedidoUseCase.execute({
      usuario_id,
      valor_total,
    });

    response.status(201).json({ pedido_id });
  };
}

export = CriarPedidoController;
