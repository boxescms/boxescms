import Vue from 'vue'
import Router from 'router'

import index from '../vue/index.vue'
import login from '../vue/login.vue'
import pages from '../vue/pages.vue'
import page from '../vue/page.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      components: {
        default: login
      },
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/',
      name: 'index',
      components: {
        default: index
      }
    },
    {
      path: '/pages',
      name: 'pages',
      components: {
        default: pages
      }
    },
    {
      path: '/page/:file',
      name: 'page',
      components: {
        default: page
      },
      props: true
    }
  ]
})

export default router
