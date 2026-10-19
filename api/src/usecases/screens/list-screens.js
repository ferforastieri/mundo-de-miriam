import { toGroup, toScreen } from '../../mappers/screen.mapper.js'
import { paginationMeta, parsePagination } from '../../utils/pagination.js'

export async function listScreens(container, { page = 1, pageSize = 20 } = {}) {
  const pagination = parsePagination({ page, pageSize }, { defaultSize: 20 })

  const [total, screens, groups, screenCounts, groupCounts] = await Promise.all([
    container.screens.countAll(),
    container.screens.listPage({ limit: pagination.pageSize, offset: pagination.offset }),
    container.groups.listAll(),
    container.photos.countsByScreen(),
    container.photos.countsByGroup()
  ])

  const countsByScreen = new Map(
    screenCounts.map((row) => [
      row.screen_id,
      { total: Number(row.total || 0), bytes: Number(row.bytes || 0) }
    ])
  )

  const countsByGroup = new Map(
    groupCounts.map((row) => [
      row.group_id,
      { total: Number(row.total || 0), bytes: Number(row.bytes || 0) }
    ])
  )

  return {
    screens: screens.map((screen) => ({
      ...toScreen(screen),
      shareToken: screen.share_token,
      expiresAt: screen.expires_at,
      photoCount: countsByScreen.get(screen.id)?.total || 0,
      bytes: countsByScreen.get(screen.id)?.bytes || 0,
      groups: groups
        .filter((group) => group.screen_id === screen.id)
        .map((group) => ({
          ...toGroup(group),
          photoCount: countsByGroup.get(group.id)?.total || 0,
          bytes: countsByGroup.get(group.id)?.bytes || 0
        }))
    })),
    pagination: paginationMeta({ ...pagination, total })
  }
}
