import { cachedFetch, baseAPILink } from '@/api/index'

export function getHomeData () {
  return cachedFetch(new Request(`${baseAPILink}/home`))
}

export function getForumData (forumID: string) {
  return cachedFetch(new Request(`${baseAPILink}/forums/${forumID}`))
}

export function getTopicInfo (topicID: string) {
  return cachedFetch(new Request(`${baseAPILink}/topics/${topicID}`))
}

export function getTopicData (topicID: string, pageNum: string) {
  return cachedFetch(new Request(`${baseAPILink}/topics/${topicID}/page/${pageNum}`))
}

export function getThreadInfo (threadID: string) {
  return cachedFetch(new Request(`${baseAPILink}/threads/${threadID}`))
}

export function getThreadData (threadID: string, pageNum: string, invalidate = false) {
  return cachedFetch(new Request(`${baseAPILink}/threads/${threadID}/page/${pageNum}`), invalidate)
}

export function postPostData (threadID: number, content: string) {
  console.log(JSON.stringify({ thread_id: threadID, content }))
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
    method: 'DELETE'
  }))
}

export function deletePost (postID: number | string) {
  return fetch(new Request(`${baseAPILink}/posts/${postID}`, {
    method: 'DELETE'
  }))
}
