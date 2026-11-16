const db = require('../config/database');

async function buscarLocacaoPorId(req, res) {
  const id = Number(req.params.id);
  try {
    const [linhas] = await db.query(`
      SELECT l.*, v.placa, v.modelo, c.nome AS cliente
      FROM locacoes l
      JOIN veiculos v ON v.id = l.veiculo_id
      JOIN clientes c ON c.id = l.cliente_id
      WHERE l.id = ?
    `, [id]);
    if (linhas.length === 0) {
      return res.status(404).json({ mensagem: 'Locação não encontrada.' });
    }
    res.status(200).json(linhas[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar locação.', erro: error.message });
  }
}

module.exports = buscarLocacaoPorId;
