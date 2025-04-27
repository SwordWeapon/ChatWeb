# ChatWeb - Aplicação de Chat com OpenAI

Uma aplicação web simples para conversar com um assistente da OpenAI (GPT-3.5 Turbo), com funcionalidades de configuração global e histórico de conversas por sessão.

## Funcionalidades

- 💬 Interface de chat acessível sem autenticação
- 🔐 Área de administração para configurações protegida por senha
- ⚙️ Configuração global do prompt de sistema
- 📋 Histórico de conversas salvo por sessão
- 📱 Design responsivo para desktop e dispositivos móveis

## Requisitos

- Node.js (versão 14 ou superior)
- Chave de API da OpenAI

## Instalação

1. Clone o repositório:
```
git clone https://github.com/seu-usuario/ChatWeb.git
cd ChatWeb
```

2. Instale as dependências:
```
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com sua chave da API OpenAI e senha de administrador:
```
OPENAI_API_KEY=sua_chave_da_api_aqui
ADMIN_PASSWORD=senha_forte_para_admin
```

## Uso

1. Inicie o servidor:
```
npm start
```

2. Acesse a aplicação no navegador em:
```
http://localhost:3000
```

3. Para acessar a área de administração, vá para:
```
http://localhost:3000/admin.html
```

## Estrutura do Projeto

- `public/` - Arquivos estáticos da interface web
  - `css/` - Estilos da aplicação
  - `js/` - Scripts JavaScript do cliente
  - `*.html` - Páginas HTML
- `src/` - Código do servidor
  - `routes/` - Rotas da API
  - `utils/` - Utilitários e funções de suporte
  - `server.js` - Configuração do servidor Express
- `data/` - Armazena arquivos JSON de sessões e configurações (criado automaticamente)
- `index.js` - Ponto de entrada da aplicação

## Estrutura de Rotas

- `/admin-login` - Login do administrador
- `/create-session` - Criação de nova sessão de chat
- `/chat` - Envio de mensagens para o assistente
- `/chat-history` - Obtenção de histórico de mensagens
- `/global-settings` - Obtenção de configurações globais
- `/save-global-settings` - Salvamento de configurações globais

## Desenvolvimento

Para desenvolvimento com reinício automático do servidor ao alterar arquivos:

```
npm run dev
```

## Licença

Este projeto está licenciado sob a licença MIT. 