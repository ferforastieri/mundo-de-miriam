<template>
  <div class="admin-skeleton" :class="`admin-skeleton--${variant}`" aria-hidden="true">
    <template v-if="variant === 'dashboard'">
      <div class="admin-skeleton__grid">
        <div class="admin-skeleton__card">
          <SkeletonBlock width="38%" height="1.1rem" />
          <SkeletonBlock width="55%" height="0.72rem" />
          <div class="admin-skeleton__tiles">
            <SkeletonBlock v-for="n in 4" :key="n" height="76px" radius="12px" />
          </div>
          <SkeletonBlock height="200px" radius="14px" />
        </div>

        <div class="admin-skeleton__card">
          <SkeletonBlock width="34%" height="1.1rem" />
          <SkeletonBlock width="60%" height="0.72rem" />
          <div class="admin-skeleton__tiles">
            <SkeletonBlock v-for="n in 3" :key="n" height="76px" radius="12px" />
          </div>
          <div class="admin-skeleton__rows">
            <SkeletonBlock v-for="n in 6" :key="n" height="0.85rem" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'stats'">
      <div class="admin-skeleton__card">
        <SkeletonBlock width="30%" height="1.15rem" />
        <SkeletonBlock width="44%" height="0.72rem" />
        <div class="admin-skeleton__tiles">
          <SkeletonBlock v-for="n in 8" :key="n" height="92px" radius="12px" />
        </div>
      </div>

      <div class="admin-skeleton__card">
        <SkeletonBlock width="26%" height="1.05rem" />
        <div class="admin-skeleton__grid admin-skeleton__grid--charts">
          <SkeletonBlock v-for="n in 4" :key="n" height="170px" radius="14px" />
        </div>
      </div>

      <div class="admin-skeleton__card">
        <SkeletonBlock width="28%" height="1.05rem" />
        <div class="admin-skeleton__rows">
          <SkeletonBlock v-for="n in 5" :key="n" height="0.85rem" />
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'cards'">
      <div v-for="n in count" :key="n" class="admin-skeleton__card">
        <SkeletonBlock width="30%" height="1.15rem" />
        <SkeletonBlock width="46%" height="0.72rem" />
        <SkeletonBlock height="42px" radius="10px" />
        <SkeletonBlock height="42px" radius="10px" />
        <div class="admin-skeleton__rows admin-skeleton__rows--inline">
          <SkeletonBlock width="45%" height="36px" radius="10px" />
          <SkeletonBlock width="90px" height="36px" radius="10px" />
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'photos'">
      <div class="admin-skeleton__photos">
        <SkeletonBlock v-for="n in count" :key="n" height="132px" radius="14px" />
      </div>
    </template>

    <template v-else>
      <div class="admin-skeleton__card">
        <SkeletonBlock width="34%" height="1.1rem" />
        <SkeletonBlock width="52%" height="0.72rem" />
        <div class="admin-skeleton__rows">
          <SkeletonBlock v-for="n in 4" :key="n" height="42px" radius="10px" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'

defineProps({
  variant: { type: String, default: 'page' },
  count: { type: Number, default: 2 }
})
</script>

<style scoped>
.admin-skeleton {
  display: grid;
  gap: 1rem;
}

.admin-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: start;
  gap: 1rem;
}

.admin-skeleton__grid--charts {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.admin-skeleton__card {
  display: grid;
  gap: 0.8rem;
  padding: 1.35rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
}

.admin-skeleton__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.admin-skeleton__rows {
  display: grid;
  gap: 0.6rem;
}

.admin-skeleton__rows--inline {
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
}

.admin-skeleton__photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.9rem;
}

@media (max-width: 640px) {
  .admin-skeleton__photos {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
}
</style>
