<template>
  <a
    href="https://mimelie.com"
    class="mimelie-card"
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
  grid-template-columns: 64px minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  margin: 0 0 2rem;
  padding: 1.2rem 1.25rem;
  overflow: hidden;
  color: #542a30;
  background: #fbebdc;
  border: 1px solid rgba(84, 42, 48, 0.16);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
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
  width: 64px;
  height: 64px;
  padding: 0.55rem;
  border: 1px solid rgba(84, 42, 48, 0.2);
  border-radius: 50%;
  background: #fff7ef;
  box-shadow: 0 8px 18px rgba(84, 42, 48, 0.12);
}

.mimelie-card__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mimelie-card__copy {
  display: grid;
  gap: 0.12rem;
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
  color: #542a30;
  font-family: 'Gilda Display', serif;
  font-size: 1.45rem;
  line-height: 1.1;
  letter-spacing: 0.04em;
}

.mimelie-card__text {
  color: #765052;
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.45;
}

.mimelie-card__action {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #542a30;
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
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

:global(html[data-theme="dark"] .mimelie-card) {
  color: #fff8f3;
  background: #3a2227;
  border-color: rgba(241, 184, 134, 0.3);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
}

:global(html[data-theme="dark"] .mimelie-card__title) {
  color: #ffffff;
}

:global(html[data-theme="dark"] .mimelie-card__text) {
  color: #f7ded4;
}

:global(html[data-theme="dark"] .mimelie-card__eyebrow) {
  color: #ffc7a5;
}

:global(html[data-theme="dark"] .mimelie-card__action) {
  color: #ffffff;
}

@media (max-width: 560px) {
  .mimelie-card {
    grid-template-columns: 52px minmax(0, 1fr) auto;
    gap: 0.8rem;
    padding: 1rem;
  }

  .mimelie-card__logo {
    width: 52px;
    height: 52px;
    padding: 0.45rem;
  }

  .mimelie-card__title {
    font-size: 1.25rem;
  }

  .mimelie-card__text {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.78rem;
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
