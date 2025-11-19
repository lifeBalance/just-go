import { fsPathToRoute, normalizePath } from './paths'

export type MdModule = { default: unknown }

export function makeResolver(
  mods: Record<string, MdModule>,
  base: string,
): (seg: string) => MdModule | undefined {
  const entries = Object.entries(mods)
  const routeMap = new Map<string, MdModule>(
    entries.map(([fs, mod]) => [normalizePath(fsPathToRoute(fs)), mod]),
  )
  const baseNorm = normalizePath(base)
  return (seg: string) => {
    const target = normalizePath(baseNorm + (seg ? '/' + seg : ''))
    return routeMap.get(target)
  }
}
