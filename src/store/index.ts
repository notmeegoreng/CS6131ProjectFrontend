import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('store', () => {
  const userID = ref(0)
  const spoilerHide = ref(true)
  return { userID, spoilerHide }
})