const express = require('express');
const router = express.Router();
const { getGlobalConfig, saveGlobalConfig, verifyAdminCredentials } = require('../utils/dataAccess');

// Rota para obter configurações globais
router.get('/global-settings', (req, res) => {
  // Busca configurações globais
  const globalConfig = getGlobalConfig();
  
  res.json(globalConfig);
});

// Rota para salvar configurações globais (apenas admin)
router.post('/save-global-settings', (req, res) => {
  const { password, systemPrompt } = req.body;
  
  // Verifica se é o admin
  if (!password || !verifyAdminCredentials(password)) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }
  
  // Busca configurações atuais
  const globalConfig = getGlobalConfig();
  
  // Atualiza configurações
  globalConfig.systemPrompt = systemPrompt || '';
  
  // Salva configurações
  saveGlobalConfig(globalConfig);
  
  res.json({ success: true });
});

module.exports = router; 