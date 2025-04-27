const express = require('express');
const router = express.Router();
const { getGlobalConfig, getOrCreateSessionChat, saveSessionChat } = require('../utils/dataAccess');
const { openai } = require('../utils/openai');

// Rota para obter histórico de chat da sessão
router.get('/chat-history', (req, res) => {
  const { sessionId } = req.query;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'ID da sessão é obrigatório' });
  }
  
  try {
    // Busca histórico da sessão
    const sessionChat = getOrCreateSessionChat(sessionId);
    res.json(sessionChat);
  } catch (err) {
    console.error('Erro ao obter histórico:', err);
    res.status(500).json({ error: 'Erro ao obter histórico de chat' });
  }
});

// Rota de chat
router.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  // Valida entrada
  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Mensagem e ID da sessão são obrigatórios' });
  }
  
  try {
    // Busca configurações globais
    const globalConfig = getGlobalConfig();
    const systemPrompt = globalConfig.systemPrompt || 'Você é um assistente útil e objetivo.';
    
    // Busca histórico de chat da sessão
    const sessionChat = getOrCreateSessionChat(sessionId);
    
    // Adiciona mensagem do usuário ao histórico
    sessionChat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Faz chamada para a API da OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...sessionChat.messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]
    });

    const reply = completion.choices[0].message.content;
    
    // Adiciona resposta ao histórico
    sessionChat.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString()
    });
    
    // Salva histórico
    saveSessionChat(sessionId, sessionChat);
    
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao se comunicar com a OpenAI.' });
  }
});

module.exports = router; 