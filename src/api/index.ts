export const baseLink = 'http://localhost:1414'
export const baseAPILink = `${baseLink}/api`

export * from './auth'
export * from './containers'
export * from './search'
export * from './users'

const API_CACHE_KEY = 'api-cache'
export async function cachedFetch (request: Request, invalidate = false) {
  const cache = await caches.open(API_CACHE_KEY)
  if (!invalidate) {
    const response = await cache.match(request)
    if (response) {
      // found in cache
      // if cached file is not older than 60 seconds, return
      if (Date.now() <= new Date(response.headers.get('Date') as string).getTime() + 60000) {
        return response
      }
    }
  }
  const response = await fetch(request)
  if (response.status < 400) {
    await cache.put(request, response.clone())
  }
  return response
}
