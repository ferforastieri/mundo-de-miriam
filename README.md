# Mundo de Miriam - Portfólio Profissional

Portfólio profissional de Miriam Cléres Forastieri, com duas pastas na raiz:

- **`/web`** — frontend Vue 3 (SPA, i18n, galerias e painel administrativo).
- **`/api`** — backend Fastify rodando em Cloudflare Workers, com D1 (banco), R2 (imagens)
  e cron (atualização do Instagram).

O deploy é feito **exclusivamente pelo GitHub**, via Cloudflare Workers Builds
(veja a seção *Deploy* abaixo). Não existe script de deploy manual no repositório.

## 🧱 Arquitetura do backend (`/api`)

```
api/
├── migrations/              # Schema do D1 (controlado por migrations)
├── src/
│   ├── controllers/         # Rotas HTTP (Fastify)
│   ├── usecases/            # Regras de negócio
│   ├── repositories/        # Acesso ao D1 e ao R2
│   ├── mappers/             # Conversão banco → API
│   ├── services/            # Instagram, criptografia, senha, imagens
│   ├── http/                # Erros, autenticação e CSRF
│   ├── utils/
│   ├── app.js               # Montagem do Fastify
│   ├── config.js
│   ├── context.js
│   ├── index.js             # Entry point (fetch + cron)
│   └── redirect.js          # Worker que redireciona o domínio raiz para www
├── wrangler.jsonc           # Config do Worker principal (D1, R2, assets, cron)
└── wrangler.redirect.jsonc  # Config do Worker de redirecionamento
```

Fluxo: `controller → usecase → repository → D1/R2`, com `mappers` na volta.
As fotos ficam no **R2** e são servidas pelo Worker em `/media/...`.

## 🖥️ Arquitetura do frontend (`/web`)

```
web/
├── public/                  # Ícones, manifest e a imagem de compartilhamento (OG)
├── scripts/                 # Geração das páginas estáticas de SEO (usado no build)
├── src/
│   ├── api/                 # Clientes HTTP (público e admin)
│   ├── components/          # Componentes (público + admin)
│   ├── composables/         # usePublicGallery, useAdminAuth, useAdminToast
│   ├── layouts/             # Layouts das páginas e do painel
│   ├── locales/             # Traduções (pt, en, es, fr, ja, zh)
│   ├── router/              # Rotas + guarda de autenticação do /admin
│   ├── style/               # Estilos do painel
│   ├── utils/
│   └── views/               # Páginas públicas e do painel
├── index.html
└── vite.config.js
```

> As fotos da galeria **não ficam mais no repositório**: elas vivem no R2 e são
> gerenciadas pelo painel. No repositório ficam apenas a imagem de compartilhamento
> (OG), ícones do PWA/favicons e o manifest.

## ✨ Recursos

- Galerias (Beauty, Artístico, E-commerce e Parcerias) gerenciáveis pelo painel.
- Upload em lote, reordenação por arrastar, capa por marca, ocultar/excluir/substituir.
- Fotos de perfil, currículo e símbolo Mimelie também gerenciáveis.
- **Instagram**: coleta horária via cron, histórico no D1, token criptografado
  (AES-256-GCM) e renovação automática. O site exibe sempre o último snapshot salvo,
  mesmo quando a API do Instagram falha.
- Estatísticas ampliadas: alcance, visitas ao perfil, contas engajadas, salvamentos,
  compartilhamentos, novos seguidores, desempenho por publicação e demografia.
- **Publicação pelo painel**: post simples ou carrossel (até 10 fotos) direto no
  Instagram, com histórico e limite de 25 publicações por dia.
- SEO: páginas estáticas por rota + sitemap gerados no build.
- Segurança: cookie `__Host-mdm_session` (httpOnly + Secure + SameSite=Strict),
  PBKDF2-SHA256, rate limit de login, validação de origem (CSRF), CSP sem `unsafe-eval`,
  uploads validados por magic bytes.

## 🛠️ Desenvolvimento local

Pré-requisitos: Node.js 22+.

```bash
npm install                 # instala as duas pastas (workspaces)

# Segredos locais da API (criptografia do token do Instagram)
cp api/.dev.vars.example api/.dev.vars
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# cole o valor em TOKEN_ENCRYPTION_KEY dentro de api/.dev.vars

# Banco local (D1 em api/.wrangler) + build do frontend
npm run db:migrate:local
npm run build

# Rode a API e o frontend (terminais separados)
npm run dev:api             # http://127.0.0.1:8787
npm run dev:web             # http://localhost:5173 (proxy /api e /media)
```

O painel fica em `http://localhost:5173/admin`. O banco local é separado do de
produção; os dados reais (fotos e usuário) vivem no Cloudflare.

## 🚀 Deploy (GitHub → Cloudflare Workers Builds)

O deploy é automático: **todo push na `main` é buildado e publicado pela Cloudflare**.
Não existe `npm run deploy` nem qualquer deploy manual no repositório.

Configuração (uma única vez, no painel da Cloudflare):

1. **Workers & Pages → `mundo-de-miriam` → Settings → Builds**.
2. Conecte o repositório do GitHub e selecione a branch `main`.
3. Preencha:

| Campo | Valor |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler d1 migrations apply mundo-de-miriam --remote --config api/wrangler.jsonc && npx wrangler deploy --config api/wrangler.jsonc` |

O primeiro comando aplica as migrations do D1 (é idempotente) e os outros dois publicam
o Worker principal e o de redirecionamento do domínio.

> **Importante:** cada Build publica **apenas o Worker ao qual está conectado** — o
> Workers Builds força o nome do Worker do build (`WRANGLER_CI_OVERRIDE_NAME`), então
> **não** inclua o deploy do redirect no mesmo comando (isso sobrescreveria o site).
>
> O Worker de redirecionamento (`mundo-de-miriam-redirect`, raiz → www) precisa de um
> **Build próprio**: crie um Worker com esse nome, conecte o mesmo repositório/branch e use
> `npx wrangler deploy --config api/wrangler.redirect.jsonc` como deploy command.

### Token do Instagram

1. Abra `/admin/instagram` e faça login.
2. Cole o token de longa duração da API do Instagram (Instagram Login, permissões
   `instagram_business_basic`, `instagram_business_manage_insights`,
   `instagram_business_content_publish`, `instagram_business_manage_comments` e
   `instagram_business_manage_messages`) e salve.
3. O Worker valida, faz a primeira coleta, guarda o histórico no D1 e renova o token
   automaticamente nos últimos dias de validade (cron horário).

### Domínio próprio

1. No painel da Cloudflare, adicione a zona `mundodemiriam.com.br` (plano Free) e troque
   os nameservers no Registro.br.
2. Com a zona ativa, aponte os domínios personalizados:

```jsonc
// api/wrangler.jsonc (site + API)
"routes": [{ "pattern": "www.mundodemiriam.com.br", "custom_domain": true }]
```

```jsonc
// api/wrangler.redirect.jsonc (raiz → www)
"routes": [{ "pattern": "mundodemiriam.com.br", "custom_domain": true }]
```

3. Commit na `main`: o Workers Builds publica os dois Workers com os domínios.

## 📦 Scripts da raiz

| Comando | Descrição |
| --- | --- |
| `npm run dev:web` | Frontend em desenvolvimento (proxy para a API) |
| `npm run dev:api` | API + assets em desenvolvimento (`wrangler dev`) |
| `npm run build` | Build do frontend + páginas de SEO |
| `npm run db:migrate` | Aplica as migrations no D1 remoto |
| `npm run db:migrate:local` | Aplica as migrations no D1 local |

## 📝 Licença

Este projeto é privado e pertence a Miriam Cléres Forastieri.

---

Desenvolvido com ❤️, Vue.js, Fastify e Cloudflare.
