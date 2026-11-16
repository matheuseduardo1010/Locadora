const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');

async function criarCliente(req, res) {
  const { nome, cpf, telefone } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ mensagem: "Os campos 'nome' e 'cpf' são obrigatórios." });
  }

  try {
    const [resultado] = await db.query(
      'INSERT INTO clientes (nome, cpf, telefone) VALUES (?, ?, ?)',
      [nome, cpf, telefone || null]
    );
    const novoCliente = { id: resultado.insertId, nome, cpf, telefone: telefone || null };
    await registrarLog('CRIAR_CLIENTE', novoCliente);
    res.status(201).json(novoCliente);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Já existe um cliente com esse CPF.' });
    }
    res.status(500).json({ mensagem: 'Erro ao criar cliente.', erro: error.message });
  }
}

module.exports = criarCliente;
