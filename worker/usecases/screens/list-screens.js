import { toGroup, toScreen } from '../../mappers/screen.mapper.js'

export async function listScreens(container) {
  const [screens, groups, screenCounts, groupCounts] = await Promise.all([
    container.screens.listAll(),
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

  return screens.map((screen) => ({
    ...toScreen(screen),
    photoCount: countsByScreen.get(screen.id)?.total || 0,
    bytes: countsByScreen.get(screen.id)?.bytes || 0,
    groups: groups
      .filter((group) => group.screen_id === screen.id)
      .map((group) => ({
        ...toGroup(group),
        photoCount: countsByGroup.get(group.id)?.total || 0,
        bytes: countsByGroup.get(group.id)?.bytes || 0
      }))
  }))
}
