<template>
  <div>
    <div class="admin-page-actions">
      <button class="admin-btn admin-btn--primary" type="button" @click="showCreate = true">
        + Nova tela
      </button>
    </div>


    <AdminSkeleton v-if="isPending" variant="cards" />

    <div v-else-if="isError" class="admin-alert admin-alert--error">
      {{ error?.message || 'Não foi possível carregar as telas.' }}
    </div>

    <template v-else>
      <div class="screens-list">
      <article v-for="(screen, index) in screens" :key="screen.id" class="admin-card screen-card">
        <div class="screen-card__header">
          <div>
            <h2 class="admin-card__title">{{ screen.name }}</h2>
            <p class="admin-card__hint">
              {{ screen.photoCount }} foto{{ screen.photoCount === 1 ? '' : 's' }} ·
              {{ screen.kind === 'partnerships' ? 'Parcerias' : screen.kind === 'single' ? 'Imagem única' : 'Galeria' }} ·
              ordem {{ screen.position }}
            </p>
          </div>

          <div class="admin-actions-row">
            <div class="screen-card__movers">
              <button
                class="admin-btn admin-btn--small"
                type="button"
                :disabled="index === 0"
                title="Mover para cima"
                @click="moveScreen(index, -1)"
              >
                ↑
              </button>
              <button
                class="admin-btn admin-btn--small"
                type="button"
                :disabled="index === screens.length - 1"
                title="Mover para baixo"
                @click="moveScreen(index, 1)"
              >
                ↓
              </button>
            </div>
            <button
              class="admin-btn admin-btn--small admin-btn--danger"
              type="button"
              @click="askDeleteScreen(screen)"
            >
              Excluir
            </button>
          </div>
        </div>

        <div class="screen-card__form">
          <label class="admin-field">
            <span class="admin-label">Nome exibido</span>
            <input v-model="drafts[screen.id].name" class="admin-input" maxlength="80" />
          </label>

          <label class="admin-field">
            <span class="admin-label">Descrição</span>
            <input v-model="drafts[screen.id].description" class="admin-input" maxlength="240" />
          </label>

          <div class="screen-create__grid">
            <label class="admin-field">
              <span class="admin-label">Rótulo no menu</span>
              <input v-model="drafts[screen.id].menuLabel" class="admin-input" maxlength="24" />
            </label>

            <label class="admin-field">
              <span class="admin-label">Categoria no menu</span>
              <input v-model="drafts[screen.id].menuCategory" class="admin-input" maxlength="24" />
            </label>

            <label class="admin-field">
              <span class="admin-label">Ícone</span>
              <AdminSelect
                v-model="drafts[screen.id].icon"
                :options="SCREEN_ICONS"
                aria-label="Ícone"
              />
            </label>
          </div>

          <div class="screen-card__footer">
            <label class="admin-checkbox">
              <input v-model="drafts[screen.id].visible" type="checkbox" />
              Exibir esta tela no site
            </label>

            <button
              class="admin-btn admin-btn--primary admin-btn--small"
              type="button"
              :disabled="savingScreenId === screen.id"
              @click="saveScreen(screen)"
            >
              {{ savingScreenId === screen.id ? 'Salvando…' : 'Salvar tela' }}
            </button>
          </div>
        </div>

        <hr class="admin-separator" />

        <div class="screen-share">
          <div class="screen-share__head">
            <span class="admin-label">Link privado</span>
            <span
              class="admin-tag"
              :class="{
                'admin-tag--success': screen.shareToken && !shareIsExpired(screen),
                'admin-tag--danger': shareIsExpired(screen)
              }"
            >
              {{ shareLabel(screen) }}
            </span>
          </div>

          <p class="admin-card__hint">
            Não aparece no site nem nos buscadores. Quem tiver o link vê as fotos desta tela.
          </p>

          <template v-if="screen.shareToken">
            <div class="screen-share__row">
              <input class="admin-input" :value="shareUrl(screen)" readonly />
              <button class="admin-btn admin-btn--small" type="button" @click="copyShareLink(screen)">
                Copiar
              </button>
              <a class="admin-btn admin-btn--small" :href="shareUrl(screen)" target="_blank" rel="noopener">
                Abrir
              </a>
            </div>

            <div class="screen-share__row">
              <label class="admin-field">
                <span class="admin-label">Nova validade</span>
                <AdminSelect
                  :model-value="shareExpiry[screen.id]"
                  :options="SHARE_EXPIRY_OPTIONS"
                  aria-label="Nova validade"
                  @change="updateShareExpiry(screen, $event)"
                />
              </label>

              <button
                class="admin-btn admin-btn--small"
                type="button"
                :disabled="sharingScreenId === screen.id"
                @click="rotateShare(screen)"
              >
                Gerar novo link
              </button>

              <button
                class="admin-btn admin-btn--small admin-btn--danger"
                type="button"
                :disabled="sharingScreenId === screen.id"
                @click="revokeShare(screen)"
              >
                Revogar link
              </button>
            </div>
          </template>

          <div v-else class="screen-share__row">
            <button
              class="admin-btn admin-btn--primary admin-btn--small"
              type="button"
              :disabled="sharingScreenId === screen.id"
              @click="createShare(screen)"
            >
              {{ sharingScreenId === screen.id ? 'Gerando…' : 'Gerar link privado' }}
            </button>
          </div>
        </div>

        <template v-if="screen.kind === 'partnerships'">
          <hr class="admin-separator" />

          <div class="screen-card__header">
            <div>
              <h3 class="screen-card__subtitle">Marcas e parcerias</h3>
              <p class="admin-card__hint">
                Cada marca vira um cartão no site. A capa é definida na tela de Fotos.
              </p>
            </div>

            <button
              v-if="creatingForScreenId !== screen.id"
              class="admin-btn admin-btn--small"
              type="button"
              @click="startCreateGroup(screen.id)"
            >
              + Nova marca
            </button>
          </div>

          <form
            v-if="creatingForScreenId === screen.id"
            class="group-create-form"
            @submit.prevent="createGroup(screen.id)"
          >
            <input
              v-model="newGroupName"
              class="admin-input"
              maxlength="60"
              placeholder="Nome da marca"
              required
            />
            <button class="admin-btn admin-btn--primary admin-btn--small" type="submit" :disabled="creatingGroup">
              {{ creatingGroup ? 'Criando…' : 'Criar' }}
            </button>
            <button class="admin-btn admin-btn--small" type="button" @click="cancelCreateGroup">
              Cancelar
            </button>
          </form>

          <p v-if="screen.groups.length === 0" class="admin-empty">
            Nenhuma marca cadastrada nesta tela.
          </p>

          <ul v-else class="group-list">
            <li v-for="(group, groupIndex) in screen.groups" :key="group.id" class="group-row">
              <div class="group-row__main">
                <input v-model="groupDrafts[group.id].name" class="admin-input" maxlength="60" />
                <span class="admin-tag">{{ group.photoCount }} foto{{ group.photoCount === 1 ? '' : 's' }}</span>
              </div>

              <div class="admin-actions-row">
                <button
                  class="admin-btn admin-btn--small"
                  type="button"
                  :disabled="groupIndex === 0"
                  title="Mover para cima"
                  @click="moveGroup(screen, groupIndex, -1)"
                >
                  ↑
                </button>
                <button
                  class="admin-btn admin-btn--small"
                  type="button"
                  :disabled="groupIndex === screen.groups.length - 1"
                  title="Mover para baixo"
                  @click="moveGroup(screen, groupIndex, 1)"
                >
                  ↓
                </button>
                <button
                  class="admin-btn admin-btn--primary admin-btn--small"
                  type="button"
                  :disabled="savingGroupId === group.id"
                  @click="saveGroup(group)"
                >
                  {{ savingGroupId === group.id ? 'Salvando…' : 'Salvar' }}
                </button>
                <button
                  class="admin-btn admin-btn--small admin-btn--danger"
                  type="button"
                  @click="askDeleteGroup(group)"
                >
                  Excluir
                </button>
              </div>
            </li>
          </ul>
        </template>
      </article>
      </div>

      <PaginationBar :pagination="pagination" label="telas" @update:page="page = $event" />
    </template>

    <AdminModal :open="showCreate" title="Nova tela" size="lg" @close="closeCreate">
    <form class="screen-create" @submit.prevent="submitCreate">
      <p class="admin-card__hint">
        Ela aparece nas abas de Fotos; se publicada, entra no menu do site em
        <code>/galeria/&lt;identificador gerado do nome&gt;</code>.
      </p>

      <div class="screen-create__grid screen-create__grid--pair">
        <label class="admin-field">
          <span class="admin-label">Nome</span>
          <input v-model="createForm.name" class="admin-input" maxlength="80" required placeholder="Ex.: Noivas" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Tipo</span>
          <AdminSelect v-model="createForm.kind" :options="KIND_OPTIONS" aria-label="Tipo" />
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Descrição (opcional)</span>
        <input v-model="createForm.description" class="admin-input" maxlength="240" placeholder="Aparece no topo da página" />
      </label>

      <div class="screen-create__grid">
        <label class="admin-field">
          <span class="admin-label">Rótulo no menu</span>
          <input v-model="createForm.menuLabel" class="admin-input" maxlength="24" placeholder="Ex.: Noivas (padrão: o nome)" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Categoria no menu</span>
          <input v-model="createForm.menuCategory" class="admin-input" maxlength="24" placeholder="Ex.: Maquiagem" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Ícone</span>
          <AdminSelect v-model="createForm.icon" :options="SCREEN_ICONS" aria-label="Ícone" />
        </label>
      </div>

      <div class="screen-create__grid screen-create__grid--pair">
        <label class="admin-field">
          <span class="admin-label">Publicação</span>
          <AdminSelect v-model="createForm.access" :options="ACCESS_OPTIONS" aria-label="Publicação" />
        </label>

        <label v-if="createForm.access === 'link'" class="admin-field">
          <span class="admin-label">Validade do link</span>
          <AdminSelect
            v-model="createForm.expiresInDays"
            :options="SHARE_EXPIRY_OPTIONS"
            aria-label="Validade do link"
          />
        </label>
      </div>

      <div class="admin-actions-row">
        <button class="admin-btn admin-btn--primary" type="submit" :disabled="creatingScreen">
          {{ creatingScreen ? 'Criando…' : 'Criar tela' }}
        </button>
      </div>
    </form>
    </AdminModal>

    <ConfirmDialog
      :open="Boolean(screenToDelete)"
      title="Excluir tela"
      :message="deleteScreenMessage"
      confirm-label="Excluir para sempre"
      :loading="deletingScreen"
      danger
      @confirm="confirmDeleteScreen"
      @cancel="screenToDelete = null"
    />

    <ConfirmDialog
      :open="Boolean(groupToDelete)"
      title="Excluir marca"
      :message="groupToDelete ? `A marca “${groupToDelete.name}” será removida. Só é possível excluir marcas sem fotos.` : ''"
      confirm-label="Excluir marca"
      :loading="deletingGroup"
      danger
      @confirm="confirmDeleteGroup"
      @cancel="groupToDelete = null"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import { useAdminToast } from '@/composables/useAdminToast'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminSelect from '@/components/admin/AdminSelect.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import PaginationBar from '@/components/admin/PaginationBar.vue'
import { formatDate } from '@/utils/format.js'

const toast = useAdminToast()

const KIND_OPTIONS = [
  { value: 'gallery', label: 'Galeria de fotos' },
  { value: 'partnerships', label: 'Parcerias (com marcas)' },
  { value: 'single', label: 'Imagem única' }
]

const ACCESS_OPTIONS = [
  { value: 'public', label: 'No site (aparece no menu)' },
  { value: 'link', label: 'Link privado (só quem tem o link)' },
  { value: 'draft', label: 'Rascunho (não publica)' }
]

const SCREEN_ICONS = [
  { value: 'image', label: 'Imagem / galeria' },
  { value: 'palette', label: 'Paleta (arte)' },
  { value: 'camera', label: 'Câmera (fotografia)' },
  { value: 'partnership', label: 'Parceria' },
  { value: 'portrait', label: 'Retrato (pessoa)' },
  { value: 'document', label: 'Documento (currículo)' },
  { value: 'symbol', label: 'Símbolo' },
  { value: 'star', label: 'Estrela' }
]

const SHARE_EXPIRY_OPTIONS = [
  { value: '0', label: 'Para sempre' },
  { value: '7', label: '7 dias' },
  { value: '30', label: '30 dias' },
  { value: '60', label: '60 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '180 dias' },
  { value: '365', label: '365 dias' }
]

const showCreate = ref(false)
const page = ref(1)

function closeCreate() {
  showCreate.value = false
}
const creatingScreen = ref(false)
const createForm = reactive({
  name: '',
  description: '',
  kind: 'gallery',
  access: 'public',
  expiresInDays: '0',
  menuLabel: '',
  menuCategory: '',
  icon: 'image'
})

async function submitCreate() {
  if (!createForm.name.trim()) return

  creatingScreen.value = true

  try {
    const created = await adminService.createScreen({
      name: createForm.name.trim(),
      description: createForm.description.trim(),
      kind: createForm.kind,
      visible: createForm.access === 'public',
      menuLabel: createForm.menuLabel.trim() || undefined,
      menuCategory: createForm.menuCategory.trim(),
      icon: createForm.icon
    })

    if (createForm.access === 'link') {
      await adminService.shareScreen(created.id, {
        expiresInDays: Number(createForm.expiresInDays)
      })
    }

    toast.success(
      createForm.access === 'link' ? 'Tela criada com link privado.' : 'Tela criada.'
    )
    showCreate.value = false
    await refetch()
    page.value = pagination.value?.totalPages || 1
    createForm.name = ''
    createForm.description = ''
    createForm.kind = 'gallery'
    createForm.access = 'public'
    createForm.expiresInDays = '0'
    createForm.menuLabel = ''
    createForm.menuCategory = ''
    createForm.icon = 'image'
  } catch (error) {
    toast.error(error.message || 'Não foi possível criar a tela.')
  } finally {
    creatingScreen.value = false
  }
}

const {
  data,
  isPending,
  isError,
  error,
  refetch
} = useQuery({
  queryKey: ['admin-screens', page],
  queryFn: () => adminService.getScreens({ page: page.value, pageSize: 5 })
})

const screens = computed(() => data.value?.screens || [])
const pagination = computed(() => data.value?.pagination || null)
const drafts = reactive({})
const groupDrafts = reactive({})
const shareExpiry = reactive({})
const sharingScreenId = ref('')

function shareUrl(screen) {
  return `${window.location.origin}/a/${screen.shareToken}`
}

function shareIsExpired(screen) {
  return Boolean(screen.expiresAt) && new Date(screen.expiresAt).getTime() <= Date.now()
}

function shareLabel(screen) {
  if (!screen.shareToken) return 'Sem link'
  if (shareIsExpired(screen)) return 'Expirado'
  if (screen.expiresAt) return `Ativo até ${formatDate(screen.expiresAt)}`
  return 'Ativo para sempre'
}

async function runShareAction(screen, action, successMessage) {
  sharingScreenId.value = screen.id

  try {
    await action()
    toast.success(successMessage)
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível atualizar o link.')
  } finally {
    sharingScreenId.value = ''
  }
}

function createShare(screen) {
  return runShareAction(
    screen,
    () =>
      adminService.shareScreen(screen.id, {
        expiresInDays: Number(shareExpiry[screen.id] || 0)
      }),
    'Link privado criado.'
  )
}

function updateShareExpiry(screen, value) {
  shareExpiry[screen.id] = value

  return runShareAction(
    screen,
    () => adminService.shareScreen(screen.id, { expiresInDays: Number(value) }),
    'Validade do link atualizada.'
  )
}

function rotateShare(screen) {
  return runShareAction(
    screen,
    () =>
      adminService.shareScreen(screen.id, {
        expiresInDays: Number(shareExpiry[screen.id] || 0),
        rotate: true
      }),
    'Novo link gerado (o anterior deixou de funcionar).'
  )
}

function revokeShare(screen) {
  return runShareAction(
    screen,
    () => adminService.revokeScreenShare(screen.id),
    'Link privado removido.'
  )
}

async function copyShareLink(screen) {
  try {
    await navigator.clipboard.writeText(shareUrl(screen))
    toast.success('Link copiado.')
  } catch {
    toast.error('Não foi possível copiar. Selecione o link manualmente.')
  }
}

watch(
  screens,
  (list) => {
    for (const screen of list) {
      drafts[screen.id] = {
        name: screen.name,
        description: screen.description || '',
        visible: screen.visible,
        sortOrder: screen.position,
        menuLabel: screen.menuLabel,
        menuCategory: screen.menuCategory,
        icon: screen.icon
      }

      shareExpiry[screen.id] = '0'

      for (const group of screen.groups || []) {
        groupDrafts[group.id] = { name: group.name }
      }
    }
  },
  { immediate: true, deep: false }
)

const screenToDelete = ref(null)
const deletingScreen = ref(false)

const deleteScreenMessage = computed(() => {
  if (!screenToDelete.value) return ''

  const total = screenToDelete.value.photoCount || 0
  const arquivos = total === 1 ? '1 foto/vídeo' : `${total} fotos/vídeos`

  return `A tela “${screenToDelete.value.name}” e ${arquivos} serão removidos para sempre do site e do armazenamento. Não dá para desfazer.`
})

function askDeleteScreen(screen) {
  screenToDelete.value = screen
}

async function confirmDeleteScreen() {
  if (!screenToDelete.value) return

  deletingScreen.value = true

  try {
    const result = await adminService.deleteScreen(screenToDelete.value.id)
    toast.success(
      result.failedFiles
        ? `Tela excluída (${result.failedFiles} arquivo(s) não puderam ser removidos).`
        : 'Tela excluída.'
    )
    screenToDelete.value = null

    if (screens.value.length === 1 && page.value > 1) {
      page.value -= 1
    }

    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível excluir a tela.')
  } finally {
    deletingScreen.value = false
  }
}

const savingScreenId = ref('')
const savingGroupId = ref('')

async function saveScreen(screen) {
  savingScreenId.value = screen.id

  try {
    await adminService.updateScreen(screen.id, drafts[screen.id])
    toast.success('Tela atualizada.')
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível salvar a tela.')
  } finally {
    savingScreenId.value = ''
  }
}

async function moveScreen(index, direction) {
  const targetIndex = index + direction
  const current = screens.value[index]
  const neighbor = screens.value[targetIndex]

  if (!current || !neighbor) return

  try {
    await Promise.all([
      adminService.updateScreen(current.id, { sortOrder: neighbor.position }),
      adminService.updateScreen(neighbor.id, { sortOrder: current.position })
    ])
    toast.success('Ordem das telas atualizada.')
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível reordenar as telas.')
  }
}

async function saveGroup(group) {
  savingGroupId.value = group.id

  try {
    await adminService.updateGroup(group.id, groupDrafts[group.id])
    toast.success('Marca atualizada.')
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível salvar a marca.')
  } finally {
    savingGroupId.value = ''
  }
}

async function moveGroup(screen, groupIndex, direction) {
  const targetIndex = groupIndex + direction
  const current = screen.groups[groupIndex]
  const neighbor = screen.groups[targetIndex]

  if (!current || !neighbor) return

  try {
    await Promise.all([
      adminService.updateGroup(current.id, { sortOrder: neighbor.position }),
      adminService.updateGroup(neighbor.id, { sortOrder: current.position })
    ])
    toast.success('Ordem das marcas atualizada.')
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível reordenar as marcas.')
  }
}

const creatingForScreenId = ref('')
const newGroupName = ref('')
const creatingGroup = ref(false)

function startCreateGroup(screenId) {
  creatingForScreenId.value = screenId
  newGroupName.value = ''
}

function cancelCreateGroup() {
  creatingForScreenId.value = ''
  newGroupName.value = ''
}

async function createGroup(screenId) {
  const name = newGroupName.value.trim()
  if (!name) return

  creatingGroup.value = true

  try {
    await adminService.createGroup(screenId, name)
    toast.success('Marca criada.')
    cancelCreateGroup()
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível criar a marca.')
  } finally {
    creatingGroup.value = false
  }
}

const groupToDelete = ref(null)
const deletingGroup = ref(false)

function askDeleteGroup(group) {
  groupToDelete.value = group
}

async function confirmDeleteGroup() {
  if (!groupToDelete.value) return

  deletingGroup.value = true

  try {
    await adminService.deleteGroup(groupToDelete.value.id)
    toast.success('Marca excluída.')
    groupToDelete.value = null
    await refetch()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível excluir a marca.')
  } finally {
    deletingGroup.value = false
  }
}
</script>

<style scoped>
.screen-share {
  display: grid;
  gap: 0.6rem;
}

.screen-share__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.screen-share__row {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.5rem;
}

.screen-share__row .admin-input {
  flex: 1 1 260px;
}

.screen-create {
  display: grid;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.screen-create__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.2fr);
  gap: 0.75rem;
}

.screen-create__grid--pair {
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
}

@media (max-width: 760px) {
  .screen-create__grid {
    grid-template-columns: 1fr;
  }
}

.screens-list {
  display: grid;
  gap: 1rem;
}

.screen-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.screen-card__form {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.screen-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.screen-card__subtitle {
  margin: 0;
  color: var(--text);
  font-size: 1rem;
  font-weight: normal;
}

.group-create-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.75rem;
}

.group-create-form .admin-input {
  flex: 1;
  min-width: 180px;
}

.group-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.group-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.group-row__main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;
}

.group-row__main .admin-input {
  flex: 1;
}
</style>
