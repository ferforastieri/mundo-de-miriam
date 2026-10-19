import { nowIso } from '../../utils/dates.js'

/**
 * Monta o payload de atualização de uma tela a partir da linha atual.
 * Os campos de link privado (share_token/expires_at) só mudam nos
 * usecases de compartilhar/revogar — aqui eles são preservados.
 */
export function screenUpdatePayload(row, overrides = {}) {
  return {
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    menuLabel: row.menu_label,
    menuCategory: row.menu_category,
    icon: row.icon,
    shareToken: row.share_token,
    expiresAt: row.expires_at,
    updatedAt: nowIso(),
    ...overrides
  }
}
