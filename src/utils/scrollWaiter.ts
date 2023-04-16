// partial credit to https://github.com/John60676/vuepress-next/commit/4b048b80be0275ccfb634607c228398c96a7b7d0

type resolveType = (value: unknown) => void

export class Counter {
  private count
  clear?: Promise<unknown>
  private resolve?: resolveType
  constructor () {
    this.count = 0
    this.clear = undefined
  }

  inc () {
    this.count += 1
    if (this.count === 1) {
      this.clear = new Promise((resolve) => (this.resolve = resolve))
    }
    return this
  }

  dec () {
    if (!this.count) { return this }
    this.count -= 1
    if (this.count === 0) {
      (this.resolve as resolveType)(undefined)
    }
    return this
  }
}

export const scrollWaiter = new Counter()
