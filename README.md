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
│   └── index.js             # Entry point (fetch + cron + redirect raiz → www)
├── wrangler.jsonc           # Config do Worker principal (D1, R2, assets, cron, rotas)
```

Fluxo: `controller → usecase → repository → D1/R2`, com `mappers` na volta.
As fotos ficam no **R2** e são servidas pelo Worker em `/media/...`.

## 🖥️ Arquitetura do frontend (`/web`)

```
web/
├── public/                  # Ícones, manifest, sitemap e imagem de compartilhamento (OG)
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
- **Álbuns de branding**: crie um álbum com link próprio para compartilhar com clientes,
  envie fotos, escolha a ordem e defina validade (temporário ou para sempre). A página é
  não indexada e fica fora das galerias do site.
- SEO: tags por rota injetadas na borda (Cloudflare `HTMLRewriter`) + sitemap estático,
  sem script de build.
- Segurança: cookie `__Host-mdm_session` (httpOnly + Secure + SameSite=Strict),
  PBKDF2-SHA256, rate limit de login, validação de origem (CSRF), CSP sem `unsafe-eval`,
  uploads validados por magic bytes.

## 🔎 Como o SEO funciona (sem script)

O site é um SPA Vue, mas cada rota entrega HTML já com as tags corretas:
o Worker intercepta as páginas (`run_worker_first` no `api/wrangler.jsonc`) e usa
`HTMLRewriter` para injetar `<title>`, description, canonical, Open Graph/Twitter e um
conteúdo de fallback (`#seo-fallback`) para crawlers que não executam JavaScript.
Nada disso roda no build — os dados ficam em `api/src/seo/pages.js` e o frontend
mantém a mesma lista em `web/src/seo.js` para a navegação interna.

O `sitemap.xml` é estático (`web/public/sitemap.xml`) e o `robots.txt` bloqueia `/admin`.
O preview em `workers.dev` envia `x-robots-tag: noindex` e canonicaliza para o domínio oficial.

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

O primeiro comando aplica as migrations do D1 (é idempotente) e o segundo publica o
Worker principal (`mundo-de-miriam`), que atende o site, a API e as duas rotas do domínio
(`www` e raiz). A raiz responde com um redirecionamento permanente (`308`) para o `www`
dentro do próprio Worker, sem um segundo Worker.

### Álbuns de branding

Em `/admin/branding` é possível criar álbuns com link próprio (`/album/<token>`):

- validade opcional (7/30/60/90/180/365 dias) ou **para sempre**; expirado mostra uma
  mensagem amigável;
- upload em lote, reordenação por arrastar e remoção de fotos;
- link copiável para enviar ao cliente, que vê apenas as fotos daquele álbum (sem o menu
  do site e com `noindex`).

### Token do Instagram

1. Abra `/admin/instagram` e faça login.
2. Cole o token de longa duração da API do Instagram (Instagram Login, permissões
   `instagram_business_basic`, `instagram_business_manage_insights`,
   `instagram_business_content_publish`, `instagram_business_manage_comments` e
   `instagram_business_manage_messages`) e salve.
3. O Worker valida, faz a primeira coleta, guarda o histórico no D1 e renova o token
   automaticamente nos últimos dias de validade (cron horário).

### Domínio próprio

Estado atual (2026-10-18): a zona `mundodemiriam.com.br` está **ativa** na Cloudflare
(nameservers `anderson`/`ashley` no Registro.br) e os domínios já respondem:

- `https://www.mundodemiriam.com.br` → Worker `mundo-de-miriam` (site + API);
- `https://mundodemiriam.com.br/*` → mesmo Worker `mundo-de-miriam`, que redireciona a raiz para o `www` (`308`).

O apontamento é feito por **rotas de zona** (`zone_name`), e não por domínios
personalizados, porque a zona ainda contém os registros importados do Vercel (`www` CNAME
e a raiz A, ambos proxied). As rotas de zona interceptam esse tráfego e não precisam
trocar os registros:

```jsonc
// api/wrangler.jsonc (site + API + redirect da raiz) — publicado pelo Workers Builds
"routes": [
  { "pattern": "mundodemiriam.com.br/*", "zone_name": "mundodemiriam.com.br" },
  { "pattern": "www.mundodemiriam.com.br/*", "zone_name": "mundodemiriam.com.br" }
]
```

Para migrar futuramente para domínios personalizados (`custom_domain: true`), apague
antes os registros do Vercel na aba DNS da zona e então troque as rotas; nesse formato a
Cloudflare cria e gerencia os registros sozinha.

Observação: o Web Analytics (RUM) da Cloudflare injeta `beacon.min.js` nas páginas, mas a
CSP do site não permite esse script. Se quiser silenciar os erros no console, desative o
Web Analytics no painel (Speed → Web Analytics) ou libere `static.cloudflareinsights.com`
na CSP.

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
