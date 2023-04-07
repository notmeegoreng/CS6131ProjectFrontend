import { cachedFetch, baseAPILink } from '@/api/index'
import { useStore } from '@/store'

export function getUserData (userID: string) {
  return cachedFetch(new Request(`${baseAPILink}/users/${userID}`))
}

export function patchUser (profile_tag: string | null, description: string | null) {
  return fetch(new Request(`${baseAPILink}/users/${useStore().userID}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profile_tag, description })
  }))
}
