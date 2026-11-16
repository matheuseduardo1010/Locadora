const db = require('../config/database');

async function buscarVeiculoPorId(req, res) {
  const id = Number(req.params.id);
  try {
    const [linhas] = await db.query('SELECT * FROM veiculos WHERE id = ?', [id]);
    if (linhas.length === 0) {
      return res.status(404).json({ mensagem: 'Veículo não encontrado.' });
    }
    res.status(200).json(linhas[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar veículo.', erro: error.message });
  }
}

module.exports = buscarVeiculoPorId;
