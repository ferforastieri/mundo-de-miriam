<template>
  <PortfolioLayout>
    <div class="gallery-view">
      <div v-if="isPending" class="loading">
        <TranslatableText text="Carregando imagens..." />
      </div>

      <template v-else-if="screen">
        <div class="portfolio-header">
          <div class="header-content">
            <h1 class="portfolio-title">{{ screen.name }}</h1>
            <p v-if="screen.description" class="portfolio-subtitle">{{ screen.description }}</p>
          </div>
        </div>

        <PartnershipsGallery
          v-if="screen.kind === 'partnerships'"
          :partnerships="partnerships"
          @toggle-partnership="togglePartnership"
        />

        <template v-else>
          <PortfolioGallery v-if="images.length > 0" :images="images" />
          <p v-else class="empty-state">
            <TranslatableText text="Nenhuma foto publicada ainda." />
          </p>
        </template>
      </template>

      <div v-else class="empty-state">
        <p>Tela não encontrada.</p>
        <RouterLink class="back-home" to="/">Voltar para o início</RouterLink>
      </div>
    </div>
  </PortfolioLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PortfolioLayout from '@/layouts/portfolio/PortfolioLayout.vue'
import { TranslatableText } from '@/components/common'
import { PortfolioGallery, PartnershipsGallery } from '@/components/portfolio'
import { usePublicGallery } from '@/composables/usePublicGallery'

const route = useRoute()
const { data, isPending } = usePublicGallery()

const screen = computed(() => {
  const screenId = String(route.params.screenId || '')
  return (data.value?.screens || []).find((item) => item.id === screenId) || null
})

const images = computed(() =>
  (screen.value?.photos || []).map((photo) => ({
    id: photo.id,
    src: photo.url,
    alt: photo.alt || ''
  }))
)

const partnerships = ref([])

function buildPartnerships(nextScreen) {
  return (nextScreen?.groups || [])
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

watch(
  screen,
  (current) => {
    if (!current) return

    partnerships.value = buildPartnerships(current)
    document.title = `${current.name} · Mundo de Miriam`

    const meta = document.querySelector('meta[name="description"]')

    if (meta && current.description) {
      meta.setAttribute('content', current.description)
    }
  },
  { immediate: true }
)

function togglePartnership(index) {
  partnerships.value.forEach((partnership, itemIndex) => {
    if (itemIndex !== index) partnership.isExpanded = false
  })

  partnerships.value[index].isExpanded = !partnerships.value[index].isExpanded
}
</script>

<style scoped>
.gallery-view {
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.portfolio-header {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header-content {
  flex: 1;
  text-align: center;
  padding-right: 7rem;
}

.portfolio-title {
  font-family: 'Gilda Display', serif;
  font-size: clamp(2rem, 5vw, 2.5rem);
  color: var(--primary);
  margin: 0 0 0.5rem;
  font-weight: normal;
  letter-spacing: 2px;
}

.portfolio-subtitle {
  font-family: 'Gilda Display', serif;
  font-size: 1.1rem;
  color: var(--muted);
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
}

.loading,
.empty-state {
  padding: 2rem;
  color: var(--muted);
  font-family: 'Gilda Display', serif;
  text-align: center;
}

.back-home {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 768px) {
  .header-content {
    padding-right: 5rem;
  }

  .portfolio-header {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding-right: 0;
    text-align: left;
  }

  .portfolio-header {
    padding: 1rem;
  }

  .portfolio-title {
    font-size: 1.5rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
