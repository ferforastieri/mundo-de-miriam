<template>
  <a
    href="https://mimelie.com"
    class="mimelie-button"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visitar o site oficial da Mimelie"
  >
    <span class="mimelie-button__logo">
      <SkeletonBlock v-if="isPending" circle height="100%" />
      <img v-else-if="mimelieSymbol" :src="mimelieSymbol" alt="" />
    </span>

    <span class="mimelie-button__label">MIMELIE</span>
  </a>
</template>

<script setup>
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'
import { usePublicGallery, useSitePhoto } from '@/composables/usePublicGallery'

const mimelieSymbol = useSitePhoto('mimelie')
const { isPending } = usePublicGallery()
</script>

<style scoped>
.mimelie-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  margin: 0 0 12px;
  padding: 12px 20px;
  border: 2px solid #542a30;
  border-radius: 8px;
  background: #fbebdc;
  color: #542a30;
  font-family: 'Gilda Display', serif;
  font-size: 15px;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.mimelie-button:hover {
  border-color: #542a30;
  background: #542a30;
  color: #fff8f3;
  transform: translateY(-2px);
}

.mimelie-button__logo {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 50%;
  background: #fff7ef;
}

.mimelie-button__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mimelie-button__label {
  line-height: 1;
}

:global(html[data-theme="dark"] .mimelie-button) {
  border-color: rgba(241, 184, 134, 0.5);
  background: #3a2227;
  color: #fff8f3;
}

:global(html[data-theme="dark"] .mimelie-button:hover) {
  border-color: #ffc7a5;
  background: #ffc7a5;
  color: #26140a;
}

@media (max-width: 480px) {
  .mimelie-button {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
