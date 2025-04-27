const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Diretório de dados
const DATA_DIR = path.join(__dirname, '../../data');

// Cria diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Arquivo de configurações globais
const GLOBAL_CONFIG_FILE = path.join(DATA_DIR, 'global_config.json');

// Inicializa configurações globais se não existir
if (!fs.existsSync(GLOBAL_CONFIG_FILE)) {
  const defaultConfig = {
    systemPrompt: 'Você é um assistente útil e objetivo.'
  };
  fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
}

/**
 * Gera um ID de sessão aleatório
 * @returns {string} ID da sessão
 */
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Retorna o caminho do arquivo de histórico de chat da sessão
 * @param {string} sessionId - ID da sessão
 * @returns {string} Caminho do arquivo
 */
function getSessionChatFilePath(sessionId) {
  return path.join(DATA_DIR, `session_${sessionId}.json`);
}

/**
 * Retorna o caminho do arquivo de configurações do admin
 * @returns {string} Caminho do arquivo
 */
function getAdminFilePath() {
  return path.join(DATA_DIR, 'admin.json');
}

/**
 * Verifica credenciais do admin
 * @param {string} password - Senha fornecida
 * @returns {boolean} Se as credenciais são válidas
 */
function verifyAdminCredentials(password) {
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('Aviso: ADMIN_PASSWORD não definida no .env, usando senha padrão "admin"');
    return password === 'admin';
  }
  return password === process.env.ADMIN_PASSWORD;
}

/**
 * Obtém ou cria histórico de chat da sessão
 * @param {string} sessionId - ID da sessão
 * @returns {Object} Histórico de chat
 */
function getOrCreateSessionChat(sessionId) {
  const filePath = getSessionChatFilePath(sessionId);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return { 
    sessionId,
    createdAt: new Date().toISOString(),
    messages: [] 
  };
}

/**
 * Obtém as configurações globais
 * @returns {Object} Configurações globais
 */
function getGlobalConfig() {
  if (fs.existsSync(GLOBAL_CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_FILE, 'utf8'));
  }
  const defaultConfig = {
    systemPrompt: 'Você é um assistente útil e objetivo.'
  };
  fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}

/**
 * Salva configurações globais
 * @param {Object} config - Configurações a serem salvas
 */
function saveGlobalConfig(config) {
  fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Salva histórico de chat da sessão
 * @param {string} sessionId - ID da sessão
 * @param {Object} history - Histórico a ser salvo
 */
function saveSessionChat(sessionId, history) {
  const filePath = getSessionChatFilePath(sessionId);
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
}

module.exports = {
  generateSessionId,
  getSessionChatFilePath,
  getGlobalConfig,
  saveGlobalConfig,
  getOrCreateSessionChat,
  saveSessionChat,
  verifyAdminCredentials
}; 