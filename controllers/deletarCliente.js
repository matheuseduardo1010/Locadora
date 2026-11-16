const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');

async function deletarCliente(req, res) {
  const id = Number(req.params.id);
  try {
    const [resultado] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado para exclusão.' });
    }
    await registrarLog('DELETAR_CLIENTE', { idRemovido: id });
    res.status(200).json({ mensagem: 'Cliente removido com sucesso!' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ mensagem: 'Cliente possui locações registradas e não pode ser excluído.' });
    }
    res.status(500).json({ mensagem: 'Erro ao deletar cliente.', erro: error.message });
  }
}

module.exports = deletarCliente;
