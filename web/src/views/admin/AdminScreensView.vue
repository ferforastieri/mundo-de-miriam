<template>
  <div>
    <header class="admin-page-header">
      <div>
        <h1 class="admin-title">Telas</h1>
        <p class="admin-subtitle">
          Ajuste os nomes exibidos, a ordem das telas no painel, a visibilidade de cada seção e as marcas
          das parcerias.
        </p>
      </div>

      <div class="admin-actions-row">
        <button class="admin-btn admin-btn--primary" type="button" @click="showCreate = !showCreate">
          {{ showCreate ? 'Cancelar' : '+ Nova tela' }}
        </button>
      </div>
    </header>

    <form v-if="showCreate" class="admin-card screen-create" @submit.prevent="submitCreate">
      <div class="admin-card__header">
        <div>
          <h2 class="admin-card__title">Nova tela</h2>
          <p class="admin-card__hint">
            Ela aparece nas abas de Fotos e no menu do site em <code>/galeria/&lt;identificador&gt;</code>.
          </p>
        </div>
      </div>

      <div class="screen-create__grid">
        <label class="admin-field">
          <span class="admin-label">Nome</span>
          <input v-model="createForm.name" class="admin-input" maxlength="80" required placeholder="Ex.: Noivas" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Identificador (opcional)</span>
          <input v-model="createForm.id" class="admin-input" maxlength="60" placeholder="gerado do nome" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Tipo</span>
          <select v-model="createForm.kind" class="admin-select">
            <option value="gallery">Galeria de fotos</option>
            <option value="partnerships">Parcerias (com marcas)</option>
            <option value="single">Imagem única</option>
          </select>
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
          <select v-model="createForm.icon" class="admin-select">
            <option v-for="icon in SCREEN_ICONS" :key="icon.value" :value="icon.value">
              {{ icon.label }}
            </option>
          </select>
        </label>
      </div>

      <label class="admin-checkbox">
        <input v-model="createForm.visible" type="checkbox" />
        Publicar a tela no site
      </label>

      <div class="admin-actions-row">
        <button class="admin-btn admin-btn--primary" type="submit" :disabled="creatingScreen">
          {{ creatingScreen ? 'Criando…' : 'Criar tela' }}
        </button>
      </div>
    </form>

    <div v-if="isPending" class="admin-card">
      <p class="admin-empty">Carregando telas…</p>
    </div>

    <div v-else-if="isError" class="admin-alert admin-alert--error">
      {{ error?.message || 'Não foi possível carregar as telas.' }}
    </div>

    <div v-else class="screens-list">
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
            <span class="admin-tag" :class="screen.visible ? 'admin-tag--success' : ''">
              {{ screen.visible ? 'Publicada' : 'Oculta' }}
            </span>
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
              <select v-model="drafts[screen.id].icon" class="admin-select">
                <option v-for="icon in SCREEN_ICONS" :key="icon.value" :value="icon.value">
                  {{ icon.label }}
                </option>
              </select>
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

const toast = useAdminToast()

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

const showCreate = ref(false)
const creatingScreen = ref(false)
const createForm = reactive({
  name: '',
  id: '',
  description: '',
  kind: 'gallery',
  visible: true,
  menuLabel: '',
  menuCategory: '',
  icon: 'image'
})

async function submitCreate() {
  if (!createForm.name.trim()) return

  creatingScreen.value = true

  try {
    await adminService.createScreen({
      name: createForm.name.trim(),
      id: createForm.id.trim() || undefined,
      description: createForm.description.trim(),
      kind: createForm.kind,
      visible: createForm.visible,
      menuLabel: createForm.menuLabel.trim() || undefined,
      menuCategory: createForm.menuCategory.trim(),
      icon: createForm.icon
    })
    toast.success('Tela criada.')
    showCreate.value = false
    createForm.name = ''
    createForm.id = ''
    createForm.description = ''
    createForm.kind = 'gallery'
    createForm.visible = true
    createForm.menuLabel = ''
    createForm.menuCategory = ''
    createForm.icon = 'image'
    await refetch()
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
  queryKey: ['admin-screens'],
  queryFn: () => adminService.getScreens()
})

const screens = computed(() => data.value?.screens || [])
const drafts = reactive({})
const groupDrafts = reactive({})

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

      for (const group of screen.groups || []) {
        groupDrafts[group.id] = { name: group.name }
      }
    }
  },
  { immediate: true, deep: false }
)

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
.screen-create {
  margin-bottom: 1rem;
}

.screen-create__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.2fr);
  gap: 0.75rem;
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
