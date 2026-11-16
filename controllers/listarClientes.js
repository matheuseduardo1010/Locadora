const db = require('../config/database');

async function listarClientes(req, res) {
  try {
    const [linhas] = await db.query('SELECT * FROM clientes');
    res.status(200).json(linhas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar clientes.', erro: error.message });
  }
}

module.exports = listarClientes;
