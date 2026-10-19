import { watch } from 'vue'
import { useAdminToast } from './useAdminToast'

/**
 * Mostra falhas de carregamento apenas no toast (nada de erro na tela).
 */
export function useErrorToast(source, fallback = 'Não foi possível carregar os dados.') {
  const toast = useAdminToast()

  watch(
    source,
    (value) => {
      if (value) toast.error(value.message || fallback)
    },
    { immediate: true }
  )
}
