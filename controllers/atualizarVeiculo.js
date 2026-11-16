const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');

async function atualizarVeiculo(req, res) {
  const id = Number(req.params.id);
  const { placa, marca, modelo, ano, valor_diaria } = req.body;

  if (!placa || !marca || !modelo || !ano || !valor_diaria) {
    return res.status(400).json({
      mensagem: "Os campos 'placa', 'marca', 'modelo', 'ano' e 'valor_diaria' são obrigatórios."
    });
  }

  try {
    const [resultado] = await db.query(
      'UPDATE veiculos SET placa = ?, marca = ?, modelo = ?, ano = ?, valor_diaria = ? WHERE id = ?',
      [placa, marca, modelo, ano, valor_diaria, id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Veículo não encontrado para atualização.' });
    }
    const veiculoAtualizado = { id, placa, marca, modelo, ano, valor_diaria };
    await registrarLog('ATUALIZAR_VEICULO', veiculoAtualizado);
    res.status(200).json(veiculoAtualizado);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Já existe um veículo com essa placa.' });
    }
    res.status(500).json({ mensagem: 'Erro ao atualizar veículo.', erro: error.message });
  }
}

module.exports = atualizarVeiculo;
