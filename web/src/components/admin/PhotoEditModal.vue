<template>
  <Teleport to="body">
    <div v-if="open && photo" class="admin-modal-backdrop" @click.self="$emit('cancel')">
      <form class="admin-modal" role="dialog" aria-modal="true" aria-label="Editar foto" @submit.prevent="submit">
        <h2 class="admin-modal__title">Editar foto</h2>
        <p class="admin-modal__hint">
          Ajuste a descrição, a tela, a ordem de exibição e a visibilidade desta imagem.
        </p>

        <div class="photo-edit__preview">
          <img :src="photo.url" :alt="photo.alt || ''" />
          <div class="photo-edit__meta">
            <span class="admin-tag">Posição {{ photo.position }}</span>
            <span class="admin-tag">{{ formatBytes(photo.bytes) }}</span>
            <span v-if="!photo.visible" class="admin-tag admin-tag--warning">Oculta</span>
          </div>
        </div>

        <div class="admin-stack">
          <label class="admin-field">
            <span class="admin-label">Texto alternativo</span>
            <input v-model="form.alt" class="admin-input" maxlength="240" placeholder="Descrição acessível da foto" />
          </label>

          <label class="admin-field">
            <span class="admin-label">Legenda (opcional)</span>
            <textarea v-model="form.caption" class="admin-textarea" maxlength="400" rows="2" />
          </label>

          <div class="photo-edit__row">
            <label class="admin-field">
              <span class="admin-label">Tela</span>
              <AdminSelect
                v-model="form.screenId"
                :options="screenOptions"
                aria-label="Tela"
                @change="handleScreenChange"
              />
            </label>

            <label v-if="targetScreen?.kind === 'partnerships'" class="admin-field">
              <span class="admin-label">Marca / parceria</span>
              <AdminSelect
                v-model="form.groupId"
                :options="groupOptions"
                aria-label="Marca / parceria"
              />
            </label>
          </div>

          <div class="photo-edit__checks">
            <label class="admin-checkbox">
              <input v-model="form.visible" type="checkbox" />
              Exibir no site
            </label>

            <label v-if="form.groupId" class="admin-checkbox">
              <input v-model="form.featured" type="checkbox" />
              Usar como capa da marca
            </label>
          </div>
        </div>

        <div class="admin-modal__actions">
          <button class="admin-btn" type="button" :disabled="loading" @click="$emit('cancel')">Cancelar</button>
          <button class="admin-btn admin-btn--primary" type="submit" :disabled="loading">
            {{ loading ? 'Salvando…' : 'Salvar alterações' }}
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { formatBytes } from '@/utils/format.js'
import AdminSelect from '@/components/admin/AdminSelect.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  photo: { type: Object, default: null },
  screens: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  alt: '',
  caption: '',
  screenId: '',
  groupId: '',
  visible: true,
  featured: false
})

watch(
  () => props.photo,
  (photo) => {
    if (!photo) return

    form.alt = photo.alt || ''
    form.caption = photo.caption || ''
    form.screenId = photo.screenId
    form.groupId = photo.groupId || ''
    form.visible = photo.visible
    form.featured = Boolean(photo.featured)
  },
  { immediate: true }
)

const screenOptions = computed(() =>
  props.screens.map((screen) => ({ value: screen.id, label: screen.name }))
)

const targetScreen = computed(() => props.screens.find((screen) => screen.id === form.screenId) || null)
const targetGroups = computed(() => targetScreen.value?.groups || [])

const groupOptions = computed(() => [
  { value: '', label: 'Selecione…' },
  ...targetGroups.value.map((group) => ({ value: group.id, label: group.name }))
])

function handleScreenChange() {
  form.groupId = ''
  form.featured = false
}

function submit() {
  emit('save', {
    alt: form.alt.trim(),
    caption: form.caption.trim(),
    screenId: form.screenId,
    groupId: form.groupId || null,
    visible: form.visible,
    featured: form.featured
  })
}
</script>

<style scoped>
.photo-edit__preview {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.photo-edit__preview img {
  width: 84px;
  height: 84px;
  border-radius: 10px;
  object-fit: cover;
}

.photo-edit__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.photo-edit__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.photo-edit__checks {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
