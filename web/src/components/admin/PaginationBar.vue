<template>
  <nav v-if="pagination && pagination.totalPages > 1" class="pagination" aria-label="Paginação">
    <span class="pagination__info">
      Página {{ pagination.page }} de {{ pagination.totalPages }}
      <span v-if="label"> · {{ pagination.total }} {{ label }}</span>
    </span>

    <div class="pagination__actions">
      <button
        class="pagination__button"
        type="button"
        :disabled="pagination.page <= 1"
        aria-label="Página anterior"
        @click="go(pagination.page - 1)"
      >
        <AdminIcon name="chevronLeft" />
      </button>
      <button
        class="pagination__button"
        type="button"
        :disabled="pagination.page >= pagination.totalPages"
        aria-label="Próxima página"
        @click="go(pagination.page + 1)"
      >
        <AdminIcon name="chevronRight" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import AdminIcon from './AdminIcon.vue'

const props = defineProps({
  pagination: { type: Object, default: null },
  label: { type: String, default: '' }
})

const emit = defineEmits(['update:page'])

function go(page) {
  if (!props.pagination) return
  if (page < 1 || page > props.pagination.totalPages) return
  emit('update:page', page)
}
</script>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
}

.pagination__info {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
}

.pagination__actions {
  display: flex;
  gap: 0.4rem;
}

.pagination__button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--surface);
  color: var(--primary);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.pagination__button:hover:not(:disabled) {
  background: var(--surface-muted);
}

.pagination__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
