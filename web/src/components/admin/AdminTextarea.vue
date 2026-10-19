<template>
  <textarea
    class="admin-textarea"
    :value="modelValue"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('change', $event)"
  ></textarea>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  modelValue: { type: [String, Number], default: '' }
})

defineEmits(['update:modelValue', 'change'])
</script>
