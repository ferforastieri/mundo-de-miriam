/**
 * Escolhe quantas colunas usar num grid de cartões para que as linhas
 * fiquem completas (sem buracos na última linha).
 * Prefere o maior número de colunas e, em empate, o que sobra menos.
 */
export function statColumns(count, max = 5) {
  const total = Number(count) || 0

  if (total <= 1) return 1

  const limit = Math.max(2, Math.min(total, max))
  let best = limit
  let bestWaste = Infinity

  for (let columns = limit; columns >= 2; columns -= 1) {
    const waste = (columns - (total % columns)) % columns

    if (waste < bestWaste) {
      bestWaste = waste
      best = columns
    }
  }

  return best
}
