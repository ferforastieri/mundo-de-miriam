<template>
  <section class="instagram-stats" aria-labelledby="instagram-stats-title">
    <header class="stats-header">
      <div class="instagram-brand">
        <span class="instagram-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
            <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
          </svg>
        </span>

        <div>
          <p class="eyebrow">@mihforastieri</p>
          <h2 id="instagram-stats-title">
            <TranslatableText text="Instagram em números" />
          </h2>
        </div>
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
  margin: 0 0 2rem;
  padding: 1.1rem 1.25rem;
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
  gap: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(85, 34, 0, 0.22);
}

.instagram-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.instagram-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #fff;
  background: #552200;
  border-radius: 10px;
  box-shadow: 0 5px 12px rgba(85, 34, 0, 0.2);
}

.instagram-icon svg {
  width: 23px;
  height: 23px;
}

.eyebrow {
  margin: 0 0 0.2rem;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: normal;
  letter-spacing: 0.04em;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0;
  color: #552200;
  font-size: 0.76rem;
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
  padding: 0.9rem 0 0.75rem;
}

.stat-item {
  min-width: 0;
  padding: 0 0.7rem;
  border-left: 1px solid rgba(85, 34, 0, 0.16);
}

.stat-item:first-child {
  padding-left: 0;
  border-left: 0;
}

.stat-item strong {
  display: block;
  font-size: clamp(1.25rem, 3.5vw, 1.7rem);
  font-weight: normal;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-item span {
  display: block;
  margin-top: 0.4rem;
  color: #765b4c;
  font-size: 0.64rem;
  line-height: 1.25;
  letter-spacing: 0.06em;
}

.stats-note {
  margin: 0;
  color: #8b7569;
  font-size: 0.66rem;
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
    padding: 1rem;
  }

  .stats-header {
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 1rem;
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
