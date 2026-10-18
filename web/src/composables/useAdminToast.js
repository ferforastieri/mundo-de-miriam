import { reactive } from 'vue'

const state = reactive({
  items: []
})

let nextId = 1

function remove(id) {
  const index = state.items.findIndex((item) => item.id === id)
  if (index >= 0) state.items.splice(index, 1)
}

function push(type, message, duration = 4000) {
  const id = nextId
  nextId += 1

  state.items.push({ id, type, message })

  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }
}

export function useAdminToast() {
  return {
    state,
    success: (message) => push('success', message),
    error: (message) => push('error', message, 7000),
    remove
  }
}
