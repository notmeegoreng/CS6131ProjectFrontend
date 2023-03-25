import { customRef } from 'vue'

export function debouncedRef<T> (value: T, delay = 200) {
  let timeout: number
  return customRef((track, trigger) => {
    return {
      get () {
        track()
        return value
      },
      set (newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
