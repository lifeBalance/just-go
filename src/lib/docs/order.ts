export function createOrderIndex(
  mods: Record<string, any>,
  fullPath: string,
): Map<string, number> {
  const list: string[] = mods[fullPath]?.default ?? []
  return new Map(list.map((slug, i) => [slug.replace(/\/$/, ''), i]))
}
