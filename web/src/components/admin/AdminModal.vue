<template>
  <Teleport to="body">
    <Transition name="admin-modal-fade">
      <div
        v-if="open"
        class="admin-modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click.self="close"
      >
        <div class="admin-modal" :class="{ 'admin-modal--lg': size === 'lg' }">
          <header class="admin-modal__head">
            <h2 class="admin-modal__title">{{ title }}</h2>
            <button class="admin-modal__close" type="button" aria-label="Fechar" @click="close">
              <AdminIcon name="close" />
            </button>
          </header>

          <div class="admin-modal__content">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="admin-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'
import AdminIcon from './AdminIcon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
