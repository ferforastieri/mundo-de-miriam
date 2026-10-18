import { readonly, reactive } from 'vue'
import adminService from '@/api/admin/AdminService.js'

const state = reactive({
  admin: null,
  initialized: false,
  loading: false
})

let pendingRequest = null

async function loadMe(force = false) {
  if (state.initialized && !force) {
    return state.admin
  }

  if (pendingRequest) {
    return pendingRequest
  }

  state.loading = true

  pendingRequest = adminService
    .me()
    .then((payload) => {
      state.admin = payload?.admin || null
      return state.admin
    })
    .catch(() => {
      state.admin = null
      return null
    })
    .finally(() => {
      state.initialized = true
      state.loading = false
      pendingRequest = null
    })

  return pendingRequest
}

async function login(email, password) {
  const payload = await adminService.login(email, password)
  state.admin = payload?.admin || null
  state.initialized = true
  return state.admin
}

async function logout() {
  try {
    await adminService.logout()
  } finally {
    state.admin = null
    state.initialized = true
  }
}

export function useAdminAuth() {
  return {
    state: readonly(state),
    loadMe,
    login,
    logout
  }
}
