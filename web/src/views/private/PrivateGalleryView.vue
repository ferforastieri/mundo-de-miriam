<template>
  <PortfolioLayout>
    <div class="portfolio-container">
      <div v-if="isPending" class="private-pending">
        <GallerySkeleton :count="6" />
      </div>

      <div v-else-if="notFound" class="empty-state">
        <h1 class="private-title">Link não encontrado</h1>
        <p>O link pode estar incorreto ou ter sido removido.</p>
        <RouterLink class="back-home" to="/">Voltar para o início</RouterLink>
      </div>

      <div v-else-if="expired" class="empty-state">
        <h1 class="private-title">Este link expirou</h1>
        <p>Peça um novo link para Miriam para continuar acessando as fotos.</p>
        <RouterLink class="back-home" to="/">Voltar para o início</RouterLink>
      </div>

      <template v-else-if="screen">
        <PageHeaderCard :title="screen.name" :description="screen.description">
          <template #meta>
            <p class="private-meta">
              {{ photoCount }} foto{{ photoCount === 1 ? '' : 's' }}
              <template v-if="expiresAt"> · disponível até {{ formatDate(expiresAt) }}</template>
              <template v-else> · disponível para sempre</template>
            </p>
          </template>
        </PageHeaderCard>

        <div v-if="allMedia.length > 0" class="private-toolbar">
          <button class="download-all" type="button" @click="downloadAll">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Baixar todas
          </button>
        </div>

        <PartnershipsGallery
          v-if="screen.kind === 'partnerships' && partnerships.length > 0"
          :partnerships="partnerships"
          :downloadable="true"
          @toggle-partnership="togglePartnership"
        />

        <figure v-else-if="screen.kind === 'single' && images.length > 0" class="single-photo">
          <ProjectVideoPlayer
            v-if="images[0].type.startsWith('video/')"
            :src="images[0].src"
            class="single-photo__player"
          />
          <img v-else :src="images[0].src" :alt="images[0].alt" />
        </figure>

        <PortfolioGallery v-else-if="images.length > 0" :images="images" :downloadable="true" />

        <p v-else class="empty-state">Nenhuma foto publicada ainda.</p>
      </template>
    </div>
  </PortfolioLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import PortfolioLayout from '@/layouts/portfolio/PortfolioLayout.vue'
import PageHeaderCard from '@/components/common/PageHeaderCard.vue'
import ProjectVideoPlayer from '@/components/common/ProjectVideoPlayer.vue'
import { GallerySkeleton, PortfolioGallery, PartnershipsGallery } from '@/components/portfolio'
import galleryService from '@/api/gallery/GalleryService.js'
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
    alt: photo.alt || screen.value?.name || '',
    type: photo.contentType || 'image/jpeg'
  }))
)

const photoCount = computed(() => {
  if (screen.value?.kind === 'partnerships') {
    return (screen.value?.groups || []).reduce((total, group) => total + (group.photos?.length || 0), 0)
  }

  return images.value.length
})

const allMedia = computed(() => {
  if (!screen.value) return []

  if (screen.value.kind === 'partnerships') {
    return (screen.value.groups || [])
      .flatMap((group) => group.photos || [])
      .map((photo) => ({ src: photo.url, alt: photo.alt || screen.value.name || 'arquivo' }))
  }

  return images.value.map((image) => ({ src: image.src, alt: image.alt }))
})

function downloadAll() {
  if (!token.value) return

  window.location.href = `/api/public/screens/${encodeURIComponent(token.value)}/download`
}

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
          alt: photo.alt || group.name,
          type: photo.contentType || 'image/jpeg'
        })),
        mainImage: cover.url,
        mainType: cover.contentType || 'image/jpeg',
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
.portfolio-container {
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.private-meta {
  margin: 0.15rem 0 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.74rem;
}

.private-toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 1rem;
}


.download-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.7rem;
  padding: 0.55rem 1.05rem;
  border: 2px solid var(--primary);
  border-radius: 10px;
  background: transparent;
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.download-all:hover {
  background: var(--primary);
  color: var(--on-primary);
}

.download-all svg {
  width: 17px;
  height: 17px;
}

.private-pending {
  display: grid;
  gap: 1.2rem;
}

.single-photo {
  margin: 0;
  display: grid;
  place-items: center;
}

.single-photo__player {
  max-width: min(560px, 100%);
}

.single-photo img,
.single-photo video {
  max-width: min(560px, 100%);
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
}

.empty-state {
  padding: 2rem;
  color: var(--muted);
  font-family: 'Gilda Display', serif;
  text-align: center;
}

.private-title {
  margin: 0 0 0.5rem;
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 1.5rem;
  font-weight: normal;
}

.back-home {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
