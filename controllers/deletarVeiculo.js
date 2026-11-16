const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');

async function deletarVeiculo(req, res) {
  const id = Number(req.params.id);
  try {
    const [resultado] = await db.query('DELETE FROM veiculos WHERE id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Veículo não encontrado para exclusão.' });
    }
    await registrarLog('DELETAR_VEICULO', { idRemovido: id });
    res.status(200).json({ mensagem: 'Veículo removido com sucesso!' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ mensagem: 'Veículo possui locações registradas e não pode ser excluído.' });
    }
    res.status(500).json({ mensagem: 'Erro ao deletar veículo.', erro: error.message });
  }
}

module.exports = deletarVeiculo;
