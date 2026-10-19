<template>
  <svg v-if="name === 'image'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" stroke-width="1.7" />
    <path d="m5 16 4.2-4.2 3.2 3.1 2.2-2.2L19 17M16.8 8.5h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'palette'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 0-3.6h-.7a1.6 1.6 0 0 1 0-3.2H16a5 5 0 0 0 5-5C21 5.8 17 3 12 3Z" stroke="currentColor" stroke-width="1.7" />
    <path d="M7.5 10h.01M9 6.8h.01M13 6h.01M16.5 8h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'camera'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h4l1.5-2h5L16 7h4v12H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.7" />
  </svg>

  <svg v-else-if="name === 'partnership'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8.5 12.5 12 16l3.5-3.5M3 9l4-4 5 5M21 9l-4-4-3 3M7 17l2 2a2 2 0 0 0 3 0l5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'portrait'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7" />
    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'document'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 3h9l3 3v15H6Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
    <path d="M15 3v4h4M9 11h6M9 15h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'symbol'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3.5 14.4 9l5.6 2.4L14.4 14 12 19.5 9.6 14 4 11.4 9.6 9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'star'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m12 4 2.5 5.1 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
