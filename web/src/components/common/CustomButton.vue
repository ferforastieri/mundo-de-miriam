<template>
  <button 
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <span v-else-if="icon" class="button-icon">{{ icon }}</span>
    <span class="button-text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger', 'success', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  fullWidth: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  return [
    'custom-button',
    `custom-button--${props.variant}`,
    `custom-button--${props.size}`,
    {
      'custom-button--full-width': props.fullWidth,
      'custom-button--rounded': props.rounded,
      'custom-button--loading': props.loading,
      'custom-button--disabled': props.disabled
    }
  ]
})
</script>

<style scoped>
.custom-button {
  font-family: 'Gilda Display', serif;
  border: 2px solid #520;
  border-radius: 8px;
  background-color: transparent;
  color: #520;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: normal;
  letter-spacing: 1px;
  outline: none;
}

.custom-button--small {
  padding: 8px 16px;
  font-size: 14px;
  letter-spacing: 1px;
}

.custom-button--medium {
  padding: 12px 20px;
  font-size: 15px;
  letter-spacing: 1.5px;
}

.custom-button--large {
  padding: 16px 24px;
  font-size: 16px;
  letter-spacing: 2px;
}

.custom-button--full-width {
  width: 100%;
}

.custom-button--rounded {
  border-radius: 8px;
}

.custom-button:not(.custom-button--rounded) {
  border-radius: 4px;
}

.custom-button--primary {
  background-color: #520;
  color: white;
  border-color: #520;
}

.custom-button--primary:hover:not(.custom-button--disabled) {
  background-color: #333;
  border-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 0, 0, 0.2);
}

.custom-button--secondary {
  background-color: transparent;
  color: #520;
  border-color: #520;
}

.custom-button--secondary:hover:not(.custom-button--disabled) {
  background-color: #520;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 0, 0, 0.2);
}

.custom-button--outline {
  background-color: transparent;
  color: #520;
  border-color: #520;
}

.custom-button--outline:hover:not(.custom-button--disabled) {
  background-color: #520;
  color: white;
  transform: translateY(-2px);
}

.custom-button--danger {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.custom-button--danger:hover:not(.custom-button--disabled) {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.custom-button--success {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.custom-button--success:hover:not(.custom-button--disabled) {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
}

.custom-button--ghost {
  background-color: transparent;
  color: #520;
  border-color: transparent;
}

.custom-button--ghost:hover:not(.custom-button--disabled) {
  background-color: rgba(82, 0, 0, 0.1);
  transform: translateY(-2px);
}

.custom-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.custom-button--loading {
  cursor: wait;
}

.custom-button--loading .button-text {
  opacity: 0.7;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.button-icon {
  font-size: 1.1em;
}

.custom-button:focus-visible {
  outline: 2px solid #520;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .custom-button--small {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .custom-button--medium {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .custom-button--large {
    padding: 14px 20px;
    font-size: 14px;
  }
}
</style>
