import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import subscript from 'markdown-it-sub'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import superscript from 'markdown-it-sup'

export const md = new MarkdownIt({
  breaks: true
})
  .use(emoji, { shortcuts: {} })
  .use(subscript)
  .use(superscript)
