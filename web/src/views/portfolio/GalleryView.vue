<template>
  <component :is="layout">
    <div class="portfolio-container">
      <div v-if="isPending && !screen" class="gallery-pending">
        <div class="page-header-skeleton">
          <SkeletonBlock width="110px" height="40px" radius="999px" />
          <div class="page-header-skeleton__copy">
            <SkeletonBlock width="min(240px, 60%)" height="1.6rem" />
            <SkeletonBlock width="min(320px, 80%)" height="0.8rem" />
          </div>
        </div>

        <GallerySkeleton />
      </div>

      <template v-else-if="screen">
        <PageHeaderCard :title="screen.name" :description="screen.description" />

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
import PageHeaderCard from '@/components/common/PageHeaderCard.vue'
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

.page-header-skeleton {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1.25rem;
  padding: 0.9rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
}

.page-header-skeleton__copy {
  display: grid;
  flex: 1;
  gap: 0.4rem;
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

@media (max-width: 560px) {
  .page-header-skeleton {
    gap: 0.7rem;
    padding: 0.8rem 0.9rem;
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
