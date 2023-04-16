import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('store', () => {
  const userID = ref(0)
  const isAdmin = ref(false)
  return { userID, isAdmin }
}, { persist: { storage: sessionStorage } })
