<template>
  <div class="admin-sparkline">
    <div class="admin-sparkline__header">
      <span class="admin-sparkline__label">{{ label }}</span>
      <span class="admin-sparkline__last">{{ lastValue }}</span>
    </div>

    <svg
      v-if="hasData"
      class="admin-sparkline__svg"
      viewBox="0 0 600 140"
      role="img"
      :aria-label="`${label}: ${firstValue} até ${lastValue}`"
      preserveAspectRatio="none"
    >
      <line x1="8" y1="132" x2="592" y2="132" class="admin-sparkline__axis" />
      <polyline :points="areaPoints" :fill="color" opacity="0.1" stroke="none" />
      <polyline
        :points="linePoints"
        fill="none"
        :stroke="color"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle :cx="lastPoint.x" :cy="lastPoint.y" r="4" :fill="color" />
    </svg>

    <p v-else class="admin-empty">Histórico insuficiente para o gráfico.</p>

    <div v-if="hasData" class="admin-sparkline__footer">
      <span>{{ firstValue }}</span>
      <span>{{ lastValue }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  values: { type: Array, default: () => [] },
  color: { type: String, default: 'var(--primary)' }
})

const numericValues = computed(() =>
  props.values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
)

const hasData = computed(() => numericValues.value.length >= 2)

const bounds = computed(() => {
  const values = numericValues.value
  const min = Math.min(...values)
  const max = Math.max(...values)
  return { min, max, span: max - min || 1 }
})

const coordinates = computed(() => {
  const values = numericValues.value
  const total = values.length - 1
  const { min, span } = bounds.value

  return values.map((value, index) => ({
    x: 8 + (index / total) * 584,
    y: 126 - ((value - min) / span) * 108
  }))
})

const linePoints = computed(() =>
  coordinates.value.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
)

const areaPoints = computed(() => {
  const points = coordinates.value
  const last = points[points.length - 1]
  const first = points[0]
  return `${first.x.toFixed(1)},132 ${linePoints.value} ${last.x.toFixed(1)},132`
})

const lastPoint = computed(() => coordinates.value[coordinates.value.length - 1] || { x: 0, y: 0 })

function format(value) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

const firstValue = computed(() => format(numericValues.value[0] ?? 0))
const lastValue = computed(() => format(numericValues.value[numericValues.value.length - 1] ?? 0))
</script>

<style scoped>
.admin-sparkline {
  display: grid;
  gap: 0.4rem;
}

.admin-sparkline__header,
.admin-sparkline__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-family: system-ui, sans-serif;
}

.admin-sparkline__label {
  color: var(--muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-sparkline__last {
  color: var(--primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.admin-sparkline__footer {
  color: var(--muted);
  font-size: 0.68rem;
}

.admin-sparkline__svg {
  width: 100%;
  height: 140px;
}

.admin-sparkline__axis {
  stroke: var(--border);
  stroke-width: 1;
}
</style>
