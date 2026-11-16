# LocaCar - Locadora de Veículos (Express + MySQL + MongoDB + Frontend)

## Estrutura
```
locadora/
├── .env  package.json  server.js  schema.sql
├── config/        database.js (MySQL)  mongo.js (MongoDB)
├── models/        logModel.js
├── controllers/   um arquivo por ação (listarVeiculos, criarLocacao, listarLogs...)
├── routes/        veiculoRoutes  clienteRoutes  locacaoRoutes  logRoutes
├── utils/         registrarLog.js  datas.js
└── frontend/      index.html  logs.html  css/styles.css  js/app.js  js/logs.js
```

## Como rodar
1. Rode o `schema.sql` no MySQL.
2. Ajuste o `.env` (usuário/senha do MySQL).
3. `npm install`
4. `node server.js`
5. Abra http://localhost:3000 (locadora) e http://localhost:3000/logs.html (auditoria).

## Rotas da API
| Método | Rota | O que faz |
|---|---|---|
| GET | /veiculos (?status=disponivel) | Lista veículos |
| GET | /veiculos/:id | Busca por id |
| POST | /veiculos | Cadastra veículo |
| PUT | /veiculos/:id | Atualiza veículo |
| DELETE | /veiculos/:id | Remove veículo |
| GET/POST | /clientes | Lista / cadastra |
| GET/PUT/DELETE | /clientes/:id | Busca / atualiza / remove |
| GET | /locacoes | Lista locações |
| GET | /locacoes/:id | Busca por id |
| POST | /locacoes | Aluga um veículo |
| PUT | /locacoes/:id/devolver | Devolve e calcula o valor |
| GET | /logs | Últimos 50 logs (MongoDB) |
