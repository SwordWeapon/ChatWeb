/**
 * Gerencia a interface de chat
 */

// Elementos DOM
let chatMessages;
let chatInput;
let sendButton;
let sessionId;

// Inicializa a interface de chat
async function initChat() {
  // Inicializa elementos
  chatMessages = document.getElementById('chat-messages');
  chatInput = document.getElementById('message-input');
  sendButton = document.getElementById('send-button');
  
  // Obtém ou cria ID de sessão
  sessionId = await getOrCreateSessionId();
  if (!sessionId) {
    showError('Erro ao inicializar sessão de chat');
    return;
  }
  
  // Adiciona event listeners
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  sendButton.addEventListener('click', sendMessage);
  
  // Carrega mensagens anteriores
  loadChatHistory();
  
  // Habilita/desabilita link de configurações com base no login de admin
  const settingsLink = document.getElementById('settings-link');
  if (settingsLink) {
    if (isAdminLoggedIn()) {
      settingsLink.style.display = 'inline';
    } else {
      settingsLink.style.display = 'none';
    }
  }
}

// Carrega o histórico de chat
async function loadChatHistory() {
  chatMessages.innerHTML = '<div class="loading">Carregando mensagens...</div>';
  
  try {
    const response = await fetch(`/chat-history?sessionId=${encodeURIComponent(sessionId)}`);
    if (!response.ok) {
      chatMessages.innerHTML = '<div class="error-message">Erro ao carregar mensagens</div>';
      return;
    }
    
    const data = await response.json();
    displayChatMessages(data.messages);
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    chatMessages.innerHTML = '<div class="error-message">Erro ao carregar mensagens</div>';
  }
}

// Exibe mensagens no chat
function displayChatMessages(messages) {
  if (!messages || messages.length === 0) {
    chatMessages.innerHTML = '<div class="welcome-message">Bem-vindo! Envie uma mensagem para iniciar a conversa.</div>';
    return;
  }
  
  chatMessages.innerHTML = '';
  
  messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`;
    
    // Formata o conteúdo da mensagem (pode conter markdown)
    const content = msg.content.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
      <div class="message-content">${content}</div>
      <div class="message-timestamp">${new Date(msg.timestamp).toLocaleString()}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
  });
  
  // Rola para a mensagem mais recente
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Envia uma mensagem
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Limpa o input
  chatInput.value = '';
  
  // Adiciona a mensagem temporariamente
  const tempMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
  appendMessage(tempMessage);
  
  // Adiciona indicador de digitação
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message assistant-message typing';
  typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        sessionId: sessionId, 
        message: message
      })
    });
    
    // Remove indicador de digitação
    if (typingIndicator.parentNode) {
      chatMessages.removeChild(typingIndicator);
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      showError(errorData.error || 'Erro ao enviar mensagem');
      return;
    }
    
    const data = await response.json();
    
    // Adiciona a resposta
    const responseMessage = { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() };
    appendMessage(responseMessage);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    // Remove indicador de digitação
    if (typingIndicator.parentNode) {
      chatMessages.removeChild(typingIndicator);
    }
    showError('Erro ao se comunicar com o servidor');
  }
}

// Adiciona uma mensagem ao chat
function appendMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`;
  
  // Formata o conteúdo da mensagem (pode conter markdown)
  const content = message.content.replace(/\n/g, '<br>');
  
  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-timestamp">${new Date(message.timestamp).toLocaleString()}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  
  // Rola para a mensagem mais recente
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostra uma mensagem de erro
function showError(message) {
  console.error(message);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-toast';
  errorDiv.textContent = message;
  
  document.body.appendChild(errorDiv);
  
  // Remove após 3 segundos
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 3000);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initChat); 