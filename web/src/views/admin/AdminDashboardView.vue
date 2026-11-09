<template>
  <div>
    <AdminSkeleton v-if="isPending" variant="dashboard" />

    <template v-else>
      <section class="admin-card dashboard-media-kit">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="download" /> Material de apresentação</h2>
            <p class="admin-card__hint">
              PDF com parcerias, propostas, perfil e insights do Instagram — tudo gerado com os dados do painel.
            </p>
          </div>

          <button
            class="admin-btn admin-btn--primary"
            type="button"
            :disabled="generatingPdf"
            aria-label="Gerar PDF do material de apresentação"
            @click="generatePdf"
          >
            <AdminIcon name="download" />
            {{ generatingPdf ? 'Gerando PDF…' : 'Gerar PDF' }}
          </button>
        </div>
      </section>

      <div class="admin-grid-2">
        <section class="admin-card">
          <div class="admin-card__header">
            <div>
              <h2 class="admin-card__title"><AdminIcon name="instagram" /> Instagram</h2>
              <p v-if="instagram.state.username" class="admin-card__hint">
                @{{ instagram.state.username }}
              </p>
            </div>

            <div class="admin-actions-row">
              <span v-if="!instagram.state.configured" class="admin-tag admin-tag--warning">Token não configurado</span>
              <span v-else-if="instagram.state.lastError" class="admin-tag admin-tag--danger">Última coleta falhou</span>
            </div>
          </div>

          <div v-if="instagram.latest" class="admin-stats" :style="statsStyle(4)">
            <AdminStatCard icon="users" label="Seguidores" :value="formatNumber(instagram.latest.followers)" />
            <AdminStatCard icon="image" label="Publicações" :value="formatNumber(instagram.latest.posts)" />
            <AdminStatCard icon="eye" label="Views recentes" :value="formatNumber(instagram.latest.recentViews)" />
            <AdminStatCard icon="activity" label="Interações" :value="formatNumber(instagram.latest.recentInteractions)" />
          </div>

          <p v-else class="admin-empty">
            Nenhuma coleta bem-sucedida ainda. Configure o token do Instagram para começar o histórico.
          </p>

          <AdminSparkline
            v-if="instagram.latest"
            class="dashboard-sparkline"
            label="Seguidores nos últimos 30 dias"
            :values="instagram.history.map((point) => point.followers)"
          />

          <div class="admin-actions-row dashboard-links">
            <RouterLink class="admin-btn admin-btn--small" :to="{ name: 'AdminInstagram' }">
              Gerenciar Instagram
            </RouterLink>
          </div>

        </section>

        <section class="admin-card">
          <div class="admin-card__header">
            <div>
              <h2 class="admin-card__title"><AdminIcon name="archive" /> Acervo de fotos</h2>
            </div>
            <RouterLink class="admin-btn admin-btn--small" :to="{ name: 'AdminPhotos' }">
              Gerenciar fotos
            </RouterLink>
          </div>

          <div class="admin-stats" :style="statsStyle(4)">
            <AdminStatCard icon="archive" label="Total" :value="photos.totals.total" />
            <AdminStatCard icon="eye" label="Visíveis" :value="photos.totals.visible" />
            <AdminStatCard icon="eyeOff" label="Ocultas" :value="photos.totals.hidden" />
            <AdminStatCard icon="database" label="Armazenamento" :value="formatBytes(photos.totals.bytes)" />
          </div>

          <table class="admin-table dashboard-table">
            <thead>
              <tr>
                <th>Tela</th>
                <th>Fotos</th>
                <th>Tamanho</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="screen in photos.byScreen" :key="screen.screenId">
                <td>{{ screen.name }}</td>
                <td>{{ screen.total }}</td>
                <td>{{ formatBytes(screen.bytes) }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section class="admin-card dashboard-recent">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="image" /> Últimos envios</h2>
            <p class="admin-card__hint">As fotos adicionadas mais recentemente</p>
          </div>
        </div>

        <div v-if="photos.recent.length === 0" class="admin-empty">
          Nenhuma foto cadastrada ainda.
        </div>

        <div v-else class="recent-grid">
          <article v-for="photo in photos.recent" :key="photo.id" class="recent-item">
            <video
              v-if="String(photo.contentType || '').startsWith('video/')"
              :src="photo.url"
              muted
              playsinline
              preload="metadata"
            ></video>
            <img v-else :src="photo.url" :alt="photo.alt || ''" loading="lazy" />
            <div>
              <p class="recent-item__title">{{ photo.alt || 'Sem descrição' }}</p>
              <p class="recent-item__meta">
                {{ photo.screenName || 'Tela' }}<template v-if="photo.groupName"> · {{ photo.groupName }}</template>
              </p>
              <p class="recent-item__meta">{{ formatDateTime(photo.createdAt) }}</p>
            </div>
          </article>
        </div>
      </section>
    </template>

    <Teleport to="body">
      <MediaKitDocument v-if="mediaKit" ref="mediaKitRef" :data="mediaKit" />
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminIcon from '@/components/admin/AdminIcon.vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminSparkline from '@/components/admin/AdminSparkline.vue'
import MediaKitDocument from '@/components/admin/MediaKitDocument.vue'
import { formatBytes, formatDateTime, formatNumber } from '@/utils/format.js'
import { statColumns } from '@/utils/grid.js'
import { useErrorToast } from '@/composables/useErrorToast'
import { useAdminToast } from '@/composables/useAdminToast'

function statsStyle(count) {
  return {
    '--stat-cols': statColumns(count, 5),
    '--stat-cols-sm': statColumns(count, 2)
  }
}

const { data, isPending, isError, error, refetch } = useQuery({
  queryKey: ['admin-dashboard'],
  queryFn: () => adminService.getDashboard(),
  refetchInterval: 60_000
})

const instagram = computed(() => data.value?.instagram || { state: {}, latest: null, history: [] })

useErrorToast(error, 'Não foi possível carregar o painel.')

useErrorToast(
  computed(() => {
    const message = instagram.value?.state?.lastError
    return message ? new Error(message) : null
  }),
  'Falha na coleta do Instagram.'
)
const photos = computed(() => data.value?.photos || {
  totals: { total: 0, visible: 0, hidden: 0, bytes: 0 },
  byScreen: [],
  recent: []
})

const mediaKit = ref(null)
const mediaKitRef = ref(null)
const generatingPdf = ref(false)
const toast = useAdminToast()

async function generatePdf() {
  if (generatingPdf.value) return

  generatingPdf.value = true
  mediaKit.value = null

  try {
    mediaKit.value = await adminService.getMediaKit()
    await nextTick()

    if (!mediaKitRef.value) {
      throw new Error('Não foi possível montar o material do PDF.')
    }

    await mediaKitRef.value.generate()
    toast.success('PDF gerado com sucesso.')
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível gerar o PDF.')
  } finally {
    generatingPdf.value = false
    mediaKit.value = null
  }
}
</script>

<style scoped>
.admin-grid-2 > .admin-card {
  display: flex;
  flex-direction: column;
}

.dashboard-links {
  margin-top: auto;
}

.dashboard-sparkline {
  margin-top: 1rem;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.dashboard-links {
  margin-top: 1rem;
}

.dashboard-error {
  margin: 0.8rem 0 0;
  word-break: break-word;
}

.dashboard-table {
  margin-top: 1rem;
}

.dashboard-recent {
  margin-top: 1rem;
}

.dashboard-media-kit {
  margin-bottom: 1rem;
}

.dashboard-media-kit .admin-card__header {
  gap: 1rem;
}

@media (max-width: 640px) {
  .dashboard-media-kit .admin-card__header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.pdf-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(20, 12, 8, 0.55);
  backdrop-filter: blur(3px);
}

.pdf-overlay__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  max-width: 340px;
  padding: 1.6rem 1.8rem;
  border-radius: 16px;
  background: var(--surface);
  color: var(--text);
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.pdf-overlay__card strong {
  font-family: 'Gilda Display', serif;
  font-size: 1.15rem;
  font-weight: 400;
}

.pdf-overlay__card p {
  margin: 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.45;
}

.pdf-overlay__spinner {
  width: 34px;
  height: 34px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: pdf-spin 0.8s linear infinite;
}

@keyframes pdf-spin {
  to {
    transform: rotate(360deg);
  }
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 0.75rem;
}

.recent-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.recent-item img,
.recent-item video {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}

.recent-item p {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.recent-item__title {
  overflow: hidden;
  color: var(--text);
  font-size: 0.82rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-item__meta {
  margin-top: 0.15rem !important;
  color: var(--muted);
  font-size: 0.7rem;
}
</style>
