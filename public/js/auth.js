/**
 * Gerencia a autenticação de administrador e sessões de chat
 */

// Verifica se o admin está logado
function isAdminLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === 'true';
}

// Obtém o ID da sessão atual ou cria uma nova
async function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    try {
      const response = await fetch('/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Erro ao criar sessão:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      sessionId = data.sessionId;
      localStorage.setItem('sessionId', sessionId);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      return null;
    }
  }
  
  return sessionId;
}

// Realiza o login do admin
async function adminLogin(password) {
  if (!password || password.trim() === '') {
    showError('Por favor, informe a senha de administrador');
    return false;
  }

  try {
    const response = await fetch('/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.trim() })
    });

    const data = await response.json();
    
    if (!response.ok) {
      showError(data.error || 'Erro ao fazer login');
      return false;
    }

    localStorage.setItem('adminLoggedIn', 'true');
    return true;
  } catch (error) {
    console.error('Erro de login:', error);
    showError('Ocorreu um erro ao tentar fazer login');
    return false;
  }
}

// Realiza o logout do admin
function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  window.location.href = '/admin.html';
}

// Redireciona para a página de admin se não for admin
function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = '/admin.html';
    return false;
  }
  return true;
}

// Redireciona para a página de configurações se já estiver logado como admin
function redirectIfAdmin() {
  if (isAdminLoggedIn()) {
    window.location.href = '/settings.html';
  }
}

// Mostra uma mensagem de erro
function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  } else {
    alert(message);
  }
} 