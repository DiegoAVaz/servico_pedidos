import 'dotenv/config';
import UsuariosRepository = require('./repositories/UsuariosRepository');
import SQSService = require('./services/SQSService');
import ProcessarPontosUseCase = require('./useCases/ProcessarPontosUseCase');

const usuariosRepository = new UsuariosRepository();
const messagingService = new SQSService();
const processarPontosUseCase = new ProcessarPontosUseCase(
  usuariosRepository,
  messagingService,
);

async function iniciarWorker(): Promise<void> {
  console.log('⏳ Worker iniciado e escutando a fila SQS...')
  while (true) {
    try {
      await processarPontosUseCase.execute();
    } catch (error) {
      console.error('Erro ao processar pontos:', error);
      await new Promise<void>((resolve) => setTimeout(resolve, 5000));
    }
  }
}

void iniciarWorker();
