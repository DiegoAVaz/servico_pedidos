import knex = require('../database/knex');
import type { IUsuariosRepository } from '../interfaces/IUsuariosRepository';

class UsuariosRepository implements IUsuariosRepository {
  async adicionarPontos(
    usuario_id: number,
    pontos: number,
    pedido_id: number,
  ): Promise<void> {
    const transaction = await knex.transaction();

    try {
      const usuariosAtualizados = await transaction('usuarios')
        .where({ id: usuario_id })
        .increment('saldo_pontos', pontos);

      if (usuariosAtualizados === 0) {
        throw new Error('Usuário não encontrado para adicionar pontos.');
      }

      await transaction('historico_pontos').insert({
        usuario_id,
        pontos,
        operacao: 'credito',
        motivo: `Pedido ${pedido_id}`,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export = UsuariosRepository;
