const db = require('../config/database');
const registrarLog = require('../utils/registrarLog');
const { hoje, calcularDias } = require('../utils/datas');

async function devolverLocacao(req, res) {
  const id = Number(req.params.id);

  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();

    const [locacoes] = await conexao.query(
      `SELECT l.*, v.valor_diaria
       FROM locacoes l JOIN veiculos v ON v.id = l.veiculo_id
       WHERE l.id = ? FOR UPDATE`,
      [id]
    );
    if (locacoes.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Locação não encontrada.' });
    }
    const locacao = locacoes[0];
    if (locacao.status === 'finalizada') {
      await conexao.rollback();
      return res.status(409).json({ mensagem: 'Esta locação já foi finalizada.' });
    }

    const data_devolucao = hoje();
    const dias = calcularDias(locacao.data_retirada, data_devolucao);
    const valor_total = Number((dias * locacao.valor_diaria).toFixed(2));

    await conexao.query(
      `UPDATE locacoes SET data_devolucao = ?, valor_total = ?, status = 'finalizada' WHERE id = ?`,
      [data_devolucao, valor_total, id]
    );
    await conexao.query("UPDATE veiculos SET status = 'disponivel' WHERE id = ?", [locacao.veiculo_id]);
    await conexao.commit();

    const resumo = { id, veiculo_id: locacao.veiculo_id, data_devolucao, dias, valor_total };
    await registrarLog('DEVOLVER_VEICULO', resumo);
    res.status(200).json(resumo);
  } catch (error) {
    await conexao.rollback();
    res.status(500).json({ mensagem: 'Erro ao devolver veículo.', erro: error.message });
  } finally {
    conexao.release();
  }
}

module.exports = devolverLocacao;
