const express = require('express');
const router = express.Router();

const listarClientes = require('../controllers/listarClientes');
const buscarClientePorId = require('../controllers/buscarClientePorId');
const criarCliente = require('../controllers/criarCliente');
const atualizarCliente = require('../controllers/atualizarCliente');
const deletarCliente = require('../controllers/deletarCliente');

router.get('/', listarClientes);
router.get('/:id', buscarClientePorId);
router.post('/', criarCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', deletarCliente);

module.exports = router;
