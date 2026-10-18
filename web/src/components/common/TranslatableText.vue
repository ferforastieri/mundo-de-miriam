<template>
  <span>{{ $t(text) }}</span>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: 'span'
  }
})
</script>
