import { cachedFetch, getBaseAPILink } from './index'

const baseAPILink = getBaseAPILink() // needed because the constant string is not loaded fsr

export function getAll (type: 'categories' | 'forums' | 'topics', invalidate = false) {
  return cachedFetch(new Request(`${baseAPILink}/${type}`), 120000, invalidate)
}

export function postCategoryData (name: string, description: string) {
  return fetch(`${baseAPILink}/categories`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, description })
  })
}

export function postForumData (parent: number, name: string, description: string) {
  return fetch(`${baseAPILink}/forums`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category_id: parent, name, description })
  })
}

export function postTopicData (parent: number, name: string, description: string) {
  return fetch(`${baseAPILink}/topics`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ forum_id: parent, name, description })
  })
}

export function patchContainerData (
  container: 'categories' | 'forums' | 'topics',
  id: number, name: string, description: string
) {
  return fetch(`${baseAPILink}/${container}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, description })
  })
}

export function deleteContainer (container: 'categories' | 'forums' | 'topics', id: number) {
  return fetch(`${baseAPILink}/${container}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
}
