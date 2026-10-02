import express = require('express');
import makeCriarPedidoController = require('../factories/makeCriarPedidoController');

const routes = express.Router();
const criarPedidoController = makeCriarPedidoController();

routes.post('/pedidos', criarPedidoController.handle);

export = routes;
