import { cachedFetch, baseAPILink } from './index'
export function getUsernameAvailable (username: string) {
  return cachedFetch(new Request(`${baseAPILink}/users/available?username=${username}`))
}

export function postPreAuth () {
  return fetch(`${baseAPILink}/auth/pre_auth`, {
    method: 'POST',
    credentials: 'include'
  })
}

export function postRegister (username: string, password: string) {
  return fetch(`${baseAPILink}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
}

export function postLogin (username: string, password: string) {
  return fetch(`${baseAPILink}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
}
