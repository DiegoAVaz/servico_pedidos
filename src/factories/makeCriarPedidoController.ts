import PedidosRepository = require('../repositories/PedidosRepository');
import SQSService = require('../services/SQSService');
import CriarPedidoUseCase = require('../useCases/CriarPedidoUseCase');
import CriarPedidoController = require('../controllers/CriarPedidoController');

function makeCriarPedidoController(): CriarPedidoController {
  const pedidosRepository = new PedidosRepository();
  const messagingService = new SQSService();
  const criarPedidoUseCase = new CriarPedidoUseCase(
    pedidosRepository,
    messagingService,
  );

  return new CriarPedidoController(criarPedidoUseCase);
}

export = makeCriarPedidoController;
