const Log = require('../models/logModel');

// Auditoria no MongoDB. Se o Mongo falhar, a operação principal (MySQL) não é desfeita.
async function registrarLog(acao, detalhes) {
  try {
    await Log.create({ acao, detalhes });
  } catch (error) {
    console.error('Falha ao registrar log:', error.message);
  }
}

module.exports = registrarLog;
