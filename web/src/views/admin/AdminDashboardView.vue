<template>
  <div>
    <AdminSkeleton v-if="isPending" variant="dashboard" />

    <template v-else>
      <header class="admin-page-header dashboard-header">
        <div>
          <h1 class="admin-title">Visão geral</h1>
          <p class="admin-subtitle">
            Acompanhe o Instagram, veja os últimos envios e baixe o material de apresentação.
          </p>
        </div>

        <div class="dashboard-header__actions">
          <button
            class="admin-btn admin-btn--primary"
            type="button"
            :disabled="generatingPdf"
            title="Gerar o media kit em PDF com os dados atuais do painel"
            aria-label="Gerar PDF do material de apresentação"
            @click="generatePdf"
          >
            <AdminIcon name="download" />
            {{ generatingPdf ? 'Gerando PDF…' : 'Gerar PDF' }}
          </button>
        </div>
      </header>

      <section class="admin-card dashboard-instagram">
        <div class="admin-card__header">
          <div class="dashboard-instagram__identity">
            <img
              v-if="instagram.state.profilePictureUrl && !avatarFailed"
              class="dashboard-instagram__avatar"
              :src="instagram.state.profilePictureUrl"
              alt=""
              @error="avatarFailed = true"
            />
            <span v-else class="dashboard-instagram__avatar dashboard-instagram__avatar--fallback">
              <AdminIcon name="instagram" />
            </span>
            <div>
              <h2 class="admin-card__title"><AdminIcon name="instagram" /> Instagram</h2>
              <p v-if="instagram.state.username" class="admin-card__hint">
                @{{ instagram.state.username }}
                <template v-if="instagram.state.fullName"> · {{ instagram.state.fullName }}</template>
              </p>
            </div>
          </div>

          <div class="admin-actions-row">
            <span v-if="!instagram.state.configured" class="admin-tag admin-tag--warning">Token não configurado</span>
            <span v-else-if="instagram.state.lastError" class="admin-tag admin-tag--danger">Última coleta falhou</span>
            <RouterLink class="admin-btn admin-btn--small" :to="{ name: 'AdminInstagram' }">
              Gerenciar Instagram
            </RouterLink>
          </div>
        </div>

        <div v-if="instagram.latest" class="admin-stats" :style="statsStyle(6)">
          <AdminStatCard icon="users" label="Seguidores" :value="formatNumber(instagram.latest.followers)" />
          <AdminStatCard
            icon="userPlus"
            label="Seguindo"
            :value="formatNumber(instagram.state.followsCount)"
          />
          <AdminStatCard icon="image" label="Publicações" :value="formatNumber(instagram.latest.posts)" />
          <AdminStatCard icon="eye" label="Views recentes" :value="formatNumber(instagram.latest.recentViews)" />
          <AdminStatCard icon="activity" label="Interações" :value="formatNumber(instagram.latest.recentInteractions)" />
          <AdminStatCard
            icon="heart"
            label="Novos seguidores"
            :value="formatSigned(instagram.latest.newFollowers)"
          />
        </div>

        <p v-else class="admin-empty">
          Nenhuma coleta bem-sucedida ainda. Configure o token do Instagram para começar o histórico.
        </p>

        <div v-if="instagram.latest" class="dashboard-sparklines">
          <AdminSparkline
            class="dashboard-sparkline"
            label="Seguidores nos últimos 30 dias"
            :values="instagram.history.map((point) => point.followers)"
          />
          <AdminSparkline
            class="dashboard-sparkline"
            label="Views nos últimos 30 dias"
            :values="instagram.history.map((point) => point.recentViews)"
          />
        </div>

        <div v-if="instagram.latest" class="dashboard-instagram__meta">
          <div>
            <span>Última coleta</span>
            <strong>{{ formatDateTime(instagram.latest.capturedAt) }}</strong>
          </div>
          <div v-if="instagramWebsite">
            <span>Site</span>
            <a
              :href="instagramWebsite"
              :title="instagram.state.website"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ instagram.state.website }}
            </a>
          </div>
          <div v-if="instagram.state.biography" class="dashboard-instagram__bio">
            <span>Bio</span>
            <p>{{ instagram.state.biography }}</p>
          </div>
        </div>
      </section>

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
import { computed, nextTick, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminIcon from '@/components/admin/AdminIcon.vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminSparkline from '@/components/admin/AdminSparkline.vue'
import MediaKitDocument from '@/components/admin/MediaKitDocument.vue'
import { formatDateTime, formatNumber } from '@/utils/format.js'
import { statColumns } from '@/utils/grid.js'
import { useErrorToast } from '@/composables/useErrorToast'
import { useAdminToast } from '@/composables/useAdminToast'

function statsStyle(count) {
  return {
    '--stat-cols': statColumns(count, 6),
    '--stat-cols-sm': statColumns(count, 2)
  }
}

function formatSigned(value) {
  if (value == null || value === '') return '—'

  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return `${numeric >= 0 ? '+' : ''}${formatNumber(numeric)}`
}

const { data, isPending, isError, error, refetch } = useQuery({
  queryKey: ['admin-dashboard'],
  queryFn: () => adminService.getDashboard(),
  refetchInterval: 60_000
})

const instagram = computed(() => data.value?.instagram || { state: {}, latest: null, history: [] })

const instagramWebsite = computed(() => {
  const value = instagram.value.state?.website
  if (!value) return null
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
})

// A URL da foto de perfil do Instagram expira; quando falha, mostramos o selo.
const avatarFailed = ref(false)

watch(
  () => instagram.value.state?.profilePictureUrl,
  () => {
    avatarFailed.value = false
  }
)

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
.dashboard-instagram {
  margin-bottom: 1rem;
}

.dashboard-instagram__identity {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
}

.dashboard-instagram__avatar {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface-muted);
  color: var(--muted);
  object-fit: cover;
}

.dashboard-instagram__avatar--fallback svg {
  width: 20px;
  height: 20px;
}

.dashboard-instagram .admin-card__header {
  flex-wrap: wrap;
  gap: 0.75rem;
}

.dashboard-sparklines {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.dashboard-sparkline {
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.dashboard-instagram__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.dashboard-instagram__meta > div {
  min-width: 0;
  flex: 1 1 240px;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.dashboard-instagram__meta span {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dashboard-instagram__meta strong,
.dashboard-instagram__meta a {
  color: var(--text);
  font-family: system-ui, sans-serif;
  font-size: 0.84rem;
  word-break: break-word;
}

.dashboard-instagram__meta a {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-decoration: underline;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-instagram__meta > .dashboard-instagram__bio {
  flex: 1 1 100%;
}

.dashboard-instagram__bio p {
  margin: 0;
  color: var(--text);
  font-family: system-ui, sans-serif;
  font-size: 0.84rem;
  line-height: 1.5;
  white-space: pre-line;
}

.dashboard-recent {
  margin-top: 0;
}

.dashboard-header {
  align-items: center;
}

.dashboard-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .dashboard-header {
    align-items: flex-start;
  }

  .dashboard-header__actions {
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  .dashboard-sparklines {
    grid-template-columns: minmax(0, 1fr);
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
