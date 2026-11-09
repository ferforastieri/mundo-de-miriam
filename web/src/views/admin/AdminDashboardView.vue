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
              :src="avatarUrl"
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

        <div class="dashboard-filters">
          <span class="dashboard-filters__label">Período</span>
          <div class="dashboard-filters__group" role="group" aria-label="Filtrar Instagram por período">
            <button
              v-for="option in insightDayOptions"
              :key="option"
              type="button"
              class="dashboard-filters__button"
              :class="{ 'dashboard-filters__button--active': option === selectedDays }"
              :aria-pressed="option === selectedDays"
              @click="selectedDays = option"
            >
              {{ option }} dias
            </button>
          </div>
          <span v-if="period?.to" class="dashboard-filters__range">
            {{ formatDate(period.from) }} a {{ formatDate(period.to) }} · {{ formatNumber(period.samples) }} coletas
          </span>
        </div>

        <div v-if="instagram.latest" class="admin-stats" :style="statsStyle(6)">
          <AdminStatCard icon="users" label="Seguidores" :value="formatNumber(instagram.latest.followers)" />
          <AdminStatCard
            icon="userPlus"
            label="Seguindo"
            :value="formatNumber(instagram.state.followsCount)"
          />
          <AdminStatCard icon="image" label="Publicações" :value="formatNumber(instagram.latest.posts)" />
          <AdminStatCard
            icon="eye"
            label="Visualizações"
            :value="formatNumber(period?.views)"
            :hint="`últimos ${selectedDays} dias`"
          />
          <AdminStatCard
            icon="activity"
            label="Interações"
            :value="formatNumber(period?.interactions)"
            :hint="`últimos ${selectedDays} dias`"
          />
          <AdminStatCard
            icon="heart"
            label="Seguidores líquidos"
            :value="formatSigned(period?.netFollowers)"
            :hint="`últimos ${selectedDays} dias`"
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
            :values="instagram.history.map((point) => point.views ?? point.recentViews)"
          />
        </div>

        <div v-if="instagram.latest" class="dashboard-insights">
          <article class="dashboard-insight">
            <span class="dashboard-insight__icon"><AdminIcon name="clock" /></span>
            <div>
              <span class="dashboard-insight__label">Última coleta</span>
              <strong class="dashboard-insight__value">{{ formatDateTime(instagram.latest.capturedAt) }}</strong>
              <p class="dashboard-insight__hint">Atualizada automaticamente a cada hora</p>
            </div>
          </article>

          <article v-if="engagementRate !== null" class="dashboard-insight">
            <span class="dashboard-insight__icon"><AdminIcon name="zap" /></span>
            <div>
              <span class="dashboard-insight__label">Engajamento · {{ selectedDays }} dias</span>
              <strong class="dashboard-insight__value">{{ formatPercent(engagementRate) }}</strong>
              <p class="dashboard-insight__hint">Interações sobre as visualizações do período</p>
            </div>
          </article>

          <article v-if="period && period.samples > 0" class="dashboard-insight">
            <span class="dashboard-insight__icon"><AdminIcon name="trendingUp" /></span>
            <div>
              <span class="dashboard-insight__label">Novos seguidores · {{ selectedDays }} dias</span>
              <strong class="dashboard-insight__value dashboard-insight__value--up">
                {{ formatSigned(period.newFollowers) }}
              </strong>
              <p class="dashboard-insight__hint">
                <template v-if="period.netFollowers !== null">
                  saldo de {{ formatSigned(period.netFollowers) }} seguidores no período
                </template>
                <template v-else>soma das coletas do período</template>
              </p>
            </div>
          </article>

          <article v-if="period && period.samples > 0 && period.viewsSource !== 'account'" class="dashboard-insight">
            <span class="dashboard-insight__icon"><AdminIcon name="eye" /></span>
            <div>
              <span class="dashboard-insight__label">Origem das views</span>
              <strong class="dashboard-insight__value">
                {{ period.viewsSource === 'partial' ? 'Misto' : 'Publicações' }}
              </strong>
              <p class="dashboard-insight__hint">
                {{
                  period.viewsSource === 'partial'
                    ? 'views da conta desde o início da coleta + variação das publicações'
                    : 'variação das visualizações das publicações recentes'
                }}
              </p>
            </div>
          </article>
        </div>

        <article v-if="period?.followers != null" class="dashboard-audience">
          <div class="dashboard-audience__head">
            <div>
              <span class="dashboard-insight__label">Views por tipo de conta</span>
              <strong class="dashboard-audience__value">
                {{ formatPercent(period.followers) }} seguidores
                <span>· {{ formatPercent(period.nonFollowers) }} não seguidores</span>
              </strong>
            </div>
          </div>
          <div class="dashboard-audience__bar" role="img" :aria-label="`${period.followers}% das views de seguidores e ${period.nonFollowers}% de não seguidores`">
            <span :style="{ width: `${period.followers}%` }"></span>
          </div>
        </article>
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
import { formatDate, formatDateTime, formatNumber } from '@/utils/format.js'
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

// O filtro de período é o mesmo recorte usado no PDF.
const insightDayOptions = [7, 30, 90]
const selectedDays = ref(90)

const { data, isPending, isError, error, refetch } = useQuery({
  queryKey: ['admin-dashboard', selectedDays],
  queryFn: () => adminService.getDashboard(selectedDays.value),
  refetchInterval: 60_000
})

const instagram = computed(() => data.value?.instagram || { state: {}, latest: null, history: [] })

const insights = computed(() => instagram.value.insights || {})
const period = computed(() => insights.value.selected || null)

const engagementRate = computed(() => {
  const views = Number(period.value?.views)
  const interactions = Number(period.value?.interactions)

  if (!Number.isFinite(views) || views <= 0 || !Number.isFinite(interactions)) return null

  return (interactions / views) * 100
})

function formatPercent(value) {
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)}%`
}

// A URL da foto de perfil do Instagram expira e costuma bloquear hotlink.
// Servimos uma cópia em cache pela própria API; o fallback cobre falhas.
const avatarUrl = computed(() =>
  instagram.value.state?.profilePictureUrl ? '/api/admin/instagram/avatar' : null
)

const avatarFailed = ref(false)

watch(avatarUrl, () => {
  avatarFailed.value = false
})

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
    mediaKit.value = await adminService.getMediaKit(selectedDays.value)
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

.dashboard-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
}

.dashboard-filters__label {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.dashboard-filters__group {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-muted);
}

.dashboard-filters__button {
  padding: 0.35rem 0.75rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.dashboard-filters__button:hover {
  color: var(--text);
}

.dashboard-filters__button--active {
  background: var(--primary);
  color: #fff;
}

.dashboard-filters__range {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
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

.dashboard-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.dashboard-insight {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: start;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--primary) 8%, var(--surface-muted)) 0%,
      var(--surface-muted) 70%
    );
}

.dashboard-insight > div {
  min-width: 0;
}

.dashboard-insight__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--primary) 14%, transparent);
  color: var(--primary);
}

.dashboard-insight__icon svg {
  width: 17px;
  height: 17px;
}

.dashboard-insight__label {
  display: block;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.dashboard-insight__value {
  display: block;
  margin-top: 0.15rem;
  color: var(--text);
  font-family: 'Gilda Display', serif;
  font-size: 1.05rem;
  font-weight: normal;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.dashboard-insight__value--up {
  color: #067647;
}

.dashboard-insight__value--date {
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
}

.dashboard-insight__value--down {
  color: #b42318;
}

.dashboard-insight__hint {
  margin: 0.15rem 0 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  line-height: 1.35;
}

.dashboard-audience {
  margin-top: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-muted);
}

.dashboard-audience__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
}

.dashboard-audience__value {
  display: block;
  margin-top: 0.2rem;
  color: var(--text);
  font-family: 'Gilda Display', serif;
  font-size: 1.05rem;
  font-weight: normal;
}

.dashboard-audience__value span {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
}

.dashboard-audience__bar {
  height: 10px;
  margin-top: 0.6rem;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 12%, var(--surface));
}

.dashboard-audience__bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #f0a05a));
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

@media (max-width: 900px) {
  .dashboard-insights {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .dashboard-insights {
    grid-template-columns: minmax(0, 1fr);
  }
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
