import type { IUsuariosRepository } from '../interfaces/IUsuariosRepository';
import type { IMessagingService } from '../interfaces/IMessagingService';

class ProcessarPontosUseCase {
  constructor(
    private readonly usuariosRepository: IUsuariosRepository,
    private readonly messagingService: IMessagingService,
  ) {}

  async execute(): Promise<void> {
    const mensagens = await this.messagingService.receberMensagens();

    for (const mensagem of mensagens) {
      if (!mensagem.Body || !mensagem.ReceiptHandle) {
        throw new Error('Mensagem sem Body ou ReceiptHandle.');
      }

      const { pedido_id, usuario_id, valor_total } = JSON.parse(mensagem.Body);
      const pontos = Math.floor(valor_total / 10);

      await this.usuariosRepository.adicionarPontos(usuario_id, pontos, pedido_id);
      await this.messagingService.deletarMensagem(mensagem.ReceiptHandle);
    }
  }
}

export = ProcessarPontosUseCase;
