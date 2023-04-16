import { cachedFetch, baseAPILink } from './index'

export function getHomeData () {
  return cachedFetch(new Request(`${baseAPILink}/home`), 240000)
}

export function getLatestData () {
  return cachedFetch(new Request(`${baseAPILink}/latest`), 30000)
}

export function getForumData (forumID: string) {
  return cachedFetch(new Request(`${baseAPILink}/forums/${forumID}`), 180000)
}

export function getTopicInfo (topicID: string) {
  return cachedFetch(new Request(`${baseAPILink}/topics/${topicID}`), 180000)
}

export function getTopicData (topicID: string, pageNum: string) {
  return cachedFetch(new Request(`${baseAPILink}/topics/${topicID}/page/${pageNum}`))
}

export function getThreadInfo (threadID: string) {
  return cachedFetch(new Request(`${baseAPILink}/threads/${threadID}`))
}

export function getThreadData (threadID: string, pageNum: string, invalidate = false) {
  return cachedFetch(new Request(`${baseAPILink}/threads/${threadID}/page/${pageNum}`, {
    credentials: 'include'
  }), 60000, invalidate)
}

export function getAllReactions () {
  return cachedFetch(new Request(`${baseAPILink}/reactions`), 120000)
}

export function postThreadData (topicID: number, name: string, post_content: string) {
  return fetch(new Request(`${baseAPILink}/threads`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic_id: topicID, name, post_content })
  }))
}

export function postPostData (threadID: number, content: string) {
  return fetch(new Request(`${baseAPILink}/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ thread_id: threadID, content })
  }))
}

export function deleteThread (threadID: string) {
  return fetch(new Request(`${baseAPILink}/threads/${threadID}`, {
    method: 'DELETE',
    credentials: 'include'
  }))
}

export function deletePost (postID: number | string) {
  return fetch(new Request(`${baseAPILink}/posts/${postID}`, {
    method: 'DELETE',
    credentials: 'include'
  }))
}
