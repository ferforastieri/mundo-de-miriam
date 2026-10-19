<template>
  <div class="album-page">
    <header class="album-header">
      <RouterLink class="album-brand" to="/">
        <span class="album-brand__eyebrow">Mundo de Miriam</span>
        <span class="album-brand__title">Fotos compartilhadas</span>
      </RouterLink>
      <RouterLink class="album-back" to="/">Ver portfólio ↗</RouterLink>
    </header>

    <main class="album-main">
      <div v-if="isPending" class="album-skeleton" aria-hidden="true">
        <SkeletonBlock height="128px" radius="18px" />
        <GallerySkeleton :count="6" />
      </div>

      <div v-else-if="notFound" class="album-state">
        <h1>Link não encontrado</h1>
        <p>O link pode estar incorreto ou ter sido removido.</p>
        <RouterLink class="album-action" to="/">Ir para o site</RouterLink>
      </div>

      <div v-else-if="expired" class="album-state">
        <h1>Este link expirou</h1>
        <p>Peça um novo link para Miriam para continuar acessando as fotos.</p>
        <RouterLink class="album-action" to="/">Ir para o site</RouterLink>
      </div>

      <template v-else-if="screen">
        <section class="album-intro">
          <p class="album-eyebrow">Fotos compartilhadas</p>
          <h1>{{ screen.name }}</h1>
          <p v-if="screen.description" class="album-description">{{ screen.description }}</p>
          <p class="album-meta">
            {{ photoCount }} foto{{ photoCount === 1 ? '' : 's' }}
            <template v-if="expiresAt"> · disponível até {{ formatDate(expiresAt) }}</template>
            <template v-else> · disponível para sempre</template>
          </p>
        </section>

        <PartnershipsGallery
          v-if="screen.kind === 'partnerships' && partnerships.length > 0"
          :partnerships="partnerships"
          @toggle-partnership="togglePartnership"
        />

        <figure v-else-if="screen.kind === 'single' && images.length > 0" class="album-single">
          <img :src="images[0].src" :alt="images[0].alt" />
        </figure>

        <PortfolioGallery v-else-if="images.length > 0" :images="images" />

        <p v-else class="album-meta">Nenhuma foto publicada ainda.</p>
      </template>
    </main>

    <footer class="album-footer">
      <span>Fotos por Miriam Cléres Forastieri</span>
      <RouterLink to="/">mundo de miriam</RouterLink>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import galleryService from '@/api/gallery/GalleryService.js'
import { GallerySkeleton, PortfolioGallery, PartnershipsGallery } from '@/components/portfolio'
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'
import { formatDate } from '@/utils/format.js'

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const notFound = ref(false)

const { data, isPending, isError, error } = useQuery({
  queryKey: ['public-screen', token],
  queryFn: () => galleryService.getSharedScreen(token.value),
  retry: false,
  enabled: computed(() => Boolean(token.value))
})

const screen = computed(() => (data.value?.available ? data.value.screen : null))
const expiresAt = computed(() => data.value?.screen?.expiresAt || null)
const expired = computed(() => data.value?.available === false && data.value?.reason === 'expired')

const images = computed(() =>
  (screen.value?.photos || []).map((photo) => ({
    id: photo.id,
    src: photo.url,
    alt: photo.alt || screen.value?.name || ''
  }))
)

const photoCount = computed(() => {
  if (screen.value?.kind === 'partnerships') {
    return (screen.value?.groups || []).reduce((total, group) => total + (group.photos?.length || 0), 0)
  }

  return images.value.length
})

const partnerships = ref([])

function buildPartnerships(current) {
  return (current?.groups || [])
    .filter((group) => group.photos?.length)
    .map((group) => {
      const cover = group.photos.find((photo) => photo.featured) || group.photos[0]

      return {
        id: group.id,
        name: group.name,
        images: group.photos.map((photo) => ({
          id: photo.id,
          src: photo.url,
          alt: photo.alt || group.name
        })),
        mainImage: cover.url,
        isExpanded: false
      }
    })
}

function togglePartnership(index) {
  partnerships.value.forEach((partnership, itemIndex) => {
    if (itemIndex !== index) partnership.isExpanded = false
  })

  partnerships.value[index].isExpanded = !partnerships.value[index].isExpanded
}

watch(
  [data, isError, error],
  ([payload, failed, queryError]) => {
    notFound.value = Boolean(failed && queryError?.status === 404)

    if (payload?.available) {
      partnerships.value = buildPartnerships(payload.screen)
      document.title = `${payload.screen.name} · Mundo de Miriam`
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.album-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
}

.album-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 0.5rem;
}

.album-brand {
  display: flex;
  flex-direction: column;
  color: var(--primary);
  text-decoration: none;
}

.album-brand__eyebrow {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.album-brand__title {
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}

.album-back {
  color: var(--primary);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.album-skeleton {
  display: grid;
  gap: 1.2rem;
}

.album-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
}

.album-state {
  max-width: 560px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.album-state h1 {
  margin: 0 0 0.6rem;
  color: var(--primary);
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: normal;
}

.album-state p {
  margin: 0 0 1.2rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
}

.album-action {
  display: inline-block;
  padding: 0.65rem 1.2rem;
  border: 2px solid var(--primary);
  border-radius: 8px;
  color: var(--primary);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  text-decoration: none;
}

.album-action:hover {
  background: var(--primary);
  color: var(--on-primary);
}

.album-intro {
  margin-bottom: 1.5rem;
  padding: 1.6rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.album-eyebrow {
  margin: 0 0 0.4rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.album-intro h1 {
  margin: 0;
  color: var(--primary);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: normal;
  line-height: 1.1;
}

.album-description {
  max-width: 680px;
  margin: 0.6rem auto 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.95rem;
  line-height: 1.55;
}

.album-meta {
  margin: 0.8rem 0 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
}

.album-single {
  margin: 0;
  display: grid;
  place-items: center;
}

.album-single img {
  max-width: min(560px, 100%);
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
}

.album-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.25rem 2.5rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.75rem;
  border-top: 1px solid var(--border);
}

.album-footer a {
  color: inherit;
  text-decoration: none;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

:global(html[data-theme="dark"] .album-page) {
  background: var(--page-bg);
}

:global(html[data-theme="dark"] .album-intro),
:global(html[data-theme="dark"] .album-state) {
  background: var(--surface);
  border-color: var(--border);
}

:global(html[data-theme="dark"] .album-intro h1),
:global(html[data-theme="dark"] .album-state h1),
:global(html[data-theme="dark"] .album-action) {
  color: var(--primary) !important;
}

:global(html[data-theme="dark"] .album-action:hover) {
  background: var(--primary);
  color: var(--on-primary) !important;
}
</style>
