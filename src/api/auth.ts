import { baseLink } from './index'
export function postUsernameAvailable (username: string) {
  return fetch(`${baseLink}api/users/available?username=${username}`, {
    method: 'POST'
  })
}

export function postPreAuth () {
  return fetch(baseLink + 'api/auth/pre_auth', {
    method: 'POST',
    credentials: 'include'
  })
}

export function postRegister (username: string, password: string) {
  return fetch(baseLink + 'api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
}

export function postLogin (username: string, password: string) {
  return fetch(baseLink + 'api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
}
