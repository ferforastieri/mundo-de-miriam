<template>
  <div>
    <header class="admin-page-header">
      <div>
        <h1 class="admin-title">Fotos</h1>
        <p class="admin-subtitle">
          Envie, substitua, oculte e reordene as fotos de cada tela do site. A ordem abaixo é a ordem exibida
          para as visitantes.
        </p>
      </div>

      <div class="admin-actions-row">
        <span v-if="selectedScreen" class="admin-muted">
          {{ localPhotos.length }} foto{{ localPhotos.length === 1 ? '' : 's' }}
          <template v-if="totalBytes"> · {{ formatBytes(totalBytes) }}</template>
        </span>
      </div>
    </header>

    <div v-if="screensPending" class="admin-card">
      <p class="admin-empty">Carregando telas…</p>
    </div>

    <div v-else-if="screensIsError" class="admin-alert admin-alert--error">
      {{ screensError?.message || 'Não foi possível carregar as telas.' }}
    </div>

    <template v-else>
      <nav class="admin-tabs" aria-label="Telas do site">
        <button
          v-for="screen in screens"
          :key="screen.id"
          class="admin-tab"
          :class="{ 'admin-tab--active': screen.id === selectedScreenId }"
          type="button"
          @click="selectScreen(screen.id)"
        >
          {{ screen.name }}
          <span class="admin-tab__count">{{ screen.photoCount }}</span>
        </button>
      </nav>

      <section v-if="isPartnerships" class="admin-card partnerships-bar">
        <div class="partnerships-bar__groups">
          <button
            v-for="group in groups"
            :key="group.id"
            class="admin-tab"
            :class="{ 'admin-tab--active': group.id === selectedGroupId }"
            type="button"
            @click="selectGroup(group.id)"
          >
            {{ group.name }}
            <span class="admin-tab__count">{{ group.photoCount }}</span>
          </button>

          <span v-if="groups.length === 0" class="admin-muted">
            Nenhuma marca cadastrada. Crie a primeira para começar.
          </span>
        </div>

        <form v-if="showGroupForm" class="partnerships-bar__form" @submit.prevent="createGroup">
          <input
            v-model="newGroupName"
            class="admin-input"
            maxlength="60"
            placeholder="Nome da marca/parceria"
            required
          />
          <button class="admin-btn admin-btn--primary" type="submit" :disabled="creatingGroup">
            {{ creatingGroup ? 'Criando…' : 'Criar marca' }}
          </button>
          <button class="admin-btn" type="button" :disabled="creatingGroup" @click="cancelGroupForm">
            Cancelar
          </button>
        </form>

        <button v-else class="admin-btn admin-btn--small" type="button" @click="showGroupForm = true">
          + Nova marca
        </button>
      </section>

      <div v-if="selectedScreen" class="photos-workspace">
        <UploadDropzone
          :busy="uploading"
          :disabled="!canUpload"
          :uploading-names="uploadingNames"
          :hint="uploadHint"
          @files="handleFiles"
        />

        <p v-if="isPartnerships && !selectedGroupId" class="admin-alert">
          Selecione ou crie uma marca acima para enviar e organizar as fotos desta parceria.
        </p>

        <div v-if="photosEnabled">
          <div v-if="photosPending" class="admin-card">
            <p class="admin-empty">Carregando fotos…</p>
          </div>

          <div v-else-if="photosIsError" class="admin-alert admin-alert--error">
            {{ photosError?.message || 'Não foi possível carregar as fotos.' }}
          </div>

          <div v-else-if="localPhotos.length === 0" class="admin-card">
            <p class="admin-empty">
              Nenhuma foto nesta tela ainda. Envie a primeira usando a área acima.
            </p>
          </div>

          <div v-else class="photos-grid">
          <article
            v-for="(photo, index) in localPhotos"
            :key="photo.id"
            class="photo-card"
            :class="{
              'photo-card--dragging': dragIndex === index,
              'photo-card--hidden': !photo.visible
            }"
            draggable="true"
            @dragstart="dragIndex = index"
            @dragover.prevent
            @drop.prevent="handleDrop(index)"
            @dragend="dragIndex = null"
          >
            <div class="photo-card__media">
              <img :src="photo.url" :alt="photo.alt || ''" loading="lazy" draggable="false" />

              <span class="photo-card__position" :title="`Posição ${index + 1}`">{{ index + 1 }}</span>

              <div class="photo-card__badges">
                <span v-if="!photo.visible" class="photo-card__badge">Oculta</span>
                <span v-if="photo.featured" class="photo-card__badge photo-card__badge--featured">Capa</span>
              </div>

              <span class="photo-card__handle" title="Arraste para reordenar" aria-hidden="true">⠿</span>
            </div>

            <div class="photo-card__body">
              <p class="photo-card__alt">{{ photo.alt || 'Sem descrição' }}</p>
              <p class="photo-card__meta">{{ formatBytes(photo.bytes) }}</p>

              <div class="photo-card__actions">
                <button class="admin-btn admin-btn--small" type="button" @click="openEdit(photo)">
                  Editar
                </button>
                <button class="admin-btn admin-btn--small" type="button" @click="chooseReplacement(photo)">
                  Substituir
                </button>
                <button class="admin-btn admin-btn--small" type="button" @click="toggleVisible(photo)">
                  {{ photo.visible ? 'Ocultar' : 'Mostrar' }}
                </button>
                <button
                  v-if="photo.groupId"
                  class="admin-btn admin-btn--small"
                  type="button"
                  @click="toggleFeatured(photo)"
                >
                  {{ photo.featured ? 'Remover capa' : 'Definir capa' }}
                </button>
                <button class="admin-btn admin-btn--small admin-btn--danger" type="button" @click="askDelete(photo)">
                  Excluir
                </button>
              </div>
            </div>
          </article>
        </div>
        </div>

        <p v-if="orderSaving" class="admin-muted photos-order-status">Salvando nova ordem…</p>
      </div>

      <p v-else class="admin-card admin-empty">Selecione uma tela para gerenciar as fotos.</p>
    </template>

    <PhotoEditModal
      :open="Boolean(editingPhoto)"
      :photo="editingPhoto"
      :screens="screens"
      :loading="editLoading"
      @save="savePhoto"
      @cancel="editingPhoto = null"
    />

    <ConfirmDialog
      :open="Boolean(photoToDelete)"
      title="Excluir foto"
      :message="photoToDelete ? `A foto “${photoToDelete.alt || 'sem descrição'}” será removida do site e do armazenamento. Essa ação não pode ser desfeita.` : ''"
      confirm-label="Excluir foto"
      :loading="deleting"
      danger
      @confirm="confirmDelete"
      @cancel="photoToDelete = null"
    />

    <input
      ref="replaceInput"
      class="admin-sr-only"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
      @change="handleReplacement"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import { useAdminToast } from '@/composables/useAdminToast'
import UploadDropzone from '@/components/admin/UploadDropzone.vue'
import PhotoEditModal from '@/components/admin/PhotoEditModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import { formatBytes } from '@/utils/format.js'

const MAX_FILE_BYTES = 20 * 1024 * 1024

const route = useRoute()
const router = useRouter()
const toast = useAdminToast()

const {
  data: screensData,
  isPending: screensPending,
  isError: screensIsError,
  error: screensError,
  refetch: refetchScreens
} = useQuery({
  queryKey: ['admin-screens'],
  queryFn: () => adminService.getScreens()
})

const screens = computed(() => screensData.value?.screens || [])

const selectedScreenId = ref(typeof route.query.screen === 'string' ? route.query.screen : '')
const selectedGroupId = ref(typeof route.query.group === 'string' ? route.query.group : '')

const selectedScreen = computed(() =>
  screens.value.find((screen) => screen.id === selectedScreenId.value) || null
)
const groups = computed(() => selectedScreen.value?.groups || [])
const isPartnerships = computed(() => selectedScreen.value?.kind === 'partnerships')
const canUpload = computed(() =>
  Boolean(selectedScreen.value) && (!isPartnerships.value || Boolean(selectedGroupId.value))
)

watch(
  screens,
  (list) => {
    if (list.length === 0) return

    if (!list.some((screen) => screen.id === selectedScreenId.value)) {
      const preferred = list.find((screen) => screen.id === 'beauty') || list[0]
      selectedScreenId.value = preferred.id
    }
  },
  { immediate: true }
)

watch(
  [selectedScreen, groups],
  () => {
    if (!selectedScreen.value) return

    if (selectedScreen.value.kind !== 'partnerships') {
      selectedGroupId.value = ''
      return
    }

    if (!groups.value.some((group) => group.id === selectedGroupId.value)) {
      selectedGroupId.value = groups.value[0]?.id || ''
    }
  },
  { immediate: true }
)

watch(
  [selectedScreenId, selectedGroupId],
  ([screenId, groupId]) => {
    const query = {}
    if (screenId) query.screen = screenId
    if (groupId) query.group = groupId
    router.replace({ query })
  },
  { flush: 'post' }
)

const photosEnabled = computed(() =>
  Boolean(selectedScreenId.value) && (!isPartnerships.value || Boolean(selectedGroupId.value))
)

const {
  data: photosData,
  isPending: photosPending,
  isError: photosIsError,
  error: photosError,
  refetch: refetchPhotos
} = useQuery({
  queryKey: ['admin-photos', selectedScreenId, selectedGroupId],
  queryFn: () => adminService.getPhotos(selectedScreenId.value, selectedGroupId.value || null),
  enabled: photosEnabled
})

const localPhotos = ref([])

watch(
  () => photosData.value,
  (payload) => {
    localPhotos.value = payload?.photos ? [...payload.photos] : []
  },
  { immediate: true }
)

watch([selectedScreenId, selectedGroupId], () => {
  localPhotos.value = []
})

const totalBytes = computed(() =>
  localPhotos.value.reduce((total, photo) => total + Number(photo.bytes || 0), 0)
)

const uploadHint = computed(() => {
  if (isPartnerships.value && selectedGroupId.value) {
    const group = groups.value.find((item) => item.id === selectedGroupId.value)
    return `Enviando para a marca ${group?.name || ''} · JPEG, PNG, WebP, GIF ou AVIF · até 20 MB`
  }

  return 'JPEG, PNG, WebP, GIF ou AVIF · até 20 MB por foto'
})

function selectScreen(screenId) {
  selectedScreenId.value = screenId
  selectedGroupId.value = ''
}

function selectGroup(groupId) {
  selectedGroupId.value = groupId
}

const uploading = ref(false)
const uploadingNames = ref([])

async function handleFiles(files) {
  if (!selectedScreen.value || !canUpload.value) {
    toast.error('Selecione uma tela e uma marca antes de enviar.')
    return
  }

  uploading.value = true
  uploadingNames.value = files.map((file) => file.name)
  let successCount = 0

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`${file.name}: a imagem deve ter no máximo 20 MB.`)
      continue
    }

    try {
      await adminService.uploadPhoto({
        screenId: selectedScreenId.value,
        groupId: selectedGroupId.value || null,
        file
      })
      successCount += 1
    } catch (error) {
      toast.error(`${file.name}: ${error.message || 'falha no envio.'}`)
    }
  }

  uploading.value = false
  uploadingNames.value = []

  if (successCount > 0) {
    toast.success(`${successCount} foto${successCount === 1 ? '' : 's'} enviada${successCount === 1 ? '' : 's'}.`)
    await Promise.all([refetchPhotos(), refetchScreens()])
  }
}

const dragIndex = ref(null)
const orderSaving = ref(false)

async function handleDrop(targetIndex) {
  const sourceIndex = dragIndex.value
  dragIndex.value = null

  if (sourceIndex === null || sourceIndex === targetIndex) return

  const items = [...localPhotos.value]
  const [moved] = items.splice(sourceIndex, 1)
  items.splice(targetIndex, 0, moved)
  localPhotos.value = items

  await persistOrder()
}

async function persistOrder() {
  orderSaving.value = true

  try {
    await adminService.reorderPhotos({
      screenId: selectedScreenId.value,
      groupId: selectedGroupId.value || null,
      orderedIds: localPhotos.value.map((photo) => photo.id)
    })
    toast.success('Ordem atualizada.')
    await refetchPhotos()
  } catch (error) {
    toast.error(error.message || 'Não foi possível salvar a ordem.')
    await refetchPhotos()
  } finally {
    orderSaving.value = false
  }
}

const editingPhoto = ref(null)
const editLoading = ref(false)

function openEdit(photo) {
  editingPhoto.value = photo
}

async function savePhoto(patch) {
  if (!editingPhoto.value) return

  editLoading.value = true

  try {
    await adminService.updatePhoto(editingPhoto.value.id, patch)
    toast.success('Foto atualizada.')
    editingPhoto.value = null
    await Promise.all([refetchPhotos(), refetchScreens()])
  } catch (error) {
    toast.error(error.message || 'Não foi possível atualizar a foto.')
  } finally {
    editLoading.value = false
  }
}

async function toggleVisible(photo) {
  try {
    await adminService.updatePhoto(photo.id, { visible: !photo.visible })
    toast.success(photo.visible ? 'Foto ocultada.' : 'Foto publicada.')
    await Promise.all([refetchPhotos(), refetchScreens()])
  } catch (error) {
    toast.error(error.message || 'Não foi possível alterar a visibilidade.')
  }
}

async function toggleFeatured(photo) {
  try {
    await adminService.updatePhoto(photo.id, { featured: !photo.featured })
    toast.success(photo.featured ? 'Capa removida.' : 'Capa definida.')
    await refetchPhotos()
  } catch (error) {
    toast.error(error.message || 'Não foi possível alterar a capa.')
  }
}

const photoToDelete = ref(null)
const deleting = ref(false)

function askDelete(photo) {
  photoToDelete.value = photo
}

async function confirmDelete() {
  if (!photoToDelete.value) return

  deleting.value = true

  try {
    await adminService.deletePhoto(photoToDelete.value.id)
    toast.success('Foto excluída.')
    photoToDelete.value = null
    await Promise.all([refetchPhotos(), refetchScreens()])
  } catch (error) {
    toast.error(error.message || 'Não foi possível excluir a foto.')
  } finally {
    deleting.value = false
  }
}

const replaceInput = ref(null)
const photoToReplace = ref(null)

function chooseReplacement(photo) {
  photoToReplace.value = photo
  replaceInput.value?.click()
}

async function handleReplacement(event) {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file || !photoToReplace.value) return

  if (file.size > MAX_FILE_BYTES) {
    toast.error('A imagem deve ter no máximo 20 MB.')
    return
  }

  try {
    await adminService.replacePhotoFile(photoToReplace.value.id, file)
    toast.success('Arquivo substituído.')
    photoToReplace.value = null
    await refetchPhotos()
  } catch (error) {
    toast.error(error.message || 'Não foi possível substituir o arquivo.')
  }
}

const showGroupForm = ref(false)
const newGroupName = ref('')
const creatingGroup = ref(false)

function cancelGroupForm() {
  showGroupForm.value = false
  newGroupName.value = ''
}

async function createGroup() {
  const name = newGroupName.value.trim()
  if (!name) return

  creatingGroup.value = true

  try {
    const created = await adminService.createGroup(selectedScreenId.value, name)
    toast.success('Marca criada.')
    cancelGroupForm()
    const result = await refetchScreens()
    const newGroup = (result.data?.screens || [])
      .flatMap((screen) => screen.groups || [])
      .find((group) => group.id === created.id)

    selectedGroupId.value = newGroup?.id || created.id
  } catch (error) {
    toast.error(error.message || 'Não foi possível criar a marca.')
  } finally {
    creatingGroup.value = false
  }
}
</script>

<style scoped>
.partnerships-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.9rem;
  padding: 0.85rem;
}

.partnerships-bar__groups {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.partnerships-bar__form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  width: min(520px, 100%);
}

.partnerships-bar__form .admin-input {
  flex: 1;
  min-width: 180px;
}

.photos-workspace {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 0.9rem;
}

.photo-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.photo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.09);
}

.photo-card--dragging {
  opacity: 0.55;
}

.photo-card--hidden .photo-card__media img {
  opacity: 0.55;
}

.photo-card__media {
  position: relative;
  aspect-ratio: 1;
  background: var(--surface-muted);
}

.photo-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-card__position {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.68);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
}

.photo-card__badges {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: grid;
  gap: 0.25rem;
  justify-items: end;
}

.photo-card__badge {
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.68);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.photo-card__badge--featured {
  background: #552200;
}

.photo-card__handle {
  position: absolute;
  bottom: 0.45rem;
  left: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
  line-height: 1;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  cursor: grab;
}

.photo-card__body {
  padding: 0.65rem;
}

.photo-card__alt {
  overflow: hidden;
  margin: 0;
  color: var(--text);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-card__meta {
  margin: 0.2rem 0 0.5rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
}

.photo-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.photos-order-status {
  margin: 0;
}

@media (max-width: 560px) {
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
