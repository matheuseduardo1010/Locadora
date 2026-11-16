const API_LOGS_URL = '/logs';

// Escapa texto antes de colocar no innerHTML
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const moeda = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');

function formatarDetalhes(log) {
  const d = log.detalhes || {};

  switch (log.acao) {
    case 'CRIAR_VEICULO':
    case 'ATUALIZAR_VEICULO':
      return `
        <strong>Veículo:</strong> ${esc(d.marca)} ${esc(d.modelo)} (${esc(d.ano)})<br>
        <strong>Placa:</strong> ${esc(d.placa)} — <strong>Diária:</strong> ${moeda(d.valor_diaria)}<br>
        <small>ID: ${esc(d.id ?? 'N/A')}</small>`;

    case 'CRIAR_CLIENTE':
    case 'ATUALIZAR_CLIENTE':
      return `
        <strong>Nome:</strong> ${esc(d.nome)}<br>
        <strong>CPF:</strong> ${esc(d.cpf)}<br>
        <small>ID: ${esc(d.id ?? 'N/A')}</small>`;

    case 'DELETAR_VEICULO':
    case 'DELETAR_CLIENTE':
      return `<span style="color:red;">ID Removido:</span> <strong>${esc(d.idRemovido ?? d.id ?? 'N/A')}</strong>`;

    case 'CRIAR_LOCACAO':
      return `
        <strong>Veículo ID:</strong> ${esc(d.veiculo_id)} — <strong>Cliente ID:</strong> ${esc(d.cliente_id)}<br>
        <strong>Retirada:</strong> ${esc(d.data_retirada)} — <strong>Prevista:</strong> ${esc(d.data_prevista)}<br>
        <small>Locação #${esc(d.id)} — estimado ${moeda(d.valor_estimado)}</small>`;

    case 'DEVOLVER_VEICULO':
      return `
        <strong>Locação #${esc(d.id)}</strong> (veículo ${esc(d.veiculo_id)})<br>
        <strong>Devolução:</strong> ${esc(d.data_devolucao)} — ${esc(d.dias)} diária(s)<br>
        <strong>Total:</strong> ${moeda(d.valor_total)}`;

    default:
      return esc(JSON.stringify(d));
  }
}

function classeAcao(acao) {
  if (acao.startsWith('DELETAR')) return 'acao-delete';
  if (acao.startsWith('CRIAR')) return 'acao-create';
  if (acao.startsWith('ATUALIZAR')) return 'acao-update';
  return 'acao-other';
}

async function carregarLogs() {
  const tbody = document.getElementById('tabelaLogs');
  try {
    const response = await fetch(API_LOGS_URL);
    if (!response.ok) throw new Error('Erro ao buscar logs');
    const logs = await response.json();

    tbody.innerHTML = '';

    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum log registrado.</td></tr>';
      return;
    }

    logs.forEach((log, index) => {
      const tr = document.createElement('tr');
      const dataFormatada = new Date(log.dataCriacao).toLocaleString('pt-BR');

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><span class="tag-acao ${classeAcao(log.acao)}">${esc(log.acao)}</span></td>
        <td>${formatarDetalhes(log)}</td>
        <td>${dataFormatada}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Erro ao carregar logs:', error);
    tbody.innerHTML = '<tr><td colspan="4" style="color:red;text-align:center;">Erro ao carregar logs do MongoDB.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', carregarLogs);
