const express = require('express');
const router = express.Router();
const { verifyAdminCredentials, generateSessionId } = require('../utils/dataAccess');

// Rota de login para admin
router.post('/admin-login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Senha é obrigatória' });
  }
  
  // Verifica credenciais
  if (!verifyAdminCredentials(password)) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  
  // Retorna sucesso
  res.json({ success: true });
});

// Rota para iniciar uma nova sessão
router.post('/create-session', (req, res) => {
  // Gera um novo ID de sessão
  const sessionId = generateSessionId();
  
  // Retorna o ID gerado
  res.json({ sessionId });
});

module.exports = router; 