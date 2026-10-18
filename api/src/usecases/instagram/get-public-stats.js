import { toPublicInstagramStats } from '../../mappers/instagram.mapper.js'

export async function getPublicInstagramStats(container) {
  const [snapshot, state] = await Promise.all([
    container.instagram.latestSuccessful(),
    container.instagram.getState()
  ])

  return toPublicInstagramStats(snapshot, state, container.env.INSTAGRAM_USERNAME)
}
