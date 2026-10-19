<template>
  <div class="admin-toasts" aria-live="polite">
    <TransitionGroup name="admin-toast">
      <div
        v-for="item in toast.state.items"
        :key="item.id"
        class="admin-toast"
        :class="`admin-toast--${item.type}`"
        role="status"
      >
        <span class="admin-toast__icon" aria-hidden="true">
          <AdminIcon :name="item.type === 'success' ? 'check' : 'alert'" />
        </span>

        <p class="admin-toast__message">{{ item.message }}</p>

        <button
          class="admin-toast__close"
          type="button"
          aria-label="Fechar aviso"
          @click="toast.remove(item.id)"
        >
          <AdminIcon name="close" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import AdminIcon from './AdminIcon.vue'
import { useAdminToast } from '@/composables/useAdminToast'

const toast = useAdminToast()
</script>
