const db = require('../config/database');

async function listarLocacoes(req, res) {
  try {
    const [linhas] = await db.query(`
      SELECT l.*, v.placa, v.modelo, c.nome AS cliente
      FROM locacoes l
      JOIN veiculos v ON v.id = l.veiculo_id
      JOIN clientes c ON c.id = l.cliente_id
      ORDER BY l.id DESC
    `);
    res.status(200).json(linhas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar locações.', erro: error.message });
  }
}

module.exports = listarLocacoes;
