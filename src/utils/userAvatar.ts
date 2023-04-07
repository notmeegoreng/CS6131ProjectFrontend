import { baseLink } from '@/api'

export const colours = [
  'red', 'pink', 'purple', 'deep-purple', 'indigo',
  'blue', 'light-blue', 'cyan', 'teal', 'green',
  'light-green', 'lime', 'yellow', 'amber', 'orange',
  'deep-orange', 'brown', 'blue-grey', 'grey'
]
export function getColour (userID: number) {
  userID *= 1830
  userID ^= 12939
  userID = userID << 10 + userID >> 13
  userID += 1102
  userID ^= userID >> 14
  return colours[userID % colours.length]
}

export function getAvatarLink (userID: number) {
  return `${baseLink}/images/avatars/${userID}`
}
