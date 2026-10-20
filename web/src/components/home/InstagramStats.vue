<template>
  <div v-if="isPending && !stats" class="home-card instagram-card" aria-hidden="true">
    <div class="instagram-card__head">
      <SkeletonBlock width="140px" height="1.4rem" />
      <SkeletonBlock width="110px" height="0.8rem" />
    </div>
    <div class="instagram-card__stats">
      <div class="instagram-stat">
        <SkeletonBlock width="110px" height="2.2rem" />
        <SkeletonBlock width="90px" height="0.7rem" />
      </div>
      <div class="instagram-stat">
        <SkeletonBlock width="110px" height="2.2rem" />
        <SkeletonBlock width="90px" height="0.7rem" />
      </div>
    </div>
  </div>

  <a
    v-else-if="stats"
    class="home-card instagram-card"
    href="https://www.instagram.com/mihforastieri/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Abrir o Instagram de Miriam"
    title="Abrir o Instagram"
  >
    <span class="instagram-card__head">
      <span class="instagram-card__brand">
        <span class="instagram-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
            <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span class="instagram-card__handle">@mihforastieri</span>
      </span>

      <span class="instagram-card__action">
        <span>Abrir no Instagram</span>
        <i aria-hidden="true">↗</i>
      </span>
    </span>

    <span class="instagram-card__stats">
      <span class="instagram-stat">
        <strong>{{ formatNumber(stats.followers) }}</strong>
        <span class="instagram-stat__label"><TranslatableText text="Seguidores" /></span>
      </span>

      <span class="instagram-stat">
        <strong>{{ formatNumber(stats.recentViews) }}</strong>
        <span class="instagram-stat__label"><TranslatableText text="Visualizações" /></span>
      </span>
    </span>
  </a>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { TranslatableText } from '../common'
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'
import galleryService from '@/api/gallery/GalleryService.js'

const CACHE_TIME = 15 * 60 * 1000
const CACHE_KEY = 'instagramStatsCache'

function readCachedStats() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return parsed?.available ? parsed : null
  } catch {
    return null
  }
}

const cachedStats = ref(readCachedStats())

const { data, isPending } = useQuery({
  queryKey: ['instagram-stats'],
  queryFn: () => galleryService.getInstagramStats(),
  staleTime: CACHE_TIME,
  gcTime: CACHE_TIME * 2,
  refetchInterval: CACHE_TIME,
  retry: 2,
  initialData: cachedStats.value || undefined,
  initialDataUpdatedAt: 0
})

const stats = computed(() => {
  if (data.value?.available) return data.value
  return cachedStats.value
})

watch(
  () => data.value,
  (current) => {
    if (!current?.available) return

    cachedStats.value = current

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(current))
    } catch {
      // Sem localStorage, os dados continuam vindo da API.
    }
  },
  { immediate: true }
)

function formatNumber(value) {
  if (!Number.isFinite(value)) return '—'

  return new Intl.NumberFormat('pt-BR', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  }).format(value)
}
</script>

<style scoped>
.instagram-card {
  display: grid;
  gap: 0.85rem;
  color: inherit;
  text-decoration: none;
  animation: revealStats 0.55s ease 0.15s backwards;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.instagram-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--border);
}

.instagram-card__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.instagram-card__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 9px;
  background: var(--primary);
  color: var(--on-primary);
}

.instagram-card__icon svg {
  width: 19px;
  height: 19px;
}

.instagram-card__handle {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.74rem;
  letter-spacing: 0.02em;
}

.instagram-card__action {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--primary);
  font-family: system-ui, sans-serif;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  white-space: nowrap;
}

.instagram-card__action i {
  font-size: 0.9rem;
  font-style: normal;
  transition: transform 0.2s ease;
}

a.instagram-card:hover .instagram-card__action i {
  transform: translate(2px, -2px);
}

.instagram-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

a.instagram-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--interactive-shadow);
}

.instagram-stat {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  min-width: 0;
  padding: 0.2rem 0.75rem;
}

.instagram-stat + .instagram-stat {
  border-left: 1px solid var(--border);
}

.instagram-stat strong {
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: clamp(1.8rem, 5vw, 2.4rem);
  font-weight: normal;
  line-height: 1;
  letter-spacing: 0.02em;
}

.instagram-stat__label {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@keyframes revealStats {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .instagram-stat {
    padding: 0.15rem 0.5rem;
  }

  .instagram-stat__label {
    font-size: 0.62rem;
  }
}
</style>
