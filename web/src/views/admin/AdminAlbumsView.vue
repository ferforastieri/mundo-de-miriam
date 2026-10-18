<template>
  <div>
    <header class="admin-page-header">
      <div>
        <h1 class="admin-title">Branding</h1>
        <p class="admin-subtitle">
          Crie álbuns de fotos com link próprio para compartilhar com clientes. O álbum pode ser
          temporário (com validade) ou permanente, e não aparece nas galerias do site.
        </p>
      </div>

      <div class="admin-actions-row">
        <button class="admin-btn admin-btn--primary" type="button" @click="openCreate">
          + Novo álbum
        </button>
      </div>
    </header>

    <form v-if="creating" class="admin-card album-create" @submit.prevent="createAlbum">
      <div class="admin-card__header">
        <div>
          <h2 class="admin-card__title">Novo álbum</h2>
          <p class="admin-card__hint">O link é gerado automaticamente e pode ser copiado depois.</p>
        </div>
        <button class="admin-btn admin-btn--small" type="button" @click="closeCreate">
          Cancelar
        </button>
      </div>

      <div class="album-create__grid">
        <label class="admin-field">
          <span class="admin-label">Nome do álbum</span>
          <input
            v-model="form.title"
            class="admin-input"
            maxlength="120"
            required
            placeholder="Ex.: Ensaio editorial — marca X"
          />
        </label>

        <label class="admin-field">
          <span class="admin-label">Validade</span>
          <select v-model.number="form.days" class="admin-select">
            <option :value="0">Para sempre</option>
            <option :value="7">7 dias</option>
            <option :value="30">30 dias</option>
            <option :value="60">60 dias</option>
            <option :value="90">90 dias</option>
            <option :value="180">180 dias</option>
            <option :value="365">365 dias</option>
          </select>
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Descrição (opcional)</span>
        <textarea
          v-model="form.description"
          class="admin-textarea"
          maxlength="500"
          rows="2"
          placeholder="Uma frase para contextualizar o ensaio"
        />
      </label>

      <div class="admin-actions-row">
        <button class="admin-btn admin-btn--primary" type="submit" :disabled="creatingBusy">
          {{ creatingBusy ? 'Criando…' : 'Criar álbum' }}
        </button>
      </div>
    </form>

    <div v-if="albumsPending" class="admin-card">
      <p class="admin-empty">Carregando álbuns…</p>
    </div>

    <div v-else-if="albumsIsError" class="admin-alert admin-alert--error">
      {{ albumsError?.message || 'Não foi possível carregar os álbuns.' }}
    </div>

    <p v-else-if="albums.length === 0" class="admin-card admin-empty">
      Nenhum álbum criado ainda. Clique em “Novo álbum” para começar.
    </p>

    <div v-else class="album-list">
      <article
        v-for="album in albums"
        :key="album.id"
        class="admin-card album-card"
        :class="{ 'album-card--selected': selectedAlbumId === album.id }"
      >
        <div class="album-card__top">
          <div>
            <h2 class="admin-card__title">{{ album.title }}</h2>
            <p v-if="album.description" class="album-card__description">{{ album.description }}</p>
          </div>

          <span
            class="admin-tag"
            :class="album.expired ? 'admin-tag--danger' : 'admin-tag--success'"
          >
            {{ album.expired ? 'Expirado' : album.expiresAt ? 'Ativo' : 'Para sempre' }}
          </span>
        </div>

        <p class="album-card__meta">
          {{ album.photoCount }} foto{{ album.photoCount === 1 ? '' : 's' }} ·
          <template v-if="album.expiresAt">
            disponível até {{ formatDate(album.expiresAt) }}
          </template>
          <template v-else>sem validade</template>
        </p>

        <div class="admin-actions-row">
          <button class="admin-btn admin-btn--primary admin-btn--small" type="button" @click="selectAlbum(album.id)">
            {{ selectedAlbumId === album.id ? 'Fechar fotos' : 'Gerenciar fotos' }}
          </button>
          <button class="admin-btn admin-btn--small" type="button" @click="copyLink(album)">
            Copiar link
          </button>
          <a
            class="admin-btn admin-btn--small"
            :href="albumUrl(album)"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir ↗
          </a>
          <button class="admin-btn admin-btn--small admin-btn--danger" type="button" @click="askDeleteAlbum(album)">
            Excluir
          </button>
        </div>
      </article>
    </div>

    <section v-if="selectedAlbum" class="admin-card album-detail">
      <div class="admin-card__header">
        <div>
          <h2 class="admin-card__title">{{ selectedAlbum.album.title }}</h2>
          <p class="admin-card__hint">
            Link: <a class="admin-link" :href="albumUrl(selectedAlbum.album)" target="_blank" rel="noopener noreferrer">{{ albumUrl(selectedAlbum.album) }}</a>
          </p>
        </div>

        <div class="admin-actions-row">
          <button class="admin-btn admin-btn--small" type="button" @click="copyLink(selectedAlbum.album)">
            Copiar link
          </button>
          <button class="admin-btn admin-btn--small" type="button" @click="selectedAlbumId = null">
            Fechar
          </button>
        </div>
      </div>

      <div class="album-expiry">
        <label class="admin-field">
          <span class="admin-label">Validade</span>
          <select v-model="expiryChoice" class="admin-select">
            <option value="keep">
              Manter{{ selectedAlbum.album.expiresAt ? ` (até ${formatDate(selectedAlbum.album.expiresAt)})` : ' (para sempre)' }}
            </option>
            <option value="0">Para sempre</option>
            <option value="7">+7 dias</option>
            <option value="30">+30 dias</option>
            <option value="60">+60 dias</option>
            <option value="90">+90 dias</option>
            <option value="180">+180 dias</option>
            <option value="365">+365 dias</option>
          </select>
        </label>

        <button
          class="admin-btn admin-btn--primary admin-btn--small"
          type="button"
          :disabled="expiryChoice === 'keep' || savingExpiry"
          @click="saveExpiry"
        >
          {{ savingExpiry ? 'Salvando…' : 'Salvar validade' }}
        </button>
      </div>

      <UploadDropzone
        :busy="uploading"
        :uploading-names="uploadingNames"
        hint="JPEG, PNG, WebP, GIF ou AVIF · até 20 MB por foto"
        @files="uploadFiles"
      />

      <p v-if="photos.length === 0" class="admin-empty">
        Nenhuma foto neste álbum ainda. Envie as primeiras usando a área acima.
      </p>

      <div v-else class="album-photos">
        <article
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="album-photo"
          :class="{ 'album-photo--dragging': dragIndex === index }"
          draggable="true"
          @dragstart="dragIndex = index"
          @dragover.prevent
          @drop.prevent="handleDrop(index)"
          @dragend="dragIndex = null"
        >
          <img :src="photo.url" :alt="photo.alt || ''" loading="lazy" draggable="false" />
          <span class="album-photo__position">{{ index + 1 }}</span>
          <button
            class="album-photo__delete"
            type="button"
            title="Remover foto"
            @click="askDeletePhoto(photo)"
          >
            ×
          </button>
        </article>
      </div>

      <p v-if="orderSaving" class="admin-muted">Salvando nova ordem…</p>
    </section>

    <ConfirmDialog
      :open="Boolean(albumToDelete)"
      title="Excluir álbum"
      :message="albumToDelete ? `O álbum “${albumToDelete.title}” e todas as suas fotos serão removidos. Essa ação não pode ser desfeita.` : ''"
      confirm-label="Excluir álbum"
      :loading="deletingAlbum"
      danger
      @confirm="confirmDeleteAlbum"
      @cancel="albumToDelete = null"
    />

    <ConfirmDialog
      :open="Boolean(photoToDelete)"
      title="Remover foto do álbum"
      message="A foto será removida do álbum e do armazenamento. Essa ação não pode ser desfeita."
      confirm-label="Remover foto"
      :loading="deletingPhoto"
      danger
      @confirm="confirmDeletePhoto"
      @cancel="photoToDelete = null"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import { useAdminToast } from '@/composables/useAdminToast'
import UploadDropzone from '@/components/admin/UploadDropzone.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import { formatDate } from '@/utils/format.js'

const MAX_FILE_BYTES = 20 * 1024 * 1024
const toast = useAdminToast()

const {
  data: albumsData,
  isPending: albumsPending,
  isError: albumsIsError,
  error: albumsError,
  refetch: refetchAlbums
} = useQuery({
  queryKey: ['admin-albums'],
  queryFn: () => adminService.getAlbums()
})

const albums = computed(() => albumsData.value?.albums || [])

const creating = ref(false)
const creatingBusy = ref(false)
const form = reactive({ title: '', description: '', days: 0 })

function openCreate() {
  creating.value = true
  form.title = ''
  form.description = ''
  form.days = 0
}

function closeCreate() {
  creating.value = false
}

async function createAlbum() {
  if (!form.title.trim()) return

  creatingBusy.value = true

  try {
    const album = await adminService.createAlbum({
      title: form.title.trim(),
      description: form.description.trim(),
      expiresInDays: Number(form.days) || 0
    })

    toast.success('Álbum criado. Agora envie as fotos.')
    creating.value = false
    await refetchAlbums()
    selectedAlbumId.value = album.id
    expiryChoice.value = 'keep'
  } catch (error) {
    toast.error(error.message || 'Não foi possível criar o álbum.')
  } finally {
    creatingBusy.value = false
  }
}

const selectedAlbumId = ref(null)
const expiryChoice = ref('keep')
const savingExpiry = ref(false)

const {
  data: selectedAlbum,
  isPending: detailPending,
  refetch: refetchDetail
} = useQuery({
  queryKey: ['admin-album', selectedAlbumId],
  queryFn: () => adminService.getAlbum(selectedAlbumId.value),
  enabled: computed(() => Boolean(selectedAlbumId.value))
})

const photos = computed(() => selectedAlbum.value?.photos || [])
const localPhotos = ref([])

watch(photos, (list) => {
  localPhotos.value = [...list]
}, { immediate: true })

function selectAlbum(albumId) {
  selectedAlbumId.value = selectedAlbumId.value === albumId ? null : albumId
  expiryChoice.value = 'keep'
}

function albumUrl(album) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/album/${album.token}`
}

async function copyLink(album) {
  try {
    await navigator.clipboard.writeText(albumUrl(album))
    toast.success('Link copiado.')
  } catch {
    toast.error('Não foi possível copiar. Abra o álbum e copie a URL.')
  }
}

async function saveExpiry() {
  if (!selectedAlbumId.value || expiryChoice.value === 'keep') return

  savingExpiry.value = true

  try {
    await adminService.updateAlbum(selectedAlbumId.value, {
      expiresInDays: Number(expiryChoice.value)
    })
    toast.success('Validade atualizada.')
    expiryChoice.value = 'keep'
    await Promise.all([refetchDetail(), refetchAlbums()])
  } catch (error) {
    toast.error(error.message || 'Não foi possível atualizar a validade.')
  } finally {
    savingExpiry.value = false
  }
}

const uploading = ref(false)
const uploadingNames = ref([])

async function uploadFiles(files) {
  if (!selectedAlbumId.value) return

  uploading.value = true
  uploadingNames.value = files.map((file) => file.name)
  let successCount = 0

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`${file.name}: a imagem deve ter no máximo 20 MB.`)
      continue
    }

    try {
      await adminService.uploadAlbumPhoto(selectedAlbumId.value, file, file.name)
      successCount += 1
    } catch (error) {
      toast.error(`${file.name}: ${error.message || 'falha no envio.'}`)
    }
  }

  uploading.value = false
  uploadingNames.value = []

  if (successCount > 0) {
    toast.success(`${successCount} foto${successCount === 1 ? '' : 's'} enviada${successCount === 1 ? '' : 's'}.`)
    await Promise.all([refetchDetail(), refetchAlbums()])
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

  orderSaving.value = true

  try {
    await adminService.reorderAlbumPhotos(
      selectedAlbumId.value,
      items.map((photo) => photo.id)
    )
    toast.success('Ordem atualizada.')
    await refetchDetail()
  } catch (error) {
    toast.error(error.message || 'Não foi possível salvar a ordem.')
    await refetchDetail()
  } finally {
    orderSaving.value = false
  }
}

const albumToDelete = ref(null)
const deletingAlbum = ref(false)

function askDeleteAlbum(album) {
  albumToDelete.value = album
}

async function confirmDeleteAlbum() {
  if (!albumToDelete.value) return

  deletingAlbum.value = true

  try {
    await adminService.deleteAlbum(albumToDelete.value.id)
    toast.success('Álbum excluído.')
    if (selectedAlbumId.value === albumToDelete.value.id) selectedAlbumId.value = null
    albumToDelete.value = null
    await refetchAlbums()
  } catch (error) {
    toast.error(error.message || 'Não foi possível excluir o álbum.')
  } finally {
    deletingAlbum.value = false
  }
}

const photoToDelete = ref(null)
const deletingPhoto = ref(false)

function askDeletePhoto(photo) {
  photoToDelete.value = photo
}

async function confirmDeletePhoto() {
  if (!photoToDelete.value) return

  deletingPhoto.value = true

  try {
    await adminService.deleteAlbumPhoto(photoToDelete.value.id)
    toast.success('Foto removida.')
    photoToDelete.value = null
    await Promise.all([refetchDetail(), refetchAlbums()])
  } catch (error) {
    toast.error(error.message || 'Não foi possível remover a foto.')
  } finally {
    deletingPhoto.value = false
  }
}
</script>

<style scoped>
.album-create {
  margin-bottom: 1rem;
}

.album-create__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(160px, 1fr);
  gap: 0.75rem;
}

.album-list {
  display: grid;
  gap: 0.9rem;
}

.album-card__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.album-card__description {
  margin: 0.3rem 0 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.45;
}

.album-card__meta {
  margin: 0.6rem 0 0.8rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.76rem;
}

.album-card--selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary), 0 10px 25px rgba(0, 0, 0, 0.05);
}

.album-detail {
  margin-top: 1rem;
}

.album-expiry {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.album-expiry .admin-field {
  min-width: 220px;
}

.album-photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.6rem;
  margin-top: 1rem;
}

.album-photo {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-muted);
  cursor: grab;
}

.album-photo--dragging {
  opacity: 0.5;
}

.album-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-photo__position {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.68);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
}

.album-photo__delete {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.68);
  color: #fff;
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
}

.album-photo__delete:hover {
  background: #b42318;
}

@media (max-width: 640px) {
  .album-create__grid {
    grid-template-columns: 1fr;
  }
}
</style>
