import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { scrollWaiter } from '@/utils'

// noinspection JSUnusedGlobalSymbols
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home/',
    name: 'home',
    alias: '/',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login/',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue')
  },
  {
    path: '/login/register/',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue')
  },
  {
    path: '/latest/',
    name: 'latest',
    component: () => import('@/views/LatestView.vue')
  },
  {
    path: '/users/',
    name: 'all_users',
    component: () => import('@/views/all_users.vue')
  },
  {
    path: '/users/me',
    name: 'me',
    component: () => import('@/views/UserView.vue')
  },
  {
    path: '/users/:user_id/',
    name: 'users',
    props: true,
    component: () => import('@/views/UserView.vue')
  },
  {
    path: '/forums/:forum_id/',
    name: 'forums',
    props: true,
    component: () => import('@/views/ForumView.vue')
  },
  {
    path: '/topics/:topic_id/',
    name: 'topics',
    props: true,
    component: () => import('@/views/TopicView.vue'),
    redirect: to => {
      return {
        name: 'topic_page',
        params: { topic_id: to.params.topic_id, page_num: 1 }
      }
    },
    children: [{
      name: 'topic_page',
      path: 'page/:page_num',
      props: true,
      component: () => import('@/views/TopicPageView.vue')
    }]
  },
  {
    path: '/topics/:topic_id/new_thread/',
    name: 'newThread',
    props: true,
    component: () => import('@/views/NewThreadView.vue')
  },
  {
    path: '/threads/:thread_id/',
    name: 'threads',
    props: true,
    component: () => import('@/views/ThreadView.vue'),
    redirect: to => {
      return {
        name: 'thread_page',
        params: { thread_id: to.params.thread_id, page_num: 1 }
      }
    },
    children: [{
      name: 'thread_page',
      path: 'page/:page_num',
      props: true,
      component: () => import('@/views/ThreadPageView.vue')
    }]
  },
  {
    path: '/search/',
    name: 'search',
    props: true,
    component: () => import('@/views/SearchView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: async (to, from, savedPosition) => {
    await scrollWaiter.promise

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

export default router
