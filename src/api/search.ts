import { cachedFetch, baseAPILink } from '@/api/index'

export function getSearch (thing: string, q: string) {
  return cachedFetch(new Request(`${baseAPILink}/search/${thing}?q=${q}`))
}
