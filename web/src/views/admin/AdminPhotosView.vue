<template>
  <div>
    <AdminSkeleton v-if="screensPending" variant="cards" />

    <template v-else>
      <div class="photos-toolbar">
        <label class="admin-field photos-toolbar__field">
          <span class="admin-label">Tela</span>
          <AdminSelect
            :model-value="selectedScreenId"
            :options="screenOptions"
            aria-label="Tela"
            @change="selectScreen"
          />
        </label>

      </div>

      <section v-if="isPartnerships" class="admin-card partnerships-bar">
        <div class="partnerships-bar__groups">
          <label class="admin-field partnerships-bar__field">
            <span class="admin-label">Marca / parceria</span>
            <AdminSelect
              :model-value="selectedGroupId"
              :options="groupOptions"
              aria-label="Marca / parceria"
              @change="selectGroup"
            />
          </label>
        </div>

        <form v-if="showGroupForm" class="partnerships-bar__form" @submit.prevent="createGroup">
          <AdminInput v-model="newGroupName"
            
            maxlength="60"
            placeholder="Nome da marca/parceria"
            required />
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
          :hint="uploadHint"
          @files="handleFiles"
        />

        <section v-if="uploads.length > 0" class="upload-queue">
          <div class="upload-queue__head">
            <strong>{{ uploadSummary.done }} de {{ uploadSummary.total }} arquivo(s) enviados</strong>
            <button v-if="!uploading" class="admin-btn admin-btn--small" type="button" @click="uploads = []">
              Fechar
            </button>
          </div>

          <div
            class="upload-queue__bar"
            role="progressbar"
            :aria-valuenow="uploadProgress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span :style="{ width: `${uploadProgress}%` }"></span>
          </div>

          <ul class="upload-queue__list">
            <li
              v-for="item in uploads"
              :key="item.id"
              class="upload-queue__item"
              :class="`upload-queue__item--${item.status}`"
            >
              <span class="upload-queue__name">{{ item.name }}</span>
              <span class="upload-queue__state">
                <template v-if="item.status === 'queued'">na fila</template>
                <template v-else-if="item.status === 'uploading'">{{ item.progress }}%</template>
                <template v-else-if="item.status === 'done'">enviado</template>
                <template v-else>falhou</template>
              </span>
              <span class="upload-queue__item-bar"><span :style="{ width: `${item.progress}%` }"></span></span>
            </li>
          </ul>
        </section>

        <p v-if="isPartnerships && !selectedGroupId" class="admin-alert">
          Selecione ou crie uma marca acima para enviar e organizar as fotos desta parceria.
        </p>

        <div v-if="photosEnabled">
          <AdminSkeleton v-if="photosPending" variant="photos" :count="9" />

          <div v-else-if="localPhotos.length === 0" class="admin-card">
            <p class="admin-empty">
              Nenhuma foto nesta tela ainda. Envie a primeira usando a área acima.
            </p>
          </div>

          <div v-else class="photos-grid">
          <article
            v-for="(photo, index) in localPhotos"
            :key="photo.id"
            :data-photo-id="photo.id"
            class="photo-card"
            :class="{
              'photo-card--hidden': !photo.visible,
              'photo-card--new': newPhotoIds.includes(photo.id)
            }"
          >
            <div
              class="photo-card__media"
              role="button"
              tabindex="0"
              :aria-label="`Abrir ${photo.alt || 'arquivo'}`"
              @click="openViewer(photo)"
              @keydown.enter.prevent="openViewer(photo)"
            >
              <video
                v-if="isVideoPhoto(photo)"
                :src="photo.url"
                muted
                playsinline
                preload="metadata"
              ></video>
              <img v-else :src="photo.url" :alt="photo.alt || ''" loading="lazy" draggable="false" />

              <span class="photo-card__position" :title="`Posição ${index + 1}`">{{ index + 1 }}</span>

              <div class="photo-card__badges">
                <span v-if="isVideoPhoto(photo)" class="photo-card__badge">Vídeo</span>
                <span v-if="!photo.visible" class="photo-card__badge">Oculta</span>
                <span v-if="photo.featured" class="photo-card__badge photo-card__badge--featured">Capa</span>
              </div>

            </div>

            <div class="photo-card__body">
              <p class="photo-card__alt">{{ photo.alt || 'Sem descrição' }}</p>
              <p class="photo-card__meta">{{ formatBytes(photo.bytes) }}</p>

              <div class="photo-card__actions">
                <div class="photo-card__movers">
                  <button
                    class="admin-btn admin-btn--small"
                    type="button"
                    :disabled="index === 0"
                    title="Mover para cima"
                    @click="movePhoto(index, -1)"
                  >
                    ↑
                  </button>
                  <button
                    class="admin-btn admin-btn--small"
                    type="button"
                    :disabled="index === localPhotos.length - 1"
                    title="Mover para baixo"
                    @click="movePhoto(index, 1)"
                  >
                    ↓
                  </button>
                </div>
                <button class="admin-btn admin-btn--small" type="button" @click="openEdit(photo)">
                  Editar
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


    <MediaLightbox
      :open="Boolean(viewerPhoto)"
      :src="viewerPhoto?.url || ''"
      :type="viewerPhoto?.contentType || ''"
      :alt="viewerPhoto?.alt || ''"
      :counter="`${viewerIndex + 1} / ${localPhotos.length}`"
      :has-prev="viewerIndex > 0"
      :has-next="viewerIndex >= 0 && viewerIndex < localPhotos.length - 1"
      @close="closeViewer"
      @prev="prevViewer"
      @next="nextViewer"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import { useAdminToast } from '@/composables/useAdminToast'
import { useErrorToast } from '@/composables/useErrorToast'
import { UploadDropzone } from '@/components/common'
import MediaLightbox from '@/components/common/MediaLightbox.vue'
import AdminSelect from '@/components/admin/AdminSelect.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import PaginationBar from '@/components/admin/PaginationBar.vue'
import PhotoEditModal from '@/components/admin/PhotoEditModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import { formatBytes } from '@/utils/format.js'
import AdminInput from '@/components/admin/AdminInput.vue'

const MAX_FILE_BYTES = 20 * 1024 * 1024
const MAX_VIDEO_FILE_BYTES = 50 * 1024 * 1024

function isVideoPhoto(photo) {
  return String(photo?.contentType || '').startsWith('video/')
}

function fileSizeLimit(file) {
  return String(file?.type || '').startsWith('video/') ? MAX_VIDEO_FILE_BYTES : MAX_FILE_BYTES
}

const route = useRoute()
const router = useRouter()
const toast = useAdminToast()
const queryClient = useQueryClient()

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

const screenOptions = computed(() =>
  screens.value.map((screen) => ({
    value: screen.id,
    label: `${screen.name} (${screen.photoCount})`
  }))
)

const page = ref(1)
const selectedScreenId = ref(typeof route.query.screen === 'string' ? route.query.screen : '')
const selectedGroupId = ref(typeof route.query.group === 'string' ? route.query.group : '')

const selectedScreen = computed(() =>
  screens.value.find((screen) => screen.id === selectedScreenId.value) || null
)
const groups = computed(() => selectedScreen.value?.groups || [])

const groupOptions = computed(() =>
  groups.value.length > 0
    ? groups.value.map((group) => ({
        value: group.id,
        label: `${group.name} (${group.photoCount})`
      }))
    : [{ value: '', label: 'Nenhuma marca cadastrada' }]
)
const isPartnerships = computed(() => selectedScreen.value?.kind === 'partnerships')
const canUpload = computed(() =>
  Boolean(selectedScreen.value) && (!isPartnerships.value || Boolean(selectedGroupId.value))
)

watch(
  screens,
  (list) => {
    if (list.length === 0) return

    if (!list.some((screen) => screen.id === selectedScreenId.value)) {
      const preferred = list[0]
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
  queryKey: ['admin-photos', selectedScreenId, selectedGroupId, page],
  queryFn: () =>
    adminService.getPhotos(selectedScreenId.value, selectedGroupId.value || null, page.value, 60),
  enabled: photosEnabled
})

const photosPagination = computed(() => photosData.value?.pagination || null)

useErrorToast(screensError, 'Não foi possível carregar as telas.')
useErrorToast(photosError, 'Não foi possível carregar as fotos.')

const localPhotos = ref([])

watch(
  () => photosData.value,
  (payload) => {
    localPhotos.value = payload?.photos ? [...payload.photos] : []
  },
  { immediate: true }
)

watch([selectedScreenId, selectedGroupId], () => {
  page.value = 1
  localPhotos.value = []
})

const totalBytes = computed(() =>
  localPhotos.value.reduce((total, photo) => total + Number(photo.bytes || 0), 0)
)

const uploadHint = computed(() => {
  if (isPartnerships.value && selectedGroupId.value) {
    const group = groups.value.find((item) => item.id === selectedGroupId.value)
    return `Enviando para a marca ${group?.name || ''} · imagens até 20 MB ou vídeos até 50 MB`
  }

  return 'Imagens até 20 MB · vídeos (MP4, WebM, MOV) até 50 MB'
})

function selectScreen(screenId) {
  selectedScreenId.value = screenId
  selectedGroupId.value = ''
}

function selectGroup(groupId) {
  selectedGroupId.value = groupId
}

const uploads = ref([])
const uploading = computed(() =>
  uploads.value.some((item) => item.status === 'queued' || item.status === 'uploading')
)

const uploadSummary = computed(() => ({
  done: uploads.value.filter((item) => item.status === 'done').length,
  total: uploads.value.length
}))

const uploadProgress = computed(() => {
  if (uploads.value.length === 0) return 0
  const total = uploads.value.reduce((sum, item) => sum + Number(item.progress || 0), 0)
  return Math.round(total / uploads.value.length)
})

async function handleFiles(files) {
  if (!selectedScreen.value || !canUpload.value) {
    toast.error('Selecione uma tela e uma marca antes de enviar.')
    return
  }

  const queue = []

  for (const file of files) {
    if (file.size > fileSizeLimit(file)) {
      toast.error(
        `${file.name}: ${String(file.type).startsWith('video/') ? 'o vídeo deve ter no máximo 50 MB.' : 'a imagem deve ter no máximo 20 MB.'}`
      )
      continue
    }

    queue.push({
      id: `${Date.now()}-${queue.length}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      type: file.type,
      file,
      progress: 0,
      status: 'queued',
      error: null
    })
  }

  if (queue.length === 0) return

  uploads.value = queue
  const targetScreenId = selectedScreenId.value
  const targetGroupId = selectedGroupId.value || null
  const createdIds = []
  let successCount = 0
  let cursor = 0

  async function worker() {
    while (cursor < queue.length) {
      const item = queue[cursor]
      cursor += 1
      item.status = 'uploading'

      try {
        const created = await adminService.uploadPhoto({
          screenId: targetScreenId,
          groupId: targetGroupId,
          file: item.file,
          onProgress: (fraction) => {
            item.progress = Math.max(1, Math.min(99, Math.round(fraction * 100)))
          }
        })
        if (created?.id) createdIds.push(created.id)
        item.progress = 100
        item.status = 'done'
        successCount += 1
      } catch (error) {
        item.progress = 100
        item.status = 'error'
        item.error = error.message || 'falha no envio'
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(2, queue.length) }, () => worker())
  )

  if (successCount > 0) {
    toast.success(
      `${successCount} arquivo${successCount === 1 ? '' : 's'} enviado${successCount === 1 ? '' : 's'}.`
    )

    queryClient.invalidateQueries({ queryKey: ['admin-photos'] })
    await Promise.all([refetchPhotos(), refetchScreens()])
    await nextTick()

    newPhotoIds.value = createdIds
    const firstId = createdIds[0]

    if (firstId) {
      document
        .querySelector(`[data-photo-id="${firstId}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    setTimeout(() => {
      newPhotoIds.value = []
    }, 5000)
  }

  const failures = queue.filter((item) => item.status === 'error')

  if (failures.length > 0) {
    toast.error(
      `${failures.length} arquivo${failures.length === 1 ? '' : 's'} não pôde${failures.length === 1 ? '' : 'ram'} ser enviado${failures.length === 1 ? '' : 's'}.`
    )
  }
}

const orderSaving = ref(false)
const newPhotoIds = ref([])
const viewerPhoto = ref(null)
const viewerIndex = computed(() =>
  localPhotos.value.findIndex((photo) => photo.id === viewerPhoto.value?.id)
)

function openViewer(photo) {
  viewerPhoto.value = photo
}

function closeViewer() {
  viewerPhoto.value = null
}

function prevViewer() {
  if (viewerIndex.value > 0) viewerPhoto.value = localPhotos.value[viewerIndex.value - 1]
}

function nextViewer() {
  if (viewerIndex.value >= 0 && viewerIndex.value < localPhotos.value.length - 1) {
    viewerPhoto.value = localPhotos.value[viewerIndex.value + 1]
  }
}

async function movePhoto(index, direction) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= localPhotos.value.length) return

  const items = [...localPhotos.value]
  const [moved] = items.splice(index, 1)
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

.upload-queue {
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
}

.upload-queue__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
}

.upload-queue__bar {
  height: 8px;
  border-radius: 999px;
  background: var(--surface-muted);
  overflow: hidden;
}

.upload-queue__bar > span {
  display: block;
  height: 100%;
  background: var(--primary);
  transition: width 0.2s ease;
}

.upload-queue__list {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  max-height: 190px;
  overflow-y: auto;
  list-style: none;
}

.upload-queue__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.15rem 0.6rem;
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
}

.upload-queue__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
}

.upload-queue__state {
  color: var(--muted);
}

.upload-queue__item--done .upload-queue__state {
  color: #2f6f4f;
}

.upload-queue__item--error .upload-queue__state {
  color: #b42318;
}

.upload-queue__item-bar {
  grid-column: 1 / -1;
  height: 4px;
  border-radius: 999px;
  background: var(--surface-muted);
  overflow: hidden;
}

.upload-queue__item-bar > span {
  display: block;
  height: 100%;
  background: var(--primary);
  transition: width 0.2s ease;
}

.upload-queue__item--done .upload-queue__item-bar > span {
  background: #2f6f4f;
}

.upload-queue__item--error .upload-queue__item-bar > span {
  background: #b42318;
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

.photo-card__media img,
.photo-card__media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
