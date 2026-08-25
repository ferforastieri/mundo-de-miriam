<template>
  <div ref="root" class="styled-select" :class="[`styled-select--${placement}`, { 'styled-select--compact': compact }]">
    <button
      class="styled-select__trigger"
      type="button"
      :aria-label="ariaLabel"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <span>{{ compact ? selectedOption?.shortLabel || selectedOption?.label : selectedOption?.label }}</span>
      <svg v-if="!compact" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m6 8 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="styled-select-menu">
      <div v-if="isOpen" class="styled-select__menu" role="listbox" :aria-label="ariaLabel">
        <button
          v-for="(option, index) in options"
          :key="option.value"
          :ref="(element) => setOptionRef(element, index)"
          class="styled-select__option"
          :class="{ 'styled-select__option--selected': option.value === modelValue }"
          type="button"
          role="option"
          :aria-selected="option.value === modelValue"
          @click="selectOption(option.value)"
          @keydown="handleOptionKeydown($event, index)"
        >
          <span>{{ option.label }}</span>
          <svg v-if="option.value === modelValue" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 10 3 3 7-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true, default: () => [] },
  ariaLabel: { type: String, default: 'Selecionar opção' },
  compact: { type: Boolean, default: false },
  placement: { type: String, default: 'top' }
})

const emit = defineEmits(['update:modelValue', 'change'])
const root = ref(null)
const isOpen = ref(false)
const optionRefs = ref([])
const selectedOption = computed(() => props.options.find((option) => option.value === props.modelValue) || props.options[0])

const setOptionRef = (element, index) => { if (element) optionRefs.value[index] = element }

const focusSelected = async () => {
  await nextTick()
  const index = Math.max(0, props.options.findIndex((option) => option.value === props.modelValue))
  optionRefs.value[index]?.focus()
}

const open = () => {
  isOpen.value = true
  optionRefs.value = []
  focusSelected()
}

const close = () => { isOpen.value = false }
const toggle = () => { isOpen.value ? close() : open() }

const selectOption = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  close()
  nextTick(() => root.value?.querySelector('.styled-select__trigger')?.focus())
}

const handleTriggerKeydown = (event) => {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    open()
  }
}

const handleOptionKeydown = (event, index) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    nextTick(() => root.value?.querySelector('.styled-select__trigger')?.focus())
    return
  }
  if (event.key === 'Tab') {
    close()
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectOption(props.options[index].value)
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  let nextIndex = index
  if (event.key === 'ArrowDown') nextIndex = (index + 1) % props.options.length
  if (event.key === 'ArrowUp') nextIndex = (index - 1 + props.options.length) % props.options.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = props.options.length - 1
  optionRefs.value[nextIndex]?.focus()
}

const handleOutsideClick = (event) => {
  if (!root.value?.contains(event.target)) close()
}

onMounted(() => document.addEventListener('pointerdown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutsideClick))
</script>

<style scoped>
.styled-select { position: relative; min-width: 132px; font-family: system-ui, sans-serif; }
.styled-select__trigger {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18px;
  gap: 0.65rem;
  align-items: center;
  width: 100%;
  min-height: 38px;
  padding: 0.55rem 0.7rem;
  color: var(--text);
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 10px;
  font: inherit;
  font-size: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.styled-select__trigger:hover { border-color: var(--primary); }
.styled-select__trigger:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.styled-select__trigger svg { width: 18px; height: 18px; transition: transform 0.2s ease; }
.styled-select:has(.styled-select__menu) .styled-select__trigger svg { transform: rotate(180deg); }
.styled-select__menu {
  position: absolute;
  right: 0;
  z-index: 10030;
  width: max(100%, 172px);
  max-height: 260px;
  padding: 0.35rem;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.18);
}
.styled-select--top .styled-select__menu { bottom: calc(100% + 0.5rem); }
.styled-select--bottom .styled-select__menu { top: calc(100% + 0.5rem); }
.styled-select__option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18px;
  align-items: center;
  width: 100%;
  min-height: 38px;
  padding: 0.55rem 0.65rem;
  color: var(--text);
  background: transparent;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-size: 0.75rem;
  text-align: left;
  cursor: pointer;
}
.styled-select__option:hover,
.styled-select__option:focus-visible { color: var(--primary); background: var(--surface-muted); outline: none; }
.styled-select__option--selected { color: var(--primary); font-weight: 700; }
.styled-select__option svg { width: 18px; height: 18px; }
.styled-select--compact { width: 42px; min-width: 42px; }
.styled-select--compact .styled-select__trigger { display: grid; grid-template-columns: 1fr; width: 42px; height: 42px; min-height: 42px; padding: 0; place-items: center; border-radius: 50%; font-size: 0.7rem; font-weight: 750; letter-spacing: 0.06em; text-align: center; }
.styled-select--compact .styled-select__menu { right: 0; }
@media (max-width: 768px) {
  .styled-select--compact { width: 50px; min-width: 50px; }
  .styled-select--compact .styled-select__trigger {
    width: 50px;
    height: 24px;
    min-height: 24px;
    color: var(--muted);
    background: transparent;
    border: 0;
    border-radius: 0;
    font-size: 0.75rem;
  }
  .styled-select--compact .styled-select__trigger span {
    display: grid;
    width: 100%;
    height: 24px;
    place-items: center;
    line-height: 1;
  }
  .styled-select--compact .styled-select__trigger:hover { color: var(--primary); background: transparent; }
}
.styled-select-menu-enter-active,
.styled-select-menu-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.styled-select-menu-enter-from,
.styled-select-menu-leave-to { opacity: 0; transform: translateY(5px); }
@media (prefers-reduced-motion: reduce) {
  .styled-select-menu-enter-active,
  .styled-select-menu-leave-active,
  .styled-select__trigger svg { transition: none; }
}
</style>
