<template>
  <section class="instagram-stats" aria-labelledby="instagram-stats-title">
    <header class="stats-header">
      <div>
        <p class="eyebrow">@mihforastieri</p>
        <h2 id="instagram-stats-title">
          <TranslatableText text="Instagram em números" />
        </h2>
      </div>

      <a
        class="profile-link"
        href="https://www.instagram.com/mihforastieri/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TranslatableText text="Ver perfil" />
        <span aria-hidden="true">↗</span>
      </a>
    </header>

    <div class="stats-grid" aria-live="polite">
      <div v-for="metric in metrics" :key="metric.label" class="stat-item">
        <strong>{{ formatNumber(metric.value) }}</strong>
        <span><TranslatableText :text="metric.label" /></span>
      </div>
    </div>

    <p class="stats-note">
      <TranslatableText text="Visualizações e interações consideram o conteúdo público recente." />
    </p>
  </section>
</template>

<script>
import { TranslatableText } from '../common'

const fallbackStats = {
  followers: 3139,
  posts: 157,
  recentViews: 13838,
  recentInteractions: 1653
}

export default {
  name: 'InstagramStats',
  components: {
    TranslatableText
  },
  data() {
    return {
      stats: fallbackStats
    }
  },
  computed: {
    metrics() {
      return [
        { label: 'Seguidores', value: this.stats.followers },
        { label: 'Publicações', value: this.stats.posts },
        { label: 'Visualizações recentes', value: this.stats.recentViews },
        { label: 'Interações recentes', value: this.stats.recentInteractions }
      ]
    }
  },
  mounted() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const response = await fetch('/api/instagram-stats')
        if (!response.ok) return

        const stats = await response.json()
        if (stats.followers > 0) {
          this.stats = stats
        }
      } catch (error) {
      }
    },
    formatNumber(value) {
      return new Intl.NumberFormat('pt-BR', {
        notation: value >= 10000 ? 'compact' : 'standard',
        maximumFractionDigits: 1
      }).format(value)
    }
  }
}
</script>

<style scoped>
.instagram-stats {
  margin: 0 0 3rem;
  padding: 1.5rem;
  color: #552200;
  background: #fff;
  border: 1px solid rgba(85, 34, 0, 0.16);
  box-shadow: 0 14px 35px rgba(85, 34, 0, 0.08);
  animation: revealStats 0.55s ease 0.15s backwards;
}

.stats-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(85, 34, 0, 0.22);
}

.eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 1.55rem;
  font-weight: normal;
  letter-spacing: 0.04em;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0;
  color: #552200;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.profile-link:hover {
  color: #8a4a24;
}

.profile-link:focus-visible {
  outline: 2px solid #552200;
  outline-offset: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 1.25rem 0 1rem;
}

.stat-item {
  min-width: 0;
  padding: 0 0.85rem;
  border-left: 1px solid rgba(85, 34, 0, 0.16);
}

.stat-item:first-child {
  padding-left: 0;
  border-left: 0;
}

.stat-item strong {
  display: block;
  font-size: clamp(1.35rem, 4vw, 2rem);
  font-weight: normal;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-item span {
  display: block;
  margin-top: 0.55rem;
  color: #765b4c;
  font-size: 0.68rem;
  line-height: 1.25;
  letter-spacing: 0.06em;
}

.stats-note {
  margin: 0;
  color: #8b7569;
  font-size: 0.7rem;
  line-height: 1.45;
}

@keyframes revealStats {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 560px) {
  .instagram-stats {
    padding: 1.25rem;
  }

  .stats-header {
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 1.25rem;
  }

  .stat-item:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .instagram-stats {
    animation: none;
  }
}
</style>
