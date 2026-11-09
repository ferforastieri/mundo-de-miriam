<template>
  <div class="content-page">
    <header class="admin-page-header content-intro">
      <div>
        <p class="content-eyebrow">Conteúdo do site</p>
        <h1 class="admin-title">Telas e fotos</h1>
        <p class="admin-subtitle">
          Um só lugar para criar as seções do site, enviar as fotos e definir o que fica visível.
        </p>
      </div>

      <button
        class="admin-btn content-help-btn"
        type="button"
        :data-tip="helpPreview"
        aria-haspopup="dialog"
        @click="helpOpen = true"
      >
        <AdminIcon name="help" />
        Como funciona
      </button>
    </header>

    <section class="content-flow" aria-label="Resumo do passo a passo">
      <button
        v-for="(step, index) in quickSteps"
        :key="step.title"
        class="content-flow__step"
        type="button"
        :title="step.detail"
        @click="goToStep(step)"
      >
        <span class="content-flow__num">{{ index + 1 }}</span>
        <span class="content-flow__text">
          <strong>{{ step.title }}</strong>
          <small>{{ step.short }}</small>
        </span>
      </button>
    </section>

    <div class="content-tabs-row">
      <div class="admin-tabs" role="tablist" aria-label="Telas e fotos">
        <button
          class="admin-tab"
          :class="{ 'admin-tab--active': tab === 'photos' }"
          type="button"
          role="tab"
          :aria-selected="tab === 'photos'"
          @click="setTab('photos')"
        >
          <AdminIcon name="image" />
          Fotos
        </button>
        <button
          class="admin-tab"
          :class="{ 'admin-tab--active': tab === 'screens' }"
          type="button"
          role="tab"
          :aria-selected="tab === 'screens'"
          @click="setTab('screens')"
        >
          <AdminIcon name="layers" />
          Telas
        </button>
      </div>

      <button class="admin-btn admin-btn--small content-help-link" type="button" @click="helpOpen = true">
        <AdminIcon name="help" />
        Passo a passo
      </button>
    </div>

    <p class="content-hint" role="status">
      <AdminIcon :name="tab === 'photos' ? 'image' : 'layers'" />
      {{ activeHint }}
    </p>

    <AdminPhotosView v-if="tab === 'photos'" />
    <AdminScreensView v-else />
  </div>

  <AdminModal
    :open="helpOpen"
    title="Como organizar telas e fotos"
    size="lg"
    @close="helpOpen = false"
  >
    <p class="admin-modal__hint">
      O site é montado em duas camadas: a <strong>tela</strong> é a seção que aparece no menu e a
      <strong>foto</strong> é o conteúdo dentro dela. Você administra as duas aqui, na mesma página.
    </p>

    <ol class="content-guide">
      <li v-for="(step, index) in guideSteps" :key="step.title">
        <span class="content-guide__num">{{ index + 1 }}</span>
        <div>
          <strong>{{ step.title }}</strong>
          <p>{{ step.text }}</p>
        </div>
      </li>
    </ol>

    <div class="content-guide__tip">
      <AdminIcon name="help" />
      <p>
        <strong>Dica:</strong> nada aparece no site até a tela estar marcada como visível. Para
        parcerias, crie primeiro a marca na aba <strong>Telas</strong> e depois envie as fotos na
        aba <strong>Fotos</strong>.
      </p>
    </div>

    <template #footer>
      <button class="admin-btn" type="button" @click="switchFromGuide('screens')">
        Ir para Telas
      </button>
      <button class="admin-btn admin-btn--primary" type="button" @click="helpOpen = false">
        Entendi
      </button>
    </template>
  </AdminModal>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminIcon from '@/components/admin/AdminIcon.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPhotosView from './AdminPhotosView.vue'
import AdminScreensView from './AdminScreensView.vue'

const route = useRoute()
const router = useRouter()

const tab = ref(route.query.tab === 'screens' ? 'screens' : 'photos')
const helpOpen = ref(false)

const helpPreview = [
  '1. Escolha a tela',
  '2. Envie as fotos',
  '3. Organize (destaque, oculte, ordene)',
  '4. Crie novas telas',
  '',
  'Clique para abrir o guia completo.'
].join('\n')

const quickSteps = [
  {
    title: 'Escolha a tela',
    short: 'Beauty, Artístico, Parcerias…',
    detail: 'A tela é a seção onde as fotos vão aparecer. Escolha uma na aba Fotos.',
    tab: 'photos'
  },
  {
    title: 'Envie as fotos',
    short: 'Arraste os arquivos',
    detail: 'Use a área de envio para adicionar fotos e vídeos à tela escolhida.',
    tab: 'photos'
  },
  {
    title: 'Organize',
    short: 'Destaque, oculte e ordene',
    detail: 'Clique em uma foto para editar a legenda, destacar, ocultar ou mudar a ordem.',
    tab: 'photos'
  },
  {
    title: 'Crie novas telas',
    short: 'Nome, menu e visibilidade',
    detail: 'Na aba Telas você cria seções, ajusta o menu e gera links privados.',
    tab: 'screens'
  }
]

const guideSteps = [
  {
    title: 'Crie ou ajuste a tela',
    text: 'Na aba Telas, dê um nome para a seção (por exemplo, Beauty ou Artístico), escolha o rótulo do menu e marque se ela aparece no site. Clique em Salvar tela.'
  },
  {
    title: 'Escolha onde as fotos vão ficar',
    text: 'Na aba Fotos, selecione a tela no topo. Se for a tela de Parcerias, escolha também a marca. Assim cada foto fica no lugar certo.'
  },
  {
    title: 'Envie e organize as fotos',
    text: 'Arraste os arquivos para a área de envio. Depois clique em uma foto para editar a legenda, destacar como capa, ocultar do site ou mudar a ordem.'
  },
  {
    title: 'Confira e publique',
    text: 'Use a seta de abrir no card da tela para ver como ela está no site. Para o Instagram, use a aba Publicar. Nada é publicado automaticamente.'
  }
]

const activeHint = computed(() =>
  tab.value === 'photos'
    ? 'Escolha a tela, selecione a marca quando for Parcerias e envie os arquivos. Clique em uma foto para editar, destacar, ocultar ou reordenar.'
    : 'Crie, renomeie, reordene e defina o que aparece no menu. As fotos de cada tela ficam na aba Fotos.'
)

watch(
  () => route.query.tab,
  (value) => {
    tab.value = value === 'screens' ? 'screens' : 'photos'
  }
)

function setTab(next) {
  if (tab.value === next) return

  tab.value = next

  router.replace({
    name: 'AdminContent',
    query: next === 'screens' ? { tab: 'screens' } : {}
  })
}

async function goToStep(step) {
  setTab(step.tab)
  await nextTick()
  document.querySelector('.content-tabs-row')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function switchFromGuide(next) {
  setTab(next)
  helpOpen.value = false
}
</script>

<style scoped>
.content-page {
  display: flex;
  flex-direction: column;
}

.content-intro {
  align-items: center;
}

.content-eyebrow {
  margin: 0 0 0.3rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.content-help-btn {
  position: relative;
}

.content-help-btn::after {
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.45rem);
  z-index: 20;
  width: max-content;
  max-width: 260px;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  background: var(--primary);
  color: var(--on-primary);
  content: attr(data-tip);
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  line-height: 1.35;
  opacity: 0;
  pointer-events: none;
  text-align: left;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
  white-space: pre-line;
}

.content-help-btn:hover::after,
.content-help-btn:focus-visible::after {
  opacity: 1;
  transform: translateY(0);
}

.content-flow {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
  margin-bottom: 1.1rem;
}

.content-flow__step {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.content-flow__step:hover,
.content-flow__step:focus-visible {
  border-color: var(--primary);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.content-flow__num {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
}

.content-flow__text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.1rem;
}

.content-flow__text strong {
  font-family: 'Gilda Display', serif;
  font-size: 0.9rem;
  font-weight: normal;
  line-height: 1.2;
}

.content-flow__text small {
  overflow: hidden;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-tabs-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  scroll-margin-top: 1rem;
}

.content-help-link {
  color: var(--muted);
}

.content-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0.7rem 0 1rem;
  padding: 0.7rem 0.85rem;
  border: 1px dashed var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.76rem;
  line-height: 1.5;
}

.content-hint :deep(.admin-icon) {
  margin-top: 1px;
  color: var(--primary);
}

.content-guide {
  display: grid;
  gap: 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.content-guide li {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
}

.content-guide__num {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
  border: 1px solid var(--primary);
  border-radius: 50%;
  color: var(--primary);
  font-family: system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
}

.content-guide strong {
  display: block;
  margin-bottom: 0.15rem;
  color: var(--text);
  font-family: 'Gilda Display', serif;
  font-size: 0.98rem;
  font-weight: normal;
}

.content-guide p {
  margin: 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  line-height: 1.55;
}

.content-guide__tip {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: 1.1rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.content-guide__tip :deep(.admin-icon) {
  margin-top: 1px;
  color: var(--primary);
}

.content-guide__tip p {
  margin: 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
  line-height: 1.5;
}

.content-guide__tip strong {
  color: var(--text);
}

@media (max-width: 900px) {
  .content-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .content-intro {
    align-items: flex-start;
  }

  .content-help-btn {
    width: 100%;
    justify-content: center;
  }

  .content-flow {
    grid-template-columns: minmax(0, 1fr);
  }

  .content-tabs-row {
    align-items: stretch;
  }

  .content-help-link {
    justify-content: center;
  }
}
</style>
