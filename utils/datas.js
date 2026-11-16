const MS_POR_DIA = 24 * 60 * 60 * 1000;

function hoje() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

// Quantidade de diárias (mínimo 1)
function calcularDias(inicio, fim) {
  const dias = Math.ceil((new Date(fim) - new Date(inicio)) / MS_POR_DIA);
  return Math.max(1, dias);
}

module.exports = { hoje, calcularDias };
