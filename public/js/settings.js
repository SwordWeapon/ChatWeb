/**
 * Gerencia as configurações globais do sistema
 */

// Elementos DOM
let systemPromptTextarea;
let saveButton;

// Inicializa a página de configurações
function initSettings() {
  // Verifica se é admin
  if (!requireAdmin()) return;
  
  // Inicializa elementos
  systemPromptTextarea = document.getElementById('system-prompt');
  saveButton = document.getElementById('save-settings');
  
  // Adiciona event listeners
  saveButton.addEventListener('click', saveSettings);
  
  // Carrega configurações
  loadSettings();
}

// Carrega configurações globais
async function loadSettings() {
  try {
    const response = await fetch('/global-settings');
    if (!response.ok) {
      showError('Erro ao carregar configurações');
      return;
    }
    
    const config = await response.json();
    
    // Preenche os campos
    systemPromptTextarea.value = config.systemPrompt || '';
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    showError('Erro ao carregar configurações do servidor');
  }
}

// Salva configurações globais
async function saveSettings() {
  const systemPrompt = systemPromptTextarea.value.trim();
  
  try {
    // Solicita senha do admin para confirmar
    const password = prompt('Digite a senha de administrador para confirmar:');
    if (!password) return;
    
    const response = await fetch('/save-global-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password,
        systemPrompt
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      showError(data.error || 'Erro ao salvar configurações');
      return;
    }
    
    showSuccess('Configurações salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showError('Erro ao salvar configurações');
  }
}

// Mostra mensagem de sucesso
function showSuccess(message) {
  const successElement = document.getElementById('success-message');
  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }
}

// Mostra mensagem de erro
function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initSettings); 