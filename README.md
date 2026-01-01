# Mundo de Miriam - Portfólio Profissional

Um portfólio profissional elegante e moderno desenvolvido com Vue.js, apresentando trabalhos de maquiagem artística, beauty, fotografia e-commerce e parcerias.

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript progressivo
- **Vue Router** - Roteamento oficial do Vue.js
- **Vue I18n** - Sistema de internacionalização (i18n)
- **HTML2PDF.js** - Geração de PDF do currículo
- **HTML2Canvas** - Captura de tela para PDF
- **Google Fonts (Gilda Display)** - Tipografia elegante
- **CSS Moderno** - Animações, Flexbox e Grid
- **Vite** - Build tool e servidor de desenvolvimento

## ✨ Características

- Design minimalista e elegante
- Animações suaves e transições elegantes
- Sistema de internacionalização completo
- Suporte para 6 idiomas: Português, Inglês, Espanhol, Francês, Japonês e Chinês
- Layout totalmente responsivo
- Interface intuitiva e moderna
- Geração de PDF do currículo profissional
- Galerias de portfólio organizadas por categoria
- Otimizado para performance

## 🌍 Idiomas Suportados

- 🇧🇷 Português (pt)
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)
- 🇫🇷 Francês (fr)
- 🇯🇵 Japonês (ja)
- 🇨🇳 Chinês (zh)

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ferforastieri/mundo-de-miriam.git
```

2. Entre no diretório do projeto:
```bash
cd mundo-de-miriam
```

3. Instale as dependências:
```bash
npm install
# ou
yarn install
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
mundo-de-miriam/
├── public/
│   ├── assets/
│   │   ├── artisticstyle/    # Imagens do portfólio artístico
│   │   ├── beautystyle/      # Imagens do portfólio beauty
│   │   ├── e-commerce/       # Imagens de fotografia e-commerce
│   │   ├── partnership/      # Imagens de parcerias
│   │   └── profile/          # Imagens de perfil
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── dashboard/        # Serviços de dashboard
│   │   ├── storage/          # Serviços de armazenamento
│   │   └── translation/     # Serviços de tradução
│   ├── components/
│   │   ├── about/           # Componentes da página sobre
│   │   ├── common/          # Componentes comuns (TranslatableText, LanguageSwitcher, etc)
│   │   ├── curriculum/     # Componentes do currículo
│   │   ├── home/           # Componentes da home
│   │   └── portfolio/      # Componentes dos portfólios
│   ├── layouts/            # Layouts das páginas
│   ├── locales/             # Arquivos de tradução (pt, en, es, fr, ja, zh)
│   ├── router/             # Configuração de rotas
│   ├── views/              # Views principais
│   ├── App.vue
│   ├── i18n.js             # Configuração do i18n
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 📄 Páginas do Site

- **Home** - Página inicial com apresentação e navegação
- **Sobre Mim** - História e paixão pela arte da maquiagem
- **Currículo** - Experiência profissional completa com download em PDF
- **Portfólio Artístico** - Galeria de trabalhos de maquiagem artística
- **Portfólio Beauty** - Galeria de trabalhos de maquiagem beauty
- **Fotografia E-commerce** - Galeria de fotografias para produtos
- **Parcerias** - Trabalhos em parceria com marcas

## 🎨 Personalização

O projeto utiliza a fonte Gilda Display do Google Fonts e um esquema de cores minimalista. Para modificar o estilo:

1. Edite `src/style.css` para alterações globais
2. Modifique os componentes individuais para alterações específicas
3. Ajuste as variáveis de cores e fontes conforme necessário

## 🌐 Internacionalização

O projeto utiliza `vue-i18n` para gerenciar traduções. Os arquivos de tradução estão localizados em `src/locales/`:

- `pt.json` - Português
- `en.json` - Inglês
- `es.json` - Espanhol
- `fr.json` - Francês
- `ja.json` - Japonês
- `zh.json` - Chinês

Para adicionar novas traduções, edite os arquivos JSON correspondentes e use o componente `TranslatableText` ou a função `t()` do `useI18n()`.

## 📦 Deploy

O projeto está configurado para deploy na Vercel. O arquivo `vercel.json` contém as configurações necessárias.

## 📝 Licença

Este projeto é privado e pertence a Miriam Cleres Forastieri.

---

Desenvolvido com ❤️ e Vue.js
