<template>
  <label class="admin-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span v-if="label">{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>
