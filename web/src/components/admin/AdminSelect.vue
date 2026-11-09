<template>
  <div class="admin-select-field">
    <StyledSelect
      :model-value="modelValue"
      :options="options"
      :aria-label="ariaLabel"
      placement="bottom"
      @update:model-value="$emit('update:modelValue', $event)"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script setup>
import StyledSelect from '@/components/common/StyledSelect.vue'

defineProps({
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: 'Selecionar opção' }
})

defineEmits(['update:modelValue', 'change'])
</script>

<style scoped>
/* No painel o seletor acompanha a altura dos botões e não estica além do
   necessário — assim não encosta nos cards nem desalinha o cabeçalho. */
.admin-select-field {
  display: inline-flex;
  width: 144px;
}

.admin-select-field :deep(.styled-select) {
  width: 100%;
  min-width: 0;
}

.admin-select-field :deep(.styled-select__trigger) {
  min-height: 38px;
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  font-size: 0.72rem;
}

.admin-select-field :deep(.styled-select__menu) {
  width: 100%;
  min-width: 144px;
  padding: 0.3rem;
}

.admin-select-field :deep(.styled-select__option) {
  min-height: 32px;
  padding: 0.4rem 0.55rem;
  font-size: 0.72rem;
}
</style>
