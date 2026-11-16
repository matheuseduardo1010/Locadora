// ---------- Utilitários ----------
const $ = (id) => document.getElementById(id);

// Escapa texto antes de colocar no innerHTML (evita injeção de HTML)
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const moeda = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');

async function api(url, metodo = 'GET', corpo) {
  const opcoes = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (corpo) opcoes.body = JSON.stringify(corpo);
  const resposta = await fetch(url, opcoes);
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.mensagem || 'Erro na requisição.');
  return dados;
}

let veiculosCache = [];
let clientesCache = [];

// ---------- Abas ----------
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((t) => t.classList.add('hidden'));
    btn.classList.add('active');
    $('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});

document.addEventListener('DOMContentLoaded', carregarTudo);

async function carregarTudo() {
  await Promise.all([carregarVeiculos(), carregarClientes()]);
  preencherSelects();
  carregarLocacoes();
}

// ---------- VEÍCULOS ----------
async function carregarVeiculos() {
  try {
    veiculosCache = await api('/veiculos');
    renderizarVeiculos(veiculosCache);
  } catch (error) {
    console.error(error);
    $('veiculosGrid').innerHTML = '<p style="color:red;">Erro ao carregar veículos do MySQL.</p>';
  }
}

function renderizarVeiculos(veiculos) {
  const grid = $('veiculosGrid');
  grid.innerHTML = '';
  $('totalVeiculos').textContent = `${veiculos.length} veículos`;

  if (veiculos.length === 0) {
    grid.innerHTML = '<p>Nenhum veículo cadastrado.</p>';
    return;
  }

  veiculos.forEach((v) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div>
        <div class="product-title">${esc(v.marca)} ${esc(v.modelo)}</div>
        <div class="product-meta">Placa ${esc(v.placa)} • ${esc(v.ano)}</div>
        <div class="product-price">${moeda(v.valor_diaria)} / dia</div>
        <span class="tag-veiculo ${esc(v.status)}">${esc(v.status)}</span>
      </div>
      <div class="product-actions">
        <button class="btn-edit" onclick="editarVeiculo(${Number(v.id)})"><i class="fa-solid fa-pen"></i> Editar</button>
        <button class="btn-delete" onclick="deletarVeiculo(${Number(v.id)})"><i class="fa-solid fa-trash"></i> Excluir</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

$('formVeiculo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('veiculoId').value;
  const dados = {
    placa: $('placa').value.trim().toUpperCase(),
    marca: $('marca').value.trim(),
    modelo: $('modelo').value.trim(),
    ano: parseInt($('ano').value, 10),
    valor_diaria: parseFloat($('valorDiaria').value)
  };
  try {
    if (id) await api(`/veiculos/${id}`, 'PUT', dados);
    else await api('/veiculos', 'POST', dados);
    cancelarEdicaoVeiculo();
    await carregarTudo();
  } catch (error) {
    alert(error.message);
  }
});

function editarVeiculo(id) {
  const v = veiculosCache.find((x) => x.id === id);
  if (!v) return;
  $('veiculoId').value = v.id;
  $('placa').value = v.placa;
  $('marca').value = v.marca;
  $('modelo').value = v.modelo;
  $('ano').value = v.ano;
  $('valorDiaria').value = v.valor_diaria;
  $('tituloFormVeiculo').textContent = `Editando veículo #${v.id}`;
  $('btnCancelarVeiculo').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicaoVeiculo() {
  $('formVeiculo').reset();
  $('veiculoId').value = '';
  $('tituloFormVeiculo').textContent = 'Cadastrar Novo Veículo (MySQL)';
  $('btnCancelarVeiculo').classList.add('hidden');
}
$('btnCancelarVeiculo').addEventListener('click', cancelarEdicaoVeiculo);

async function deletarVeiculo(id) {
  if (!confirm('Deseja realmente excluir este veículo?')) return;
  try {
    await api(`/veiculos/${id}`, 'DELETE');
    await carregarTudo();
  } catch (error) {
    alert(error.message);
  }
}

// Filtro de busca local
function filtrarVeiculos() {
  const termo = $('searchInput').value.toLowerCase();
  const filtrados = veiculosCache.filter((v) =>
    `${v.placa} ${v.marca} ${v.modelo}`.toLowerCase().includes(termo));
  renderizarVeiculos(filtrados);
}
$('searchInput').addEventListener('input', filtrarVeiculos);
$('btnSearch').addEventListener('click', filtrarVeiculos);

// ---------- CLIENTES ----------
async function carregarClientes() {
  try {
    clientesCache = await api('/clientes');
    renderizarClientes();
  } catch (error) {
    console.error(error);
    $('tabelaClientes').innerHTML = '<tr><td colspan="5" style="color:red;">Erro ao carregar clientes.</td></tr>';
  }
}

function renderizarClientes() {
  const tbody = $('tabelaClientes');
  tbody.innerHTML = '';
  $('totalClientes').textContent = `${clientesCache.length} clientes`;

  if (clientesCache.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum cliente cadastrado.</td></tr>';
    return;
  }

  clientesCache.forEach((c) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${Number(c.id)}</td>
      <td>${esc(c.nome)}</td>
      <td>${esc(c.cpf)}</td>
      <td>${esc(c.telefone || '-')}</td>
      <td class="cell-actions">
        <button class="btn-edit" onclick="editarCliente(${Number(c.id)})"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-delete" onclick="deletarCliente(${Number(c.id)})"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

$('formCliente').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('clienteId').value;
  const dados = {
    nome: $('nomeCliente').value.trim(),
    cpf: $('cpf').value.trim(),
    telefone: $('telefone').value.trim()
  };
  try {
    if (id) await api(`/clientes/${id}`, 'PUT', dados);
    else await api('/clientes', 'POST', dados);
    cancelarEdicaoCliente();
    await carregarTudo();
  } catch (error) {
    alert(error.message);
  }
});

function editarCliente(id) {
  const c = clientesCache.find((x) => x.id === id);
  if (!c) return;
  $('clienteId').value = c.id;
  $('nomeCliente').value = c.nome;
  $('cpf').value = c.cpf;
  $('telefone').value = c.telefone || '';
  $('tituloFormCliente').textContent = `Editando cliente #${c.id}`;
  $('btnCancelarCliente').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicaoCliente() {
  $('formCliente').reset();
  $('clienteId').value = '';
  $('tituloFormCliente').textContent = 'Cadastrar Novo Cliente (MySQL)';
  $('btnCancelarCliente').classList.add('hidden');
}
$('btnCancelarCliente').addEventListener('click', cancelarEdicaoCliente);

async function deletarCliente(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) return;
  try {
    await api(`/clientes/${id}`, 'DELETE');
    await carregarTudo();
  } catch (error) {
    alert(error.message);
  }
}

// ---------- LOCAÇÕES ----------
function preencherSelects() {
  const disponiveis = veiculosCache.filter((v) => v.status === 'disponivel');
  $('selectVeiculo').innerHTML = disponiveis.length
    ? disponiveis.map((v) =>
        `<option value="${Number(v.id)}">${esc(v.marca)} ${esc(v.modelo)} - ${esc(v.placa)} (${moeda(v.valor_diaria)}/dia)</option>`).join('')
    : '<option value="">Nenhum veículo disponível</option>';

  $('selectCliente').innerHTML = clientesCache.length
    ? clientesCache.map((c) => `<option value="${Number(c.id)}">${esc(c.nome)} - ${esc(c.cpf)}</option>`).join('')
    : '<option value="">Cadastre um cliente primeiro</option>';
}

async function carregarLocacoes() {
  const tbody = $('tabelaLocacoes');
  try {
    const locacoes = await api('/locacoes');
    tbody.innerHTML = '';
    $('totalLocacoes').textContent = `${locacoes.length} locações`;

    if (locacoes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Nenhuma locação registrada.</td></tr>';
      return;
    }

    locacoes.forEach((l) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${Number(l.id)}</td>
        <td>${esc(l.modelo)} (${esc(l.placa)})</td>
        <td>${esc(l.cliente)}</td>
        <td>${esc(l.data_retirada)}</td>
        <td>${esc(l.data_prevista)}</td>
        <td>${esc(l.data_devolucao || '-')}</td>
        <td>${l.valor_total != null ? moeda(l.valor_total) : '-'}</td>
        <td><span class="tag-veiculo ${l.status === 'ativa' ? 'alugado' : 'disponivel'}">${esc(l.status)}</span></td>
        <td>${l.status === 'ativa'
          ? `<button class="btn-return" onclick="devolverLocacao(${Number(l.id)})"><i class="fa-solid fa-rotate-left"></i> Devolver</button>`
          : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="9" style="color:red;">Erro ao carregar locações.</td></tr>';
  }
}

$('formLocacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = {
    veiculo_id: Number($('selectVeiculo').value),
    cliente_id: Number($('selectCliente').value),
    data_prevista: $('dataPrevista').value
  };
  try {
    const nova = await api('/locacoes', 'POST', dados);
    alert(`Locação criada! Valor estimado: ${moeda(nova.valor_estimado)}`);
    $('formLocacao').reset();
    await carregarTudo();
  } catch (error) {
    alert(error.message);
  }
});

async function devolverLocacao(id) {
  if (!confirm('Confirmar a devolução deste veículo?')) return;
  try {
    const resumo = await api(`/locacoes/${id}/devolver`, 'PUT');
    alert(`Veículo devolvido! ${resumo.dias} diária(s) — total: ${moeda(resumo.valor_total)}`);
    await carregarTudo();
  } catch (error) {
    alert(error.message);
  }
}
