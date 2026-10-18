<template>
  <div class="admin-stat">
    <p class="admin-stat__label">{{ label }}</p>
    <p class="admin-stat__value">{{ value }}</p>
    <p v-if="hint" class="admin-stat__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '—' },
  hint: { type: String, default: '' }
})
</script>
