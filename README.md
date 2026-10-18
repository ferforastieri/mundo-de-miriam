# Mundo de Miriam - Portfólio Profissional

Portfólio profissional de Miriam Cléres Forastieri, com frontend Vue 3 e backend próprio
(Fastify) rodando 100% na Cloudflare (Workers, D1 e R2).

## ✨ Visão geral

- **Frontend**: Vue 3 + Vue Router + Vue I18n + Vue Query (SPA servida pelo Worker).
- **Backend**: API em Fastify, com arquitetura simples de *controller → usecase → repositório*
  e *mappers* para converter as linhas do banco nos objetos da API.
- **Banco de dados**: Cloudflare D1 (SQLite) para fotos, telas, sessões e histórico do Instagram.
- **Imagens**: Cloudflare R2, servidas pelo Worker em `/media/...` com cache longo.
- **Painel administrativo**: `/admin` com login por e-mail/senha, upload, ordem, telas,
  histórico do Instagram e estatísticas.
- **Instagram**: coleta horária via cron, histórico persistido em D1 e exibição no site
  sempre a partir do último snapshot bem-sucedido (mesmo quando a API do Instagram falha).

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript progressivo
- **Vue Router** - Roteamento oficial do Vue.js
- **Vue I18n** - Sistema de internacionalização (i18n)
- **Vue Query** - Cache e estado de dados remotos
- **Fastify** - Framework HTTP do backend (rodando no runtime dos Workers)
- **Cloudflare Workers** - Hospedagem da API e do site
- **Cloudflare D1** - Banco de dados SQLite gerenciado
- **Cloudflare R2** - Armazenamento das fotos
- **HTML2PDF.js / HTML2Canvas** - Geração de PDF do currículo
- **Vite** - Build tool e servidor de desenvolvimento

## 🌍 Idiomas Suportados

- 🇧🇷 Português (pt)
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)
- 🇫🇷 Francês (fr)
- 🇯🇵 Japonês (ja)
- 🇨🇳 Chinês (zh)

## 📁 Estrutura do projeto

```
mundo-de-miriam/
├── migrations/                  # Migrations do D1 (schema + telas iniciais)
├── public/                      # Arquivos estáticos servidos junto do SPA
│   └── assets/                  # Fotos originais (fonte do seed e fallback estático)
├── scripts/
│   ├── generate-seo-pages.mjs   # Gera as páginas estáticas de SEO no build
│   ├── seed-admin.mjs           # Cria/atualiza o usuário admin no D1
│   └── seed-media.mjs           # Envia as fotos atuais para o R2 via API
├── src/
│   ├── api/                     # Clientes HTTP (público e admin)
│   ├── components/              # Componentes Vue (público e admin)
│   ├── composables/             # usePublicGallery, useAdminAuth, useAdminToast
│   ├── layouts/                 # Layouts das páginas e do painel
│   ├── locales/                 # Traduções
│   ├── router/                  # Rotas + guarda de autenticação do painel
│   ├── style/                   # Estilos globais do painel
│   ├── utils/                   # Formatação de números/datas
│   └── views/                   # Páginas públicas e do painel
├── worker/                      # Backend (Cloudflare Worker + Fastify)
│   ├── controllers/             # Rotas HTTP
│   ├── usecases/                # Regras de negócio
│   ├── repositories/            # Acesso ao D1 e ao R2
│   ├── mappers/                 # Conversão banco → API
│   ├── services/                # Instagram, criptografia, senhas, imagens
│   ├── http/                    # Erros e guardas (auth, CSRF, rate limit)
│   └── index.js                 # Entry point (fetch + cron)
├── wrangler.jsonc               # Configuração do Worker (D1, R2, assets, cron)
└── vite.config.js
```

## 🔐 Segurança do painel

- Login com senha em **PBKDF2-SHA256** (hash + salt por usuário, comparação em tempo constante).
- Sessão em cookie **httpOnly + Secure + SameSite=Strict** (`__Host-mdm_session` em produção),
  com token aleatório de 32 bytes e apenas o hash SHA-256 salvo no D1; expira em 30 dias.
- Validação de **origem (CSRF)** em todas as rotas do painel, além do `SameSite=Strict`.
- **Rate limit** de tentativas de login por IP (5 falhas a cada 15 minutos).
- **CSP** sem `unsafe-eval`, com headers de segurança (`nosniff`, `frame-ancestors: none`, etc.).
- Token do Instagram **criptografado (AES-256-GCM)** no banco, usando um segredo do Worker.
- Uploads validados por **magic bytes** (somente JPEG/PNG/WebP/GIF/AVIF, até 20 MB).

## 🛠️ Desenvolvimento local

Pré-requisitos: Node.js 22+.

```bash
npm install

# Gere uma chave local para criptografar o token do Instagram
cp .dev.vars.example .dev.vars
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# copie o valor para TOKEN_ENCRYPTION_KEY no .dev.vars

# Aplique as migrations no D1 local e crie o admin
npm run db:migrate:local
node scripts/seed-admin.mjs --email seu@email.com --password 'sua-senha-forte' --local

# Rode a API (Worker) e o frontend em terminais separados
npm run dev:api   # http://127.0.0.1:8787
npm run dev       # http://localhost:5173 (proxy para a API)
```

O painel fica em `http://localhost:5173/admin`.

## 🚢 Deploy (Cloudflare)

```bash
# Uma única vez: migrations e usuário admin no ambiente remoto
npm run db:migrate
ADMIN_EMAIL='seu@email.com' ADMIN_PASSWORD='sua-senha-forte' npm run db:seed:admin

# Segredo usado para criptografar o token do Instagram
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))" \
  | npx wrangler secret put TOKEN_ENCRYPTION_KEY

# Publica o site + API
npm run deploy
```

Depois do primeiro deploy, envie as fotos atuais para o R2 (uma única vez):

```bash
node scripts/seed-media.mjs --url https://SEU-WORKER.workers.dev \
  --email seu@email.com --password 'sua-senha-forte'
```

### Token do Instagram

1. Abra `https://SEU-DOMINIO/admin/instagram` e faça login.
2. Cole o token de longa duração da API do Instagram (Instagram Login) e salve.
3. O Worker valida o token, faz a primeira coleta, guarda o histórico no D1 e renova o token
   automaticamente nos últimos dias de validade (cron horário).

Se a API do Instagram falhar, o site continua exibindo o último snapshot salvo.

### Domínio próprio

1. No painel da Cloudflare, adicione a zona `mundodemiriam.com.br` (plano Free) e troque os
   nameservers no Registro.br.
2. Com a zona ativa, adicione os domínios personalizados `www.mundodemiriam.com.br` e
   `mundodemiriam.com.br` ao Worker (via `wrangler.jsonc` em `routes` ou pelo painel).

## 📦 Scripts úteis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Frontend em modo desenvolvimento (proxy para o Worker) |
| `npm run dev:api` | Worker (API + assets) em modo desenvolvimento |
| `npm run build` | Build do frontend + páginas de SEO |
| `npm run deploy` | Build e deploy para a Cloudflare |
| `npm run db:migrate` | Aplica as migrations no D1 remoto |
| `npm run db:migrate:local` | Aplica as migrations no D1 local |
| `npm run db:seed:admin` | Cria/atualiza o admin no D1 (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) |
| `npm run db:seed:media` | Envia as fotos de `public/assets` para o R2 via API do painel |

## 📝 Licença

Este projeto é privado e pertence a Miriam Cléres Forastieri.

---

Desenvolvido com ❤️, Vue.js, Fastify e Cloudflare.
