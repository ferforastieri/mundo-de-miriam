<template>
  <header class="page-header-card">
    <PageBackButton class="page-header-card__back" />

    <div class="page-header-card__copy">
      <h1 class="page-header-card__title">
        <TranslatableText :text="title" />
      </h1>
      <p v-if="description" class="page-header-card__description">
        <TranslatableText :text="description" />
      </p>
      <slot name="meta" />
    </div>
  </header>
</template>

<script setup>
import PageBackButton from './PageBackButton.vue'
import TranslatableText from './TranslatableText.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' }
})
</script>

<style scoped>
.page-header-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  margin: 0 0 1.25rem;
  padding: 0.9rem 1.1rem;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.page-header-card__back {
  flex: 0 0 auto;
}

.page-header-card__copy {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
  padding-top: 0.15rem;
}

.page-header-card__title {
  margin: 0;
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: clamp(1.3rem, 2.6vw, 1.55rem);
  font-weight: normal;
  line-height: 1.15;
  letter-spacing: 0.02em;
}

.page-header-card__description {
  margin: 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.84rem;
  line-height: 1.45;
}

@media (max-width: 560px) {
  .page-header-card {
    gap: 0.7rem;
    padding: 0.8rem 0.9rem;
  }

  .page-header-card__title {
    font-size: 1.18rem;
  }

  .page-header-card__description {
    font-size: 0.78rem;
  }
}
</style>
