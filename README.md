# Portfólio Miriam Cleres Forastieri

Um portfólio profissional elegante e moderno desenvolvido com Vue.js, apresentando trabalhos de modelo e criação de conteúdo UGC (User Generated Content).

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript progressivo
- **Vue Router** - Roteamento oficial do Vue.js
- **Firebase** - Autenticação e gerenciamento de dados
- **Google Fonts (Gilda Display)** - Tipografia elegante
- **CSS Moderno** - Animações, Flexbox e Grid
- **Vite** - Build tool e servidor de desenvolvimento

## ✨ Características

- Design minimalista em preto e branco
- Animações suaves e transições elegantes
- Sistema de autenticação seguro
- Área administrativa protegida
- Layout totalmente responsivo
- Interface intuitiva e moderna
- Integração com Firebase
- Otimizado para performance

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta no Firebase (para autenticação)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositório]
```

2. Entre no diretório do projeto:
```bash
cd portfolio-miriam
```

3. Instale as dependências:
```bash
npm install
# ou
yarn install
```

4. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e adicione suas configurações do Firebase:
```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## 🚀 Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

Para produção:
```bash
npm run build
npm run preview
# ou
yarn build
yarn preview
```

## 📱 Estrutura do Projeto

```
portfolio-miriam/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── auth/
│   │       └── AuthService.vue
│   ├── components/
│   │   └── LoginForm.vue
│   ├── views/
│   │   └── Home.vue
│   ├── main.js
│   └── style.css
└── index.html
```

## 🔒 Autenticação

O projeto utiliza Firebase Authentication para gerenciar o acesso à área administrativa. O sistema inclui:

- Login seguro com email/senha
- Proteção de rotas administrativas
- Gerenciamento de estado de autenticação
- Feedback visual para o usuário

## 💅 Personalização

O projeto utiliza a fonte Gilda Display do Google Fonts e um esquema de cores minimalista em preto e branco. Para modificar o estilo:

1. Edite `src/style.css` para alterações globais
2. Modifique os componentes individuais para alterações específicas
3. Ajuste as variáveis de cores e fontes conforme necessário

---

Desenvolvido com ❤️ e Vue.js
