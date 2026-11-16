const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');
const { hoje, calcularDias } = require('../utils/datas');

async function criarLocacao(req, res) {
  const { veiculo_id, cliente_id, data_prevista } = req.body;
  const data_retirada = req.body.data_retirada || hoje();

  if (!veiculo_id || !cliente_id || !data_prevista) {
    return res.status(400).json({
      mensagem: "Os campos 'veiculo_id', 'cliente_id' e 'data_prevista' são obrigatórios."
    });
  }
  if (new Date(data_prevista) < new Date(data_retirada)) {
    return res.status(400).json({ mensagem: 'A data prevista não pode ser anterior à retirada.' });
  }

  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();

    const [veiculos] = await conexao.query(
      'SELECT * FROM veiculos WHERE id = ? FOR UPDATE', [veiculo_id]
    );
    if (veiculos.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Veículo não encontrado.' });
    }
    if (veiculos[0].status !== 'disponivel') {
      await conexao.rollback();
      return res.status(409).json({ mensagem: 'Veículo indisponível (já está alugado).' });
    }

    const [clientes] = await conexao.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (clientes.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    const [resultado] = await conexao.query(
      `INSERT INTO locacoes (veiculo_id, cliente_id, data_retirada, data_prevista)
       VALUES (?, ?, ?, ?)`,
      [veiculo_id, cliente_id, data_retirada, data_prevista]
    );
    await conexao.query("UPDATE veiculos SET status = 'alugado' WHERE id = ?", [veiculo_id]);
    await conexao.commit();

    const dias = calcularDias(data_retirada, data_prevista);
    const novaLocacao = {
      id: resultado.insertId,
      veiculo_id,
      cliente_id,
      data_retirada,
      data_prevista,
      status: 'ativa',
      valor_estimado: Number((dias * veiculos[0].valor_diaria).toFixed(2))
    };
    await registrarLog('CRIAR_LOCACAO', novaLocacao);
    res.status(201).json(novaLocacao);
  } catch (error) {
    await conexao.rollback();
    res.status(500).json({ mensagem: 'Erro ao criar locação.', erro: error.message });
  } finally {
    conexao.release();
  }
}

module.exports = criarLocacao;
