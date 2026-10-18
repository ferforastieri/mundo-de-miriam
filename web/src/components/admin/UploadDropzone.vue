<template>
  <div
    class="upload-zone"
    :class="{ 'upload-zone--dragging': dragging, 'upload-zone--disabled': disabled }"
    role="button"
    tabindex="0"
    @click="openPicker"
    @keydown.enter.prevent="openPicker"
    @keydown.space.prevent="openPicker"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="handleDrop"
  >
    <input
      ref="input"
      class="admin-sr-only"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
      multiple
      :disabled="disabled"
      @change="handleChange"
    />

    <span class="upload-zone__icon" aria-hidden="true">+</span>
    <strong class="upload-zone__title">
      {{ busy ? 'Enviando imagens…' : 'Arraste fotos aqui ou clique para escolher' }}
    </strong>
    <span class="upload-zone__hint">{{ hint }}</span>

    <ul v-if="uploadingNames.length" class="upload-zone__list">
      <li v-for="name in uploadingNames" :key="name">{{ name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  hint: { type: String, default: 'JPEG, PNG, WebP, GIF ou AVIF · até 20 MB por foto' },
  uploadingNames: { type: Array, default: () => [] }
})

const emit = defineEmits(['files'])
const input = ref(null)
const dragging = ref(false)

function openPicker() {
  if (props.disabled || props.busy) return
  input.value?.click()
}

function emitFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'))
  if (files.length > 0) emit('files', files)
}

function handleChange(event) {
  emitFiles(event.target.files)
  event.target.value = ''
}

function handleDrop(event) {
  dragging.value = false
  if (props.disabled || props.busy) return
  emitFiles(event.dataTransfer?.files)
}
</script>

<style scoped>
.upload-zone {
  display: grid;
  place-items: center;
  gap: 0.25rem;
  padding: 1.4rem 1rem;
  border: 1.5px dashed var(--border);
  border-radius: 14px;
  background: var(--surface-muted);
  color: var(--text);
  font-family: system-ui, sans-serif;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.upload-zone:hover,
.upload-zone--dragging {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 7%, var(--surface));
}

.upload-zone--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-zone__icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--primary);
  font-size: 1.4rem;
  line-height: 1;
}

.upload-zone__title {
  font-size: 0.9rem;
  font-weight: 700;
}

.upload-zone__hint {
  color: var(--muted);
  font-size: 0.75rem;
}

.upload-zone__list {
  margin: 0.4rem 0 0;
  padding: 0;
  color: var(--muted);
  font-size: 0.72rem;
  list-style: none;
}
</style>
