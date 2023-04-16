// noinspection JSUnusedGlobalSymbols

import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home/',
    name: 'home',
    alias: '/',
    component: () => import('@/views/containers/HomeView.vue')
  }, {
    path: '/login/',
    name: 'login',
    props: true,
    component: () => import('@/views/auth/LoginView.vue')
  }, {
    path: '/login/register/',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue')
  }, {
    path: '/latest/',
    name: 'latest',
    component: () => import('@/views/LatestView.vue')
  }, {
    path: '/users/me/',
    name: 'me',
    meta: { needsLogin: true },
    component: () => import('@/views/UserView.vue')
  }, {
    path: '/users/:id/',
    name: 'users',
    props: true,
    component: () => import('@/views/UserView.vue')
  }, {
    path: '/forums/:id/',
    name: 'forums',
    props: true,
    component: () => import('@/views/containers/ForumView.vue')
  }, {
    path: '/topics/:id/',
    name: 'topics',
    props: true,
    component: () => import('@/views/containers/TopicView.vue'),
    redirect: to => {
      return {
        name: 'topic_page',
        params: { id: to.params.id, page_num: 1 }
      }
    },
    children: [
      {
        path: 'page/:page_num/',
        name: 'topic_page',
        props: true,
        component: () => import('@/views/containers/TopicPageView.vue')
      }, {
        path: 'new/',
        name: 'thread_create',
        props: true,
        meta: { needsLogin: true },
        component: () => import('@/views/containers/create/ThreadCreateView.vue')
      }
    ]
  }, {
    path: '/threads/:id/',
    name: 'threads',
    props: true,
    component: () => import('@/views/containers/ThreadView.vue'),
    redirect: to => {
      return {
        name: 'thread_page',
        params: { id: to.params.id, page_num: 1 }
      }
    },
    children: [
      {
        path: 'page/:page_num/',
        name: 'thread_page',
        props: true,
        component: () => import('@/views/containers/ThreadPageView.vue')
      }, {
        path: 'new/',
        name: 'post_create',
        props: true,
        meta: { needsLogin: true },
        component: () => import('@/views/containers/create/PostCreateView.vue')
      }
    ]
  }, {
    path: '/search/',
    name: 'search',
    props: true,
    component: () => import('@/views/SearchView.vue')
  }, {
    path: '/admin/panel/',
    name: 'admin_panel',
    meta: { needsLogin: true },
    component: () => import('@/views/AdminPanelView.vue')
  }
]

export default routes

declare module 'vue-router' {
  interface RouteMeta {
    needsLogin?: boolean
  }
}
