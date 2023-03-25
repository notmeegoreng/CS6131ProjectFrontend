export const baseLink = 'http://localhost:1414/'

export * from './auth'
export * from './containers'

export function getUserData (userID: string) {
  return fetch(`${baseLink}api/users/${userID}`)
}
