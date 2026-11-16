const express = require('express');
const router = express.Router();

const listarVeiculos = require('../controllers/listarVeiculos');
const buscarVeiculoPorId = require('../controllers/buscarVeiculoPorId');
const criarVeiculo = require('../controllers/criarVeiculo');
const atualizarVeiculo = require('../controllers/atualizarVeiculo');
const deletarVeiculo = require('../controllers/deletarVeiculo');

router.get('/', listarVeiculos);
router.get('/:id', buscarVeiculoPorId);
router.post('/', criarVeiculo);
router.put('/:id', atualizarVeiculo);
router.delete('/:id', deletarVeiculo);

module.exports = router;
