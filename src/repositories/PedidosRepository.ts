import knex = require('../database/knex');
import type { IPedido } from '../interfaces/IPedido';
import type { IPedidosRepository } from '../interfaces/IPedidosRepository';

class PedidosRepository implements IPedidosRepository {
  async salvar(
    pedido: Omit<IPedido, 'data_criacao' | 'id' | 'status'>,
  ): Promise<number> {
    const [id] = await knex<IPedido>('pedidos').insert({
      usuario_id: pedido.usuario_id,
      valor_total: pedido.valor_total,
      status: 'criado',
      data_criacao: new Date(),
    });

    if (id === undefined) {
      throw new Error('Não foi possível obter o ID do pedido inserido.');
    }

    return id;
  }
}

export = PedidosRepository;
