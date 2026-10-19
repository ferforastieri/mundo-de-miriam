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
