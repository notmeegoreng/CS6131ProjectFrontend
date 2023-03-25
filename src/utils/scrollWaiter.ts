// credit to https://github.com/John60676/vuepress-next/commit/4b048b80be0275ccfb634607c228398c96a7b7d0

export class ScrollWaiter {
  promise: Promise<unknown> | undefined = undefined
  resolve: ((value: unknown) => void) | undefined = undefined

  add () {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  flush () {
    this.resolve && this.resolve(undefined)
    this.resolve = undefined
    this.promise = undefined
  }
}

export const scrollWaiter = new ScrollWaiter()
