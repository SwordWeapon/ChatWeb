const OpenAI = require('openai');
require('dotenv').config();

// Verifica se a chave da API está definida
if (!process.env.OPENAI_API_KEY) {
  console.error('Erro: API_KEY da OpenAI não definida no arquivo .env');
  process.exit(1);
}

// Inicializa a API da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = { openai }; 