const express = require('express');
const router = express.Router();

const listarLocacoes = require('../controllers/listarLocacoes');
const buscarLocacaoPorId = require('../controllers/buscarLocacaoPorId');
const criarLocacao = require('../controllers/criarLocacao');
const devolverLocacao = require('../controllers/devolverLocacao');

router.get('/', listarLocacoes);
router.get('/:id', buscarLocacaoPorId);
router.post('/', criarLocacao);
router.put('/:id/devolver', devolverLocacao);

module.exports = router;
