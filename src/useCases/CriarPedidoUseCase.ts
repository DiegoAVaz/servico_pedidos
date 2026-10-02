import type { IPedido } from '../interfaces/IPedido';
import type { IPedidosRepository } from '../interfaces/IPedidosRepository';
import type { IMessagingService } from '../interfaces/IMessagingService';

class CriarPedidoUseCase {
  constructor(
    private readonly pedidosRepository: IPedidosRepository,
    private readonly messagingService: IMessagingService,
  ) {}

  async execute(
    pedido: Omit<IPedido, 'data_criacao' | 'id' | 'status'>,
  ): Promise<number> {
    const { usuario_id, valor_total } = pedido;
    const pedido_id = await this.pedidosRepository.salvar({
      usuario_id,
      valor_total,
    });

    await this.messagingService.enviarMensagem({
      pedido_id,
      usuario_id,
      valor_total,
    });

    return pedido_id;
  }
}

export = CriarPedidoUseCase;
