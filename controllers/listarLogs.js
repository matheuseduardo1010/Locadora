const Log = require('../models/logModel');

async function listarLogs(req, res) {
  try {
    // Busca os últimos 50 logs ordenados pelo mais recente
    const logs = await Log.find().sort({ dataCriacao: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar logs.', erro: error.message });
  }
}

module.exports = listarLogs;
