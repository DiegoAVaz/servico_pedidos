import 'dotenv/config';
import sqs = require('@aws-sdk/client-sqs');
import process = require('node:process');
import type { IMessagingService } from '../interfaces/IMessagingService';

const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = sqs;

class SQSService implements IMessagingService {
  private readonly client = new SQSClient({});

  async enviarMensagem(payload: any): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.getQueueUrl(),
      MessageBody: JSON.stringify(payload),
    });

    await this.client.send(command);
  }

  async receberMensagens(): Promise<any[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.getQueueUrl(),
      WaitTimeSeconds: 20,
    });

    const response = await this.client.send(command);
    return response.Messages ?? [];
  }

  async deletarMensagem(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.getQueueUrl(),
      ReceiptHandle: receiptHandle,
    });

    await this.client.send(command);
  }

  private getQueueUrl(): string {
    const queueUrl = process.env.SQS_QUEUE_URL;

    if (!queueUrl) {
      throw new Error('A variável SQS_QUEUE_URL deve ser configurada.');
    }

    return queueUrl;
  }
}

export = SQSService;
