<template>
  <span class="brand-mark" aria-hidden="true">
    <img src="/pwa-icon-maskable-192.png" alt="" />
  </span>
</template>

<style scoped>
.brand-mark {
  display: inline-grid;
  place-items: center;
  width: var(--mark-size, 40px);
  height: var(--mark-size, 40px);
  flex: 0 0 auto;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.brand-mark img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
}
</style>
