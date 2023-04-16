import { cachedFetch, baseAPILink } from './index'

export function getSearch (thing: string, q: string) {
  return cachedFetch(new Request(`${baseAPILink}/search/${thing}?q=${q}`), 90000)
}
