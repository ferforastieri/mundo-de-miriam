<template>
  <div class="admin-stat">
    <p class="admin-stat__label">
      <AdminIcon v-if="icon" :name="icon" class="admin-stat__icon" />
      {{ label }}
    </p>
    <p class="admin-stat__value">{{ value }}</p>
    <p v-if="hint" class="admin-stat__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import AdminIcon from './AdminIcon.vue'

defineProps({
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  value: { type: [String, Number], default: '—' },
  hint: { type: String, default: '' }
})
</script>
