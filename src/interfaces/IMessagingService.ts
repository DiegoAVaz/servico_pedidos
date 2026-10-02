export interface IMessagingService {
  enviarMensagem(payload: any): Promise<void>;
  receberMensagens(): Promise<any[]>;
  deletarMensagem(receiptHandle: string): Promise<void>;
}
