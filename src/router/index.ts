import { createRouter, createWebHistory } from 'vue-router'
import { scrollWaiter } from '@/utils'
import { useStore } from '@/store'
import routes from './routes'

export default function makeRouter () {
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior: async (to, from, savedPosition) => {
      await scrollWaiter.clear
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
          top: 80
        }
      } else if (savedPosition) {
        return savedPosition
      }
    }
  })

  const store = useStore()

  router.beforeEach(async (to) => {
    if (!to.meta.needLogin || store.userID === 0) {
      return true
    }
    const query = to.params
    query.back = to.name as string
    return {
      name: 'login',
      query
    }
  })

  return router
}
