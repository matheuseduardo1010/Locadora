const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');

async function atualizarCliente(req, res) {
  const id = Number(req.params.id);
  const { nome, cpf, telefone } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ mensagem: "Os campos 'nome' e 'cpf' são obrigatórios." });
  }

  try {
    const [resultado] = await db.query(
      'UPDATE clientes SET nome = ?, cpf = ?, telefone = ? WHERE id = ?',
      [nome, cpf, telefone || null, id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado para atualização.' });
    }
    const clienteAtualizado = { id, nome, cpf, telefone: telefone || null };
    await registrarLog('ATUALIZAR_CLIENTE', clienteAtualizado);
    res.status(200).json(clienteAtualizado);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Já existe um cliente com esse CPF.' });
    }
    res.status(500).json({ mensagem: 'Erro ao atualizar cliente.', erro: error.message });
  }
}

module.exports = atualizarCliente;
