export const baseAPILink = 'http://localhost:1414/api'
export const baseLink = 'http://localhost:1414'

export function getBaseAPILink () {
  // needed because apparently js cannot deal with exported constants sometimes
  return 'http://localhost:1414/api'
}

const API_CACHE_KEY = 'api-cache'
export async function cachedFetch (request: Request, cacheTime = 60000, invalidate = false) {
  const cache = await caches.open(API_CACHE_KEY)
  if (!invalidate) {
    const response = await cache.match(request)
    if (response) {
      // found in cache
      // if cached file is not older than 60 seconds, return
      if (Date.now() <= new Date(response.headers.get('Date') as string).getTime() + cacheTime) {
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

export async function invalidate (request: Request) {
  const cache = await caches.open(API_CACHE_KEY)
  return await cache.delete(request)
}

export * from './admin_only'
export * from './auth'
export * from './containers'
export * from './search'
export * from './users'
