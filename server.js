require('dotenv').config();
const express = require('express');
const path = require('path'); // Para lidar com caminhos de arquivos
const conectarMongo = require('./config/mongo');
const veiculoRoutes = require('./routes/veiculoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const locacaoRoutes = require('./routes/locacaoRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json());

// Conecta ao MongoDB (logs de auditoria)
conectarMongo();

// Servir arquivos estáticos do Frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/veiculos', veiculoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/locacoes', locacaoRoutes);
app.use('/logs', logRoutes);

app.listen(PORTA, () => {
  console.log(`Servidor rodando com sucesso no endereço: http://localhost:${PORTA}`);
});
