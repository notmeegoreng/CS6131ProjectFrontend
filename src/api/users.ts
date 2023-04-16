import { cachedFetch, baseAPILink } from './index'
import { useStore } from '@/store'

export function getUserData (userID: number | string) {
  return cachedFetch(new Request(`${baseAPILink}/users/${userID}`), 120000)
}

export function getUserLogs (userID: number | string) {
  return cachedFetch(new Request(`${baseAPILink}/users/${userID}/logs`), 120000)
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

export function postAvatar (file: File) {
  return fetch(new Request(`${baseAPILink}/images/set_avatar`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': file.type
    },
    body: file
  }))
}

export function addReaction (post_id: number, react: string) {
  return fetch(new Request(`${baseAPILink}/posts/${post_id}/reactions/add`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: react
  }))
}

export function remReaction (post_id: number, react: string) {
  return fetch(new Request(`${baseAPILink}/posts/${post_id}/reactions/rem`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: react
  }))
}
