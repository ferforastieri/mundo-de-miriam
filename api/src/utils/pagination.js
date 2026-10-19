const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 200

export function parsePagination(query = {}, { defaultSize = DEFAULT_PAGE_SIZE, maxSize = MAX_PAGE_SIZE } = {}) {
  const page = Math.max(1, Math.floor(Number(query.page) || 1))
  const pageSize = Math.min(maxSize, Math.max(1, Math.floor(Number(query.pageSize) || defaultSize)))

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize
  }
}

export function paginationMeta({ page, pageSize, total }) {
  const safeTotal = Math.max(0, Number(total) || 0)

  return {
    page,
    pageSize,
    total: safeTotal,
    totalPages: Math.max(1, Math.ceil(safeTotal / pageSize))
  }
}
