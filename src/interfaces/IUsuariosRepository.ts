export interface IUsuariosRepository {
  adicionarPontos(usuario_id: number, pontos: number, pedido_id: number): Promise<void>;
}
