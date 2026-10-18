export function toPublicPhoto(row) {
  return {
    id: row.id,
    url: `/media/${row.storage_key}`,
    alt: row.alt || '',
    caption: row.caption || '',
    width: row.width ?? null,
    height: row.height ?? null,
    position: row.sort_order,
    featured: Boolean(row.is_featured)
  }
}

export function toAdminPhoto(row, extra = {}) {
  return {
    ...toPublicPhoto(row),
    screenId: row.screen_id,
    groupId: row.group_id,
    storageKey: row.storage_key,
    contentType: row.content_type,
    bytes: Number(row.bytes || 0),
    visible: Boolean(row.is_visible),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    screenName: extra.screenName ?? row.screen_name ?? null,
    groupName: extra.groupName ?? row.group_name ?? null
  }
}
