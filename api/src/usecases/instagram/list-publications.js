import { toInstagramPublication } from '../../mappers/instagram.mapper.js'
import { paginationMeta, parsePagination } from '../../utils/pagination.js'

export async function listInstagramPublications(container, query = {}) {
  const pagination = parsePagination(query, { defaultSize: 10 })

  const [total, rows] = await Promise.all([
    container.instagram.countPublications(),
    container.instagram.listPublicationsPage(pagination.pageSize, pagination.offset)
  ])

  return {
    publications: rows.map(toInstagramPublication),
    pagination: paginationMeta({ ...pagination, total })
  }
}
