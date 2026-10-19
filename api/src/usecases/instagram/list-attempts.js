import { paginationMeta, parsePagination } from '../../utils/pagination.js'

export async function listInstagramAttempts(container, query = {}) {
  const pagination = parsePagination(query, { defaultSize: 10 })

  const [total, rows] = await Promise.all([
    container.instagram.countSnapshots(),
    container.instagram.listSnapshotsPage(pagination.pageSize, pagination.offset)
  ])

  return {
    attempts: rows.map((attempt) => ({
      capturedAt: attempt.captured_at,
      source: attempt.source,
      success: Boolean(attempt.success),
      error: attempt.error || null,
      followers: attempt.followers,
      posts: attempt.posts
    })),
    pagination: paginationMeta({ ...pagination, total })
  }
}
