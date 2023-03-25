import { baseLink } from '@/api/index'

export function getHomeData () {
  return fetch(`${baseLink}api/home`)
}

export function getForumData (forumID: string) {
  return fetch(`${baseLink}api/forums/${forumID}`)
}

export function getTopicInfo (topicID: string) {
  return fetch(`${baseLink}api/topics/${topicID}`)
}

export function getTopicData (topicID: string, pageNum: string) {
  return fetch(`${baseLink}api/topics/${topicID}/page/${pageNum}`)
}

export function getThreadInfo (threadID: string) {
  return fetch(`${baseLink}api/threads/${threadID}`)
}

export function getThreadData (threadID: string, pageNum: string) {
  return fetch(`${baseLink}api/threads/${threadID}/page/${pageNum}`)
}
