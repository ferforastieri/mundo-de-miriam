export function toScreen(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    kind: row.kind,
    position: row.sort_order,
    visible: Boolean(row.is_visible),
    menuLabel: row.menu_label,
    menuCategory: row.menu_category,
    icon: row.icon
  }
}

export function toGroup(row) {
  return {
    id: row.id,
    screenId: row.screen_id,
    name: row.name,
    position: row.sort_order
  }
}
