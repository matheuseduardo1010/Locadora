const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');

async function criarVeiculo(req, res) {
  const { placa, marca, modelo, ano, valor_diaria } = req.body;

  if (!placa || !marca || !modelo || !ano || !valor_diaria) {
    return res.status(400).json({
      mensagem: "Os campos 'placa', 'marca', 'modelo', 'ano' e 'valor_diaria' são obrigatórios."
    });
  }

  try {
    const [resultado] = await db.query(
      'INSERT INTO veiculos (placa, marca, modelo, ano, valor_diaria) VALUES (?, ?, ?, ?, ?)',
      [placa, marca, modelo, ano, valor_diaria]
    );
    const novoVeiculo = {
      id: resultado.insertId, placa, marca, modelo, ano, valor_diaria, status: 'disponivel'
    };
    await registrarLog('CRIAR_VEICULO', novoVeiculo);
    res.status(201).json(novoVeiculo);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Já existe um veículo com essa placa.' });
    }
    res.status(500).json({ mensagem: 'Erro ao criar veículo.', erro: error.message });
  }
}

module.exports = criarVeiculo;
