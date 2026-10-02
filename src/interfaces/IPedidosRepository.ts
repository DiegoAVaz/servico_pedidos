import type { IPedido } from './IPedido';

export interface IPedidosRepository {
  salvar(pedido: Omit<IPedido, 'data_criacao' | 'id' | 'status'>): Promise<number>;
}
