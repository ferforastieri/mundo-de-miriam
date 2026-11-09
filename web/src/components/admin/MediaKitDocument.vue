<template>
  <div ref="root" class="media-kit" aria-hidden="true">
    <!-- Página 1 — Parcerias -->
    <section class="mk-page mk-page--partners">
      <span class="mk-frame" aria-hidden="true"></span>
      <span class="mk-orb mk-orb--one"></span>
      <span class="mk-orb mk-orb--two"></span>

      <header class="mk-topbar">
        <div class="mk-brand">
          <span class="mk-brand__mark"><img src="/pwa-icon-maskable-192.png" alt="" /></span>
          <span>
            <strong>MUNDO DE MIRIAM</strong>
            <small>maquiagem &amp; fotografia</small>
          </span>
        </div>
        <span class="mk-page-number">01 / 03</span>
      </header>

      <div class="mk-hero">
        <p class="mk-eyebrow">Colaborações</p>
        <h1>Parcerias</h1>
        <p class="mk-hero__lead">
          {{ partnerships.screen?.description || 'Marcas que já fizeram parte da minha história — e as que estão chegando.' }}
        </p>
      </div>

      <div class="mk-lists">
        <section class="mk-list-card">
          <div class="mk-list-card__head">
            <span class="mk-list-card__icon">✦</span>
            <h2>Parcerias Feitas</h2>
            <span class="mk-list-card__count">{{ partnerships.done?.length || 0 }}</span>
          </div>
          <ul v-if="partnerships.done?.length">
            <li v-for="name in partnerships.done" :key="name">{{ name }}</li>
          </ul>
          <p v-else class="mk-empty mk-empty--small">Nenhuma parceria feita cadastrada.</p>
        </section>

        <section class="mk-list-card mk-list-card--accent">
          <div class="mk-list-card__head">
            <span class="mk-list-card__icon">✧</span>
            <h2>Parcerias Fechadas</h2>
            <span class="mk-list-card__count">{{ partnerships.closed?.length || 0 }}</span>
          </div>
          <ul v-if="partnerships.closed?.length">
            <li v-for="name in partnerships.closed" :key="name">{{ name }}</li>
          </ul>
          <p v-else class="mk-empty mk-empty--small">Nenhuma parceria fechada cadastrada.</p>
        </section>
      </div>

      <div v-if="partnerTiles.length" class="mk-collage">
        <article
          v-for="group in partnerTiles"
          :key="group.id"
          class="mk-brand-tile"
          :class="
            brandPhotos(group).length
              ? `mk-brand-tile--${brandLayout(group)}`
              : 'mk-brand-tile--text'
          "
        >
          <div v-if="brandPhotos(group).length" class="mk-brand-tile__photos">
            <div
              v-for="(photo, photoIndex) in brandPhotos(group)"
              :key="`${group.id}-${photoIndex}`"
              class="mk-brand-tile__photo"
              :class="{ 'mk-brand-tile__photo--hero': photoIndex === 0 }"
              :style="photoStyle(photo)"
            ></div>
          </div>
          <div v-else class="mk-brand-tile__text">
            <span class="mk-brand-tile__text-mark">✦</span>
            <strong>{{ group.name }}</strong>
            <small>parceria</small>
          </div>
          <p v-if="brandPhotos(group).length" class="mk-brand-tile__label">{{ group.name }}</p>
        </article>

        <article v-if="collageFillers.includes('brand')" class="mk-brand-tile mk-collage-note mk-collage-note--brand">
          <span class="mk-collage-note__mark">
            <img src="/pwa-icon-maskable-192.png" alt="" />
          </span>
          <span class="mk-collage-note__body">
            <strong>Mundo de Miriam</strong>
            <small>maquiagem &amp; fotografia</small>
          </span>
        </article>

        <article v-if="collageFillers.includes('cta')" class="mk-brand-tile mk-collage-note mk-collage-note--cta">
          <p class="mk-eyebrow">Vamos criar juntas?</p>
          <strong>{{ siteHost }}</strong>
          <span>@{{ profile.username || 'mihforastieri' }}</span>
        </article>
      </div>
      <p v-else class="mk-empty">Nenhuma marca com fotos publicadas ainda.</p>

      <footer class="mk-footer">
        <span>{{ siteHost }}</span>
        <span>@{{ profile.username || 'mihforastieri' }}</span>
      </footer>
    </section>

    <!-- Página 2 — Propostas -->
    <section class="mk-page mk-page--proposals">
      <span class="mk-frame" aria-hidden="true"></span>
      <span class="mk-orb mk-orb--three"></span>

      <header class="mk-topbar">
        <div class="mk-brand">
          <span class="mk-brand__mark"><img src="/pwa-icon-maskable-192.png" alt="" /></span>
          <span>
            <strong>MUNDO DE MIRIAM</strong>
            <small>maquiagem &amp; fotografia</small>
          </span>
        </div>
        <span class="mk-page-number">02 / 03</span>
      </header>

      <div class="mk-hero mk-hero--compact">
        <p class="mk-eyebrow">Portfólio</p>
        <h1>Propostas</h1>
        <p class="mk-hero__lead">
          Beleza e arte em composições pensadas para campanhas, editoriais e conteúdo.
        </p>
      </div>

      <section
        v-for="proposal in proposalSections"
        :key="proposal.key"
        class="mk-proposal"
      >
        <div class="mk-proposal__head">
          <p class="mk-eyebrow">Propostas</p>
          <h2>{{ proposal.title }}</h2>
          <p>{{ proposal.description }}</p>
        </div>

        <div
          v-if="proposal.photos.length"
          class="mk-mosaic"
          :class="{ 'mk-mosaic--single': proposal.photos.length < 2 }"
        >
          <div class="mk-mosaic__hero" :style="photoStyle(proposal.photos[0]?.url)"></div>
          <div v-if="proposal.photos.length > 1" class="mk-mosaic__side">
            <div
              v-for="photo in proposal.photos.slice(1, 5)"
              :key="photo.id"
              class="mk-mosaic__cell"
              :style="photoStyle(photo.url)"
            ></div>
          </div>
        </div>
        <div v-else class="mk-mosaic mk-mosaic--empty">
          <p class="mk-empty">Nenhuma foto publicada nesta tela ainda.</p>
        </div>
      </section>

      <footer class="mk-footer">
        <span>{{ siteHost }}</span>
        <span>@{{ profile.username || 'mihforastieri' }}</span>
      </footer>
    </section>

    <!-- Página 3 — Perfil + Insights -->
    <section class="mk-page mk-page--profile">
      <span class="mk-frame" aria-hidden="true"></span>
      <span class="mk-orb mk-orb--four"></span>

      <header class="mk-topbar">
        <div class="mk-brand">
          <span class="mk-brand__mark"><img src="/pwa-icon-maskable-192.png" alt="" /></span>
          <span>
            <strong>MUNDO DE MIRIAM</strong>
            <small>maquiagem &amp; fotografia</small>
          </span>
        </div>
        <span class="mk-page-number">03 / 03</span>
      </header>

      <div class="mk-profile-card">
        <div class="mk-avatar" :style="photoStyle(profile.avatarUrl)"></div>

        <div class="mk-profile-card__body">
          <p class="mk-eyebrow">Instagram</p>
          <h1>@{{ profile.username || 'mihforastieri' }}</h1>
          <p v-if="profile.fullName" class="mk-profile-card__name">{{ profile.fullName }}</p>

          <div class="mk-profile-stats">
            <div>
              <strong>{{ number(profile.posts) }}</strong>
              <span>posts</span>
            </div>
            <div>
              <strong>{{ number(profile.followers) }}</strong>
              <span>seguidores</span>
            </div>
            <div>
              <strong>{{ number(profile.following) }}</strong>
              <span>seguindo</span>
            </div>
          </div>

          <p class="mk-profile-card__bio">
            {{ profile.biography || t('Maquiagem, fotografia e beleza em cada detalhe.') }}
          </p>
          <p class="mk-profile-card__link">{{ profile.website || siteHost }}</p>
        </div>
      </div>

      <div class="mk-section-head">
        <p class="mk-eyebrow">Insights</p>
        <h2>Alcance e engajamento</h2>
      </div>

      <div class="mk-insights">
        <article v-for="period in insightPeriods" :key="period.days" class="mk-insight-card">
          <header>
            <p class="mk-eyebrow">Últimos</p>
            <h3>{{ period.days }} dias</h3>
          </header>

          <div v-if="period.samples > 0" class="mk-insight-values">
            <div class="mk-insight-value mk-insight-value--wide">
              <strong>{{ number(period.views) }}</strong>
              <span>visualizações</span>
            </div>
            <div class="mk-insight-value">
              <strong>{{ compact(period.interactions) }}</strong>
              <span>interações</span>
            </div>
            <div class="mk-insight-value">
              <strong>
                {{ period.netFollowers != null ? signed(period.netFollowers) : signed(period.newFollowers) }}
              </strong>
              <span>{{ period.netFollowers != null ? 'seguidores líquidos' : 'novos seguidores' }}</span>
            </div>
          </div>

          <p v-else class="mk-empty mk-empty--small">
            Sem dados coletados neste período.
          </p>

          <div v-if="period.samples > 0 && period.followers != null" class="mk-audience">
            <div class="mk-audience__bar">
              <span :style="{ width: `${period.followers}%` }"></span>
            </div>
            <div class="mk-audience__labels">
              <span>{{ period.followers }}% seguidores</span>
              <span>{{ period.nonFollowers }}% não seguidores</span>
            </div>
          </div>
          <p v-else-if="period.samples > 0" class="mk-empty mk-empty--small">
            Detalhamento por seguidores indisponível.
          </p>
        </article>
      </div>

      <div class="mk-about">
        <p class="mk-eyebrow">Sobre</p>
        <h2>{{ siteTitle }}</h2>
        <p v-for="paragraph in bioParagraphs" :key="paragraph">{{ paragraph }}</p>
      </div>

      <footer class="mk-footer">
        <span>{{ siteHost }}</span>
        <span>gerado em {{ generatedAt }}</span>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  data: { type: Object, required: true }
})

const { t } = useI18n()
const root = ref(null)

const profile = computed(() => props.data?.profile || {})
const partnerships = computed(
  () => props.data?.partnerships || { screen: null, groups: [], done: [], closed: [] }
)
const proposals = computed(() => props.data?.proposals || {})
const insights = computed(() => props.data?.insights || {})

const siteHost = computed(() => {
  const configured = props.data?.site?.url

  if (configured) {
    try {
      return new URL(configured).hostname.replace(/^www\./, '')
    } catch {
      // segue para o host atual
    }
  }

  return window.location.hostname.replace(/^www\./, '')
})

const generatedAt = computed(() => {
  const value = props.data?.generatedAt ? new Date(props.data.generatedAt) : new Date()

  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(value)
})

const siteTitle = computed(() => t('Maquiadora Profissional & Fotógrafa'))

const bioParagraphs = computed(() => [
  t(
    'Sou apaixonada pela arte da maquiagem há mais de 8 anos, especializando-me em maquiagem artística, beauty e fotografia e-commerce. Minha jornada começou com a curiosidade de transformar rostos em telas em branco, criando verdadeiras obras de arte.'
  ),
  t(
    'Minha especialização inclui maquiagem para eventos especiais, sessões fotográficas, e-commerce e parcerias com marcas renomadas. Acredito que a maquiagem é uma forma de expressão pessoal e autoestima.'
  )
])

const partnerTiles = computed(() =>
  (partnerships.value.groups || [])
    // Entram na colagem as marcas com fotos e também as parcerias fechadas,
    // mesmo quando ainda não têm foto cadastrada.
    .filter((group) => brandPhotos(group).length > 0 || group.closed)
    .slice(0, 9)
)

function brandPhotos(group) {
  const urls = (group.photos || []).map((photo) => photo.url).filter(Boolean)

  if (urls.length > 0) return urls.slice(0, 3)

  return group.coverUrl ? [group.coverUrl] : []
}

function brandLayout(group) {
  const count = brandPhotos(group).length

  if (count <= 1) return 'single'
  if (count === 2) return 'two'

  return 'mosaic'
}

const collageFillers = computed(() => {
  const count = partnerTiles.value.length

  if (!count) return []

  const fillers = (3 - (count % 3)) % 3

  return fillers === 2 ? ['brand', 'cta'] : fillers === 1 ? ['brand'] : []
})

const proposalSections = computed(() => [
  {
    key: 'beauty',
    title: proposals.value.beauty?.screen?.menuLabel || proposals.value.beauty?.screen?.name || 'Beauty',
    description:
      proposals.value.beauty?.screen?.description ||
      'Beleza natural, pele luminosa e produções para campanhas, editoriais e conteúdo.',
    photos: proposals.value.beauty?.photos || []
  },
  {
    key: 'artistic',
    title:
      proposals.value.artistic?.screen?.menuLabel ||
      proposals.value.artistic?.screen?.name ||
      'Artístico',
    description:
      proposals.value.artistic?.screen?.description ||
      'Cores, texturas e caracterização para projetos autorais e editoriais.',
    photos: proposals.value.artistic?.photos || []
  }
])

// O PDF reproduz exatamente o período escolhido no filtro do painel.
const insightPeriods = computed(() => {
  const selected = insights.value.selected

  if (selected) return [selected]

  return [insights.value.last90Days, insights.value.last30Days].filter(Boolean)
})

function number(value) {
  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return new Intl.NumberFormat('pt-BR').format(numeric)
}

function signed(value) {
  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return `${numeric >= 0 ? '+' : ''}${new Intl.NumberFormat('pt-BR').format(numeric)}`
}

function compact(value) {
  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(numeric)
}

function photoStyle(url) {
  return url ? { backgroundImage: `url("${url}")` } : {}
}

function collectPhotoUrls() {
  const urls = new Set(['/pwa-icon-maskable-192.png'])

  for (const group of partnerships.value.groups || []) {
    if (group.coverUrl) urls.add(group.coverUrl)

    for (const photo of group.photos || []) {
      if (photo.url) urls.add(photo.url)
    }
  }

  for (const key of ['beauty', 'artistic']) {
    for (const photo of proposals.value[key]?.photos || []) {
      if (photo.url) urls.add(photo.url)
    }
  }

  if (profile.value.avatarUrl) urls.add(profile.value.avatarUrl)

  return [...urls]
}

function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve()
      return
    }

    const image = new Image()
    const timer = setTimeout(resolve, 5000)

    image.onload = () => {
      clearTimeout(timer)
      resolve()
    }
    image.onerror = () => {
      clearTimeout(timer)
      resolve()
    }
    image.src = url
  })
}

async function waitForAssets() {
  if (document.fonts?.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 3000))
      ])
    } catch {
      // fontes externas podem falhar; o PDF ainda é gerado.
    }
  }

  await Promise.all(collectPhotoUrls().map(preloadImage))
  await nextTick()
}

async function generate() {
  if (!root.value) {
    throw new Error('Documento do PDF não está pronto.')
  }

  await waitForAssets()

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ])

  const pages = [...root.value.querySelectorAll('.mk-page')]

  if (pages.length === 0) {
    throw new Error('Nenhuma página foi encontrada para gerar o PDF.')
  }

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true
  })

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index]
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f7efe4',
      logging: false,
      width: page.offsetWidth,
      height: page.offsetHeight,
      windowWidth: page.offsetWidth,
      windowHeight: page.offsetHeight,
      onclone: (clonedDoc) => {
        // O material tem paleta própria; garante as cores no PDF.
        const style = clonedDoc.createElement('style')
        style.textContent =
          'html, body { background: #f0ddca !important; }' +
          '.media-kit, .media-kit * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }'
        clonedDoc.head.appendChild(style)
      }
    })

    const image = canvas.toDataURL('image/jpeg', 0.95)

    if (index > 0) {
      pdf.addPage('a4', 'portrait')
    }

    pdf.addImage(image, 'JPEG', 0, 0, 210, 297, undefined, 'FAST')
  }

  const stamp = new Date().toISOString().slice(0, 10)
  pdf.save(`mundo-de-miriam-apresentacao-${stamp}.pdf`)

  return true
}

defineExpose({ generate })
</script>

<style scoped>
.media-kit {
  position: fixed;
  top: 0;
  left: -10000px;
  width: 210mm;
  pointer-events: none;
  z-index: 0;
}

.mk-page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 210mm;
  height: 297mm;
  padding: 10mm 11mm 8mm;
  overflow: hidden;
  background:
    radial-gradient(120% 75% at 100% 0%, rgba(214, 154, 111, 0.28) 0%, rgba(214, 154, 111, 0) 58%),
    radial-gradient(100% 70% at 0% 100%, rgba(163, 86, 52, 0.2) 0%, rgba(163, 86, 52, 0) 55%),
    linear-gradient(155deg, #fdf8f2 0%, #f7ecdf 45%, #f0ddca 100%);
  color: #3a2114;
  font-family: 'Gilda Display', Georgia, serif;
  box-sizing: border-box;
}

.mk-frame {
  position: absolute;
  top: 5mm;
  right: 5mm;
  bottom: 5mm;
  left: 5mm;
  border: 0.35mm solid rgba(85, 34, 0, 0.2);
  border-radius: 3mm;
  pointer-events: none;
  z-index: 0;
}

.mk-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.mk-orb--one {
  top: -24mm;
  right: -22mm;
  width: 72mm;
  height: 72mm;
  background: #eeddcc;
}

.mk-orb--two {
  bottom: 34mm;
  left: -34mm;
  width: 58mm;
  height: 58mm;
  background: #f1e3d5;
}

.mk-orb--three {
  top: 38mm;
  right: -30mm;
  width: 64mm;
  height: 64mm;
  background: #efe0d0;
}

.mk-orb--four {
  top: -26mm;
  left: -24mm;
  width: 66mm;
  height: 66mm;
  background: #eeddcc;
}

.mk-topbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2.5mm;
  border-bottom: 1px solid rgba(85, 34, 0, 0.24);
}

.mk-brand {
  display: flex;
  align-items: center;
  gap: 2.8mm;
}

.mk-brand__mark {
  display: grid;
  place-items: center;
  width: 9mm;
  height: 9mm;
  border-radius: 2mm;
  background: #552200;
  color: #fff8f1;
  font-size: 4mm;
  line-height: 1;
  overflow: hidden;
}

.mk-brand__mark img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mk-brand strong {
  display: block;
  color: #552200;
  font-size: 3.1mm;
  font-weight: 400;
  letter-spacing: 0.16em;
}

.mk-brand small {
  display: block;
  margin-top: 0.6mm;
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.4mm;
  letter-spacing: 0.08em;
}

.mk-page-number {
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.5mm;
  letter-spacing: 0.16em;
}

.mk-hero {
  position: relative;
  z-index: 1;
  margin-top: 6mm;
}

.mk-hero--compact {
  margin-top: 4mm;
}

.mk-eyebrow {
  margin: 0 0 1.2mm;
  color: #a06a4d;
  font-family: system-ui, sans-serif;
  font-size: 2.3mm;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.mk-hero h1 {
  margin: 0;
  color: #552200;
  font-size: 15mm;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.95;
}

.mk-hero--compact h1 {
  font-size: 13mm;
}

.mk-hero__lead {
  max-width: 138mm;
  margin: 2.5mm 0 0;
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 3mm;
  line-height: 1.55;
}

.mk-lists {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5mm;
  margin-top: 4mm;
}

.mk-list-card {
  padding: 3.2mm 4mm 3mm;
  border: 1px solid rgba(85, 34, 0, 0.12);
  border-radius: 4mm;
  background: #fff8f1;
}

.mk-list-card--accent {
  border-color: #552200;
  background: #552200;
  color: #fff8f1;
}

.mk-list-card__head {
  display: flex;
  align-items: center;
  gap: 1.5mm;
  margin-bottom: 2.2mm;
}

.mk-list-card__count {
  margin-left: auto;
  padding: 0.4mm 1.8mm;
  border-radius: 99px;
  background: rgba(85, 34, 0, 0.08);
  color: #7c523b;
  font-family: system-ui, sans-serif;
  font-size: 2.2mm;
  font-weight: 700;
  line-height: 1.4;
}

.mk-list-card--accent .mk-list-card__count {
  background: rgba(255, 248, 241, 0.16);
  color: #fff8f1;
}

.mk-list-card__icon {
  color: #b9805a;
  font-size: 3.6mm;
}

.mk-list-card--accent .mk-list-card__icon {
  color: #e7c5ab;
}

.mk-list-card h2 {
  margin: 0;
  font-size: 4.2mm;
  font-weight: 400;
  line-height: 1.1;
}

.mk-list-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1mm 1.6mm;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mk-list-card li {
  padding: 0.7mm 1.9mm;
  border-radius: 99px;
  background: rgba(85, 34, 0, 0.07);
  color: #5a3a28;
  font-family: system-ui, sans-serif;
  font-size: 2.4mm;
  line-height: 1.35;
}

.mk-list-card--accent li {
  background: rgba(255, 248, 241, 0.12);
  color: #fff8f1;
}

.mk-list-card__more {
  background: transparent !important;
  color: #8a6a58 !important;
  font-style: italic;
}

.mk-list-card--accent .mk-list-card__more {
  color: #e7c5ab !important;
}

.mk-collage {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  flex: 1 1 auto;
  min-height: 0;
  gap: 2.5mm;
  margin-top: 4mm;
}

.mk-brand-tile {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(85, 34, 0, 0.1);
  border-radius: 3.5mm;
  background: #e6d6c6;
}

.mk-brand-tile__photos {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1mm;
  width: 100%;
  height: 100%;
  padding: 1mm;
  box-sizing: border-box;
}

.mk-brand-tile__photo {
  min-height: 0;
  border-radius: 2.5mm;
  background-color: #e6d6c6;
  background-position: center;
  background-size: cover;
}

.mk-brand-tile__photo--hero {
  grid-row: span 2;
}

.mk-brand-tile--single .mk-brand-tile__photos {
  grid-template-columns: 1fr;
}

.mk-brand-tile--single .mk-brand-tile__photo--hero {
  grid-row: auto;
}

.mk-brand-tile--two .mk-brand-tile__photos {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.mk-brand-tile--two .mk-brand-tile__photo--hero {
  grid-row: auto;
}

/* Marca sem foto: bloco tipografico no mesmo formato dos demais. */
.mk-brand-tile--text {
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: rgba(85, 34, 0, 0.18);
  background: linear-gradient(160deg, #f8e9da 0%, #e7cdb4 100%);
}

.mk-brand-tile__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2mm;
  padding: 6mm 4mm;
  text-align: center;
}

.mk-brand-tile__text-mark {
  color: #b9805a;
  font-size: 3.6mm;
}

.mk-brand-tile__text strong {
  color: #552200;
  font-size: 4.4mm;
  font-weight: 400;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.mk-brand-tile__text small {
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.1mm;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.mk-brand-tile__label {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 7mm 2.5mm 2mm;
  overflow: hidden;
  background: linear-gradient(transparent, rgba(32, 13, 4, 0.82));
  color: #fff8f1;
  font-family: system-ui, sans-serif;
  font-size: 2.35mm;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.mk-collage-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5mm;
  padding: 4mm;
  text-align: center;
  box-sizing: border-box;
}

.mk-collage-note--brand {
  border-color: #552200;
  background: #552200;
  color: #fff8f1;
}

.mk-collage-note__mark {
  display: grid;
  place-items: center;
  width: 15mm;
  height: 15mm;
  overflow: hidden;
  border-radius: 3.5mm;
  background: #fff8f1;
}

.mk-collage-note__mark img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mk-collage-note__body strong {
  display: block;
  color: #fff8f1;
  font-size: 4.2mm;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.mk-collage-note__body small {
  display: block;
  margin-top: 1mm;
  color: #e7c5ab;
  font-family: system-ui, sans-serif;
  font-size: 2.2mm;
  letter-spacing: 0.08em;
}

.mk-collage-note--cta {
  border-color: rgba(85, 34, 0, 0.18);
  background: linear-gradient(160deg, #f8e9da 0%, #ead0b8 100%);
}

.mk-collage-note--cta .mk-eyebrow {
  margin: 0;
  color: #8a5334;
}

.mk-collage-note--cta strong {
  color: #552200;
  font-size: 4.6mm;
  font-weight: 400;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.mk-collage-note--cta span {
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 2.4mm;
  letter-spacing: 0.06em;
}

.mk-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3.5mm;
  padding-top: 2.2mm;
  border-top: 1px solid rgba(85, 34, 0, 0.14);
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.3mm;
  letter-spacing: 0.08em;
}

.mk-empty {
  margin: 4mm 0;
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.8mm;
  line-height: 1.5;
}

.mk-empty--small {
  margin: 2mm 0 0;
  font-size: 2.4mm;
}

.mk-proposal {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 44mm 1fr;
  gap: 4.5mm;
  flex: 1 1 0;
  min-height: 0;
  margin-top: 5mm;
  align-items: stretch;
}

.mk-proposal__head h2 {
  margin: 0;
  color: #552200;
  font-size: 6.4mm;
  font-weight: 400;
  line-height: 1;
}

.mk-proposal__head p:last-child {
  margin: 2mm 0 0;
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 2.7mm;
  line-height: 1.55;
}

.mk-mosaic {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 2mm;
  height: 100%;
  min-height: 52mm;
}

.mk-mosaic--single {
  grid-template-columns: 1fr;
}

.mk-mosaic--empty {
  display: grid;
  place-items: center;
  border: 1px dashed rgba(85, 34, 0, 0.22);
  border-radius: 3mm;
}

.mk-mosaic__hero {
  border-radius: 3mm;
  background-color: #e6d6c6;
  background-position: center;
  background-size: cover;
}

.mk-mosaic__side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2mm;
}

.mk-mosaic__cell {
  border-radius: 3mm;
  background-color: #e6d6c6;
  background-position: center;
  background-size: cover;
}

.mk-page--profile .mk-profile-card {
  flex: 1 1 0;
  min-height: 0;
}

.mk-profile-card {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 40mm 1fr;
  gap: 6mm;
  align-items: center;
  margin-top: 5mm;
  padding: 6mm;
  border: 1px solid rgba(85, 34, 0, 0.12);
  border-radius: 5mm;
  background: #fff8f1;
}

.mk-avatar {
  width: 40mm;
  height: 40mm;
  border: 2mm solid #fff8f1;
  border-radius: 50%;
  background-color: #e6d6c6;
  background-position: center;
  background-size: cover;
  box-shadow: 0 0 0 0.5mm rgba(85, 34, 0, 0.16);
}

.mk-profile-card h1 {
  margin: 0;
  color: #552200;
  font-size: 8mm;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1;
}

.mk-profile-card__name {
  margin: 1.5mm 0 0;
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 2.8mm;
}

.mk-profile-stats {
  display: flex;
  gap: 8mm;
  margin-top: 3mm;
}

.mk-profile-stats div {
  display: flex;
  flex-direction: column;
}

.mk-profile-stats strong {
  color: #552200;
  font-size: 5.2mm;
  font-weight: 400;
  line-height: 1;
}

.mk-profile-stats span {
  margin-top: 0.8mm;
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.2mm;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.mk-profile-card__bio {
  max-height: 12mm;
  margin: 2.5mm 0 0;
  overflow: hidden;
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 2.7mm;
  line-height: 1.5;
}

.mk-profile-card__link {
  margin: 1.5mm 0 0;
  color: #a06a4d;
  font-family: system-ui, sans-serif;
  font-size: 2.5mm;
}

.mk-section-head {
  position: relative;
  z-index: 1;
  margin-top: 6mm;
}

.mk-section-head h2 {
  margin: 0;
  color: #552200;
  font-size: 7mm;
  font-weight: 400;
  line-height: 1;
}

.mk-page--profile .mk-insights {
  flex: 1.35 1 0;
  min-height: 0;
}

.mk-insights {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3mm;
  margin-top: 3mm;
}

.mk-insight-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4mm;
  border: 1px solid rgba(85, 34, 0, 0.16);
  border-radius: 4mm;
  background: linear-gradient(160deg, #fffdf9 0%, #f8ecdf 100%);
  box-shadow: 0 2.5mm 6mm rgba(85, 34, 0, 0.1);
}

.mk-insight-card:only-child {
  grid-column: 1 / -1;
}

.mk-insight-card header h3 {
  margin: 0;
  color: #552200;
  font-size: 5mm;
  font-weight: 400;
  line-height: 1;
}

.mk-insight-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3mm;
  margin-top: 3mm;
}

.mk-insight-value--wide {
  grid-column: 1 / -1;
}

.mk-insight-value strong {
  display: block;
  color: #552200;
  font-size: 7.2mm;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1;
}

.mk-insight-value span {
  display: block;
  margin-top: 0.8mm;
  color: #8a6a58;
  font-family: system-ui, sans-serif;
  font-size: 2.2mm;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mk-audience {
  margin-top: 3mm;
}

.mk-audience__bar {
  height: 2.5mm;
  overflow: hidden;
  border-radius: 99px;
  background: #e6d6c6;
}

.mk-audience__bar span {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: #b9805a;
}

.mk-audience__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 1.6mm;
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 2.1mm;
}

.mk-about {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0.9 1 0;
  min-height: 0;
  margin-top: 5mm;
  padding-top: 4mm;
  border-top: 1px solid rgba(85, 34, 0, 0.14);
}

.mk-about h2 {
  margin: 0;
  color: #552200;
  font-size: 6mm;
  font-weight: 400;
  line-height: 1.05;
}

.mk-about p {
  margin: 1.5mm 0 0;
  color: #6b4a38;
  font-family: system-ui, sans-serif;
  font-size: 2.6mm;
  line-height: 1.55;
}
</style>
