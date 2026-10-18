import { AsyncLocalStorage } from 'node:async_hooks'

const storage = new AsyncLocalStorage()

export function runWithContext(context, callback) {
  return storage.run(context, callback)
}

export function getContext() {
  const context = storage.getStore()

  if (!context) {
    throw new Error('Request context is not available')
  }

  return context
}

export function getContainer() {
  return getContext().container
}

export function getExecutionContext() {
  return getContext().ctx
}
