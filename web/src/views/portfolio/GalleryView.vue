<template>
  <component :is="layout">
    <div class="portfolio-container">
      <div v-if="isPending && !screen" class="gallery-pending">
        <div class="portfolio-header">
          <div class="header-content">
            <SkeletonBlock width="min(280px, 70%)" height="2rem" />
            <SkeletonBlock width="min(200px, 50%)" height="0.9rem" />
          </div>
        </div>
        <GallerySkeleton />
      </div>

      <template v-else-if="screen">
        <div class="portfolio-header">
          <div class="header-content">
            <h1 class="portfolio-title">{{ screen.name }}</h1>
            <p v-if="screen.description" class="portfolio-subtitle">{{ screen.description }}</p>
          </div>
        </div>

        <PartnershipsGallery
          v-if="screen.kind === 'partnerships' && partnerships.length > 0"
          :partnerships="partnerships"
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

        <PortfolioGallery v-else-if="images.length > 0" :images="images" />

        <p v-else class="empty-state">
          <TranslatableText text="Nenhuma foto publicada ainda." />
        </p>
      </template>

      <div v-else class="empty-state">
        <p><TranslatableText text="Tela não encontrada." /></p>
        <RouterLink class="back-home" to="/">
          <TranslatableText text="Voltar para o início" />
        </RouterLink>
      </div>
    </div>
  </component>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PortfolioLayout from '@/layouts/portfolio/PortfolioLayout.vue'
import ProjectVideoPlayer from '@/components/common/ProjectVideoPlayer.vue'
import PartnershipsLayout from '@/layouts/portfolio/PartnershipsLayout.vue'
import { TranslatableText } from '@/components/common'
import { GallerySkeleton, PortfolioGallery, PartnershipsGallery } from '@/components/portfolio'
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'
import { usePublicGallery } from '@/composables/usePublicGallery'
import { applySeo } from '@/seo'

const route = useRoute()
const { data, isPending } = usePublicGallery()

const screen = computed(() => {
  const screenId = String(route.params.screenId || '')
  return (data.value?.screens || []).find((item) => item.id === screenId) || null
})

const layout = computed(() =>
  screen.value?.kind === 'partnerships' ? PartnershipsLayout : PortfolioLayout
)

const images = computed(() =>
  (screen.value?.photos || []).map((photo) => ({
    id: photo.id,
    src: photo.url,
    alt: photo.alt || '',
    type: photo.contentType || 'image/jpeg'
  }))
)

const partnerships = ref([])

function buildPartnerships(current, expandedByName = new Map()) {
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
        isExpanded: expandedByName.get(group.name) ?? false
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
  screen,
  (current) => {
    if (!current) {
      document.title = 'Tela não encontrada · Mundo de Miriam'
      return
    }

    const expandedByName = new Map(partnerships.value.map((item) => [item.name, item.isExpanded]))
    partnerships.value = buildPartnerships(current, expandedByName)

    applySeo(route.path, {
      label: current.name,
      title: `${current.name} · Mundo de Miriam`,
      heading: current.name,
      description: current.description || ''
    })
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
  display: grid;
  justify-items: center;
  gap: 0.6rem;
  text-align: center;
  padding-right: 7rem;
}

.gallery-pending .portfolio-header {
  margin-bottom: 2rem;
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
