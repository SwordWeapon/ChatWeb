const express = require('express');
const path = require('path');

// Importa as rotas
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const settingsRoutes = require('./routes/settings');

// Inicializa o aplicativo Express
const app = express();

// Configuração de middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Registra as rotas
app.use(authRoutes);
app.use(chatRoutes);
app.use(settingsRoutes);

/**
 * Inicializa o servidor
 * @param {number} port - Porta para iniciar o servidor
 */
function startServer(port = process.env.PORT || 3000) {
  return app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

// Exporta o app e a função para iniciar o servidor
module.exports = { app, startServer }; 