<template>
  <a
    href="https://mimelie.com"
    class="home-card mimelie-card"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visitar o site oficial da Mimelie"
  >
    <span class="mimelie-card__logo">
      <SkeletonBlock v-if="isPending" circle height="100%" />
      <img v-else-if="mimelieSymbol" :src="mimelieSymbol" alt="Símbolo da Mimelie" />
    </span>

    <span class="mimelie-card__copy">
      <span class="mimelie-card__eyebrow">Marca autoral</span>
      <span class="mimelie-card__title">Mimelie</span>
      <span class="mimelie-card__text">
        Cílios leves e maquiagem delicada para acompanhar a beleza real.
      </span>
    </span>

    <span class="mimelie-card__action">
      <span class="mimelie-card__action-label">mimelie.com</span>
      <i aria-hidden="true">↗</i>
    </span>
  </a>
</template>

<script setup>
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'
import { usePublicGallery, useSitePhoto } from '@/composables/usePublicGallery'

const mimelieSymbol = useSitePhoto('mimelie')
const { isPending } = usePublicGallery()
</script>

<style scoped>
.mimelie-card {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: center;
  color: inherit;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mimelie-card:hover {
  transform: var(--interactive-lift);
  box-shadow: var(--interactive-shadow);
}

.mimelie-card__logo {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: #fff7ef;
}

.mimelie-card__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mimelie-card__copy {
  display: grid;
  gap: 0.1rem;
  min-width: 0;
}

.mimelie-card__eyebrow {
  color: #9f4d4d;
  font-family: system-ui, sans-serif;
  font-size: 0.6rem;
  font-weight: 750;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mimelie-card__title {
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 1.3rem;
  line-height: 1.1;
  letter-spacing: 0.04em;
}

.mimelie-card__text {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  line-height: 1.45;
}

.mimelie-card__action {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--primary);
  font-family: system-ui, sans-serif;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.mimelie-card__action i {
  font-size: 1rem;
  font-style: normal;
  transition: transform 0.2s ease;
}

.mimelie-card:hover .mimelie-card__action i {
  transform: translate(3px, -3px);
}

:global(html[data-theme="dark"] .mimelie-card__eyebrow) {
  color: #ffc7a5;
}

@media (max-width: 560px) {
  .mimelie-card {
    grid-template-columns: 48px minmax(0, 1fr) auto;
    gap: 0.75rem;
  }

  .mimelie-card__logo {
    width: 48px;
    height: 48px;
    padding: 0.42rem;
  }

  .mimelie-card__title {
    font-size: 1.18rem;
  }

  .mimelie-card__text {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.76rem;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 420px) {
  .mimelie-card__action-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .mimelie-card__action i {
    font-size: 1.1rem;
  }
}
</style>
