<template>
  <Teleport to="body">
    <div v-if="open" class="admin-modal-backdrop" @click.self="$emit('cancel')">
      <div class="admin-modal" role="dialog" aria-modal="true" :aria-label="title">
        <h2 class="admin-modal__title">{{ title }}</h2>
        <p class="admin-modal__hint">{{ message }}</p>

        <div class="admin-modal__actions">
          <button class="admin-btn" type="button" :disabled="loading" @click="$emit('cancel')">
            {{ cancelLabel }}
          </button>
          <button
            class="admin-btn"
            :class="danger ? 'admin-btn--danger' : 'admin-btn--primary'"
            type="button"
            :disabled="loading"
            @click="$emit('confirm')"
          >
            {{ loading ? 'Processando…' : confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, default: 'Deseja continuar?' },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  loading: { type: Boolean, default: false },
  danger: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])
</script>
