import { toInstagramMedia } from '../../mappers/instagram.mapper.js'
import { paginationMeta, parsePagination } from '../../utils/pagination.js'

export async function listInstagramMedia(container, query = {}) {
  const pagination = parsePagination(query, { defaultSize: 10 })

  const [total, rows] = await Promise.all([
    container.instagram.countMedia(),
    container.instagram.listMediaPage(pagination.pageSize, pagination.offset)
  ])

  return {
    media: rows.map(toInstagramMedia),
    pagination: paginationMeta({ ...pagination, total })
  }
}
