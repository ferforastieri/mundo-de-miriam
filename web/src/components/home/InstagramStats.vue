<template>
  <section v-if="isPending && !stats" class="instagram-card" aria-hidden="true">
    <div class="instagram-stat">
      <SkeletonBlock width="110px" height="2.2rem" />
      <SkeletonBlock width="90px" height="0.7rem" />
    </div>
    <div class="instagram-stat">
      <SkeletonBlock width="110px" height="2.2rem" />
      <SkeletonBlock width="90px" height="0.7rem" />
    </div>
  </section>

  <section v-else-if="stats" class="instagram-card" aria-label="Instagram">
    <div class="instagram-stat">
      <strong>{{ formatNumber(stats.followers) }}</strong>
      <span class="instagram-stat__label"><TranslatableText text="Seguidores" /></span>
    </div>

    <a
      class="instagram-stat instagram-stat--link"
      href="https://www.instagram.com/mihforastieri/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir o Instagram de Miriam"
      title="Abrir o Instagram"
    >
      <strong>{{ formatNumber(stats.recentViews) }}</strong>
      <span class="instagram-stat__label"><TranslatableText text="Visualizações" /></span>
      <span class="instagram-stat__hint">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
          <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
        </svg>
        Ver no Instagram
        <i aria-hidden="true">↗</i>
      </span>
    </a>
  </section>
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 2rem;
  padding: 1.2rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  animation: revealStats 0.55s ease 0.15s backwards;
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

.instagram-stat--link {
  color: inherit;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.instagram-stat--link:hover,
.instagram-stat--link:focus-visible {
  background: var(--surface-muted);
  outline: none;
}

.instagram-stat__hint {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--primary);
  font-family: system-ui, sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.instagram-stat__hint svg {
  width: 13px;
  height: 13px;
}

.instagram-stat__hint i {
  font-size: 0.85rem;
  font-style: normal;
  transition: transform 0.2s ease;
}

.instagram-stat--link:hover .instagram-stat__hint i {
  transform: translate(2px, -2px);
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
  .instagram-card {
    padding: 1rem;
  }

  .instagram-stat {
    padding: 0.15rem 0.5rem;
  }
}
</style>
