/**
 * Ponto de entrada da aplicação ChatWeb
 * Inicializa o servidor com configurações default
 */

// Carrega variáveis de ambiente
require('dotenv').config();

// Importa o servidor
const { startServer } = require('./src/server');

// Inicia o servidor
const PORT = process.env.PORT || 3000;
startServer(PORT); 