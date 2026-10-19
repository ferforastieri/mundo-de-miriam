<template>
  <div>
    <div v-if="!instagramConfigured" class="admin-alert publish-block">
      Configure o token do Instagram antes de publicar.
      <RouterLink class="admin-link" :to="{ name: 'AdminInstagram' }">Ir para a tela do Instagram</RouterLink>
    </div>

    <div class="admin-grid-2">
      <section class="admin-card">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">1. Escolha as fotos</h2>
            <p class="admin-card__hint">
              {{ selectedIds.length }} de {{ MAX_ITEMS }} selecionadas · a ordem de seleção é a ordem do carrossel
            </p>
          </div>

          <div class="admin-actions-row">
            <RouterLink class="admin-btn admin-btn--small" :to="{ name: 'AdminInstagram' }">
              Ver estatísticas
            </RouterLink>
            <button
              v-if="selectedIds.length > 0"
              class="admin-btn admin-btn--small"
              type="button"
              @click="selectedIds = []"
            >
              Limpar seleção
            </button>
          </div>
        </div>

        <div class="photos-toolbar">
          <label class="admin-field photos-toolbar__field">
            <span class="admin-label">Tela</span>
            <AdminSelect v-model="selectedScreenId" :options="screenOptions" aria-label="Tela" />
          </label>
        </div>

        <AdminSkeleton v-if="photosPending" variant="photos" :count="6" />
        <p v-else-if="photos.length === 0" class="admin-empty">Nenhuma foto nesta tela.</p>

        <div v-else class="publish-grid">
          <button
            v-for="photo in photos"
            :key="photo.id"
            class="publish-thumb"
            :class="{
              'publish-thumb--selected': isSelected(photo.id),
              'publish-thumb--disabled': !isJpeg(photo)
            }"
            type="button"
            :disabled="!isJpeg(photo) || (!isSelected(photo.id) && selectedIds.length >= MAX_ITEMS)"
            @click="toggle(photo)"
          >
            <img :src="photo.url" :alt="photo.alt || ''" loading="lazy" />
            <span v-if="isSelected(photo.id)" class="publish-thumb__order">
              {{ selectedIds.indexOf(photo.id) + 1 }}
            </span>
            <span v-if="!isJpeg(photo)" class="publish-thumb__tag">não é JPEG</span>
          </button>
        </div>
      </section>

      <section class="admin-card">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">2. Legenda e publicação</h2>
            <p class="admin-card__hint">
              {{ selectedIds.length === 1 ? 'Post simples' : selectedIds.length > 1 ? `Carrossel com ${selectedIds.length} fotos` : 'Selecione as fotos ao lado' }}
            </p>
          </div>
        </div>

        <div v-if="selectedPhotos.length > 0" class="publish-preview">
          <img v-for="photo in selectedPhotos" :key="photo.id" :src="photo.url" :alt="photo.alt || ''" />
        </div>

        <label class="admin-field publish-caption">
          <span class="admin-label">Legenda</span>
          <textarea
            v-model="caption"
            class="admin-textarea"
            maxlength="2200"
            rows="6"
            placeholder="Escreva a legenda do post…"
          />
          <span class="admin-muted">{{ caption.length }}/2200</span>
        </label>

        <div class="admin-actions-row">
          <button
            class="admin-btn admin-btn--primary"
            type="button"
            :disabled="!canPublish"
            @click="publish"
          >
            {{ publishing ? 'Publicando…' : 'Publicar no Instagram' }}
          </button>
          <span v-if="publishing" class="admin-muted">
            Aguarde — o Instagram leva alguns segundos para processar.
          </span>
        </div>

      </section>
    </div>

    <section class="admin-card publish-history">
      <div class="admin-card__header">
        <div>
          <h2 class="admin-card__title"><AdminIcon name="send" /> Histórico de publicações</h2>
          <p class="admin-card__hint">{{ publishedLast24h }} publicada(s) nas últimas 24h (limite de 25)</p>
        </div>
      </div>

      <AdminSkeleton v-if="publicationsPending" variant="cards" :count="1" />

      <p v-else-if="publications.length === 0" class="admin-empty">Nenhuma publicação feita pelo painel ainda.</p>

      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Quando</th>
              <th>Fotos</th>
              <th>Status</th>
              <th>Legenda</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="publication in publications" :key="publication.id">
              <td>{{ formatDateTime(publication.createdAt) }}</td>
              <td>{{ publication.photoIds.length }}</td>
              <td>
                <span class="admin-tag" :class="publication.status === 'published' ? 'admin-tag--success' : 'admin-tag--danger'">
                  {{ publication.status === 'published' ? 'OK' : 'Falha' }}
                </span>
              </td>
              <td class="publish-history__caption">{{ publication.caption || publication.error || '—' }}</td>
              <td>
                <a v-if="publication.permalink" class="admin-link" :href="publication.permalink" target="_blank" rel="noopener noreferrer">Abrir</a>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationBar
        :pagination="publicationsPagination"
        label="publicações"
        @update:page="publicationsPage = $event"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import { useAdminToast } from '@/composables/useAdminToast'
import { useErrorToast } from '@/composables/useErrorToast'
import { formatDateTime } from '@/utils/format.js'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminSelect from '@/components/admin/AdminSelect.vue'
import PaginationBar from '@/components/admin/PaginationBar.vue'
import AdminIcon from '@/components/admin/AdminIcon.vue'

const MAX_ITEMS = 10
const toast = useAdminToast()
const queryClient = useQueryClient()

const {
  data: screensData,
  isPending: screensPending,
  refetch: refetchScreens
} = useQuery({
  queryKey: ['admin-screens', 'all'],
  queryFn: () => adminService.getScreens({ pageSize: 200 })
})

const {
  data: instagramData,
  refetch: refetchInstagram
} = useQuery({
  queryKey: ['admin-instagram'],
  queryFn: () => adminService.getInstagram()
})

const screens = computed(() => screensData.value?.screens || [])

const screenOptions = computed(() =>
  screens.value.map((screen) => ({
    value: screen.id,
    label: `${screen.name} (${screen.photoCount})`
  }))
)
const instagramConfigured = computed(() => Boolean(instagramData.value?.state?.configured))
const publishedLast24h = computed(() => instagramData.value?.publishedLast24h || 0)

const publicationsPage = ref(1)

const {
  data: publicationsData,
  isPending: publicationsPending
} = useQuery({
  queryKey: ['admin-instagram-publications', publicationsPage],
  queryFn: () => adminService.getInstagramPublications({ page: publicationsPage.value, pageSize: 10 })
})

const publications = computed(() => publicationsData.value?.publications || [])
const publicationsPagination = computed(() => publicationsData.value?.pagination || null)

const selectedScreenId = ref('')
watch(
  screens,
  (list) => {
    if (list.length > 0 && !list.some((screen) => screen.id === selectedScreenId.value)) {
      selectedScreenId.value = list[0].id
    }
  },
  { immediate: true }
)

const {
  data: photosData,
  isPending: photosPending,
  isError: photosIsError,
  error: photosError
} = useQuery({
  queryKey: ['admin-photos', selectedScreenId],
  queryFn: () => adminService.getPhotos(selectedScreenId.value),
  enabled: computed(() => Boolean(selectedScreenId.value))
})

const photos = computed(() => photosData.value?.photos || [])
const selectedIds = ref([])
const caption = ref('')
const publishing = ref(false)
const lastResult = ref(null)

useErrorToast(photosError, 'Não foi possível carregar as fotos.')

watch(lastResult, (result) => {
  if (result?.permalink) toast.success('Publicado no Instagram.')
})

const selectedPhotos = computed(() =>
  selectedIds.value
    .map((id) => photos.value.find((photo) => photo.id === id))
    .filter(Boolean)
)

const canPublish = computed(() =>
  instagramConfigured.value && selectedIds.value.length > 0 && !publishing.value
)

function isJpeg(photo) {
  return photo.contentType === 'image/jpeg'
}

function isSelected(photoId) {
  return selectedIds.value.includes(photoId)
}

function toggle(photo) {
  if (!isJpeg(photo)) return

  if (isSelected(photo.id)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== photo.id)
    return
  }

  if (selectedIds.value.length >= MAX_ITEMS) {
    toast.error(`Máximo de ${MAX_ITEMS} fotos por carrossel.`)
    return
  }

  selectedIds.value = [...selectedIds.value, photo.id]
}

watch(selectedScreenId, () => {
  selectedIds.value = selectedIds.value.filter((id) =>
    photos.value.some((photo) => photo.id === id)
  )
})

async function publish() {
  if (!canPublish.value) return

  publishing.value = true
  lastResult.value = null

  try {
    const result = await adminService.publishToInstagram(
      selectedIds.value,
      caption.value.trim()
    )

    lastResult.value = result
    toast.success(
      result.count === 1 ? 'Post publicado no Instagram!' : `Carrossel com ${result.count} fotos publicado!`
    )
    selectedIds.value = []
    caption.value = ''

    await Promise.all([
      refetchInstagram(),
      refetchScreens(),
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    ])
  } catch (error) {
    toast.error(error.message || 'Não foi possível publicar.')
  } finally {
    publishing.value = false
  }
}
</script>

<style scoped>
.publish-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.publish-tabs {
  margin-bottom: 0.85rem;
}

.publish-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 0.5rem;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.publish-thumb {
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  background: var(--surface-muted);
  cursor: pointer;
  overflow: hidden;
}

.publish-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.publish-thumb--selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent);
}

.publish-thumb--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.publish-thumb__order {
  position: absolute;
  top: 4px;
  left: 4px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
}

.publish-thumb__tag {
  position: absolute;
  right: 4px;
  bottom: 4px;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 0.6rem;
}

.publish-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
}

.publish-preview img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}

.publish-caption .admin-muted {
  justify-self: end;
}

.publish-result {
  margin: 0.9rem 0 0;
}

.publish-history {
  margin-top: 1rem;
}

.publish-history__caption {
  max-width: 320px;
  word-break: break-word;
  color: var(--muted);
}

.admin-table-wrap {
  overflow-x: auto;
}
</style>
