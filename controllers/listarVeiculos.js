const db = require('../config/database');

async function listarVeiculos(req, res) {
  try {
    const { status } = req.query; // ex.: /veiculos?status=disponivel
    let linhas;
    if (status) {
      [linhas] = await db.query('SELECT * FROM veiculos WHERE status = ?', [status]);
    } else {
      [linhas] = await db.query('SELECT * FROM veiculos');
    }
    res.status(200).json(linhas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar veículos.', erro: error.message });
  }
}

module.exports = listarVeiculos;
