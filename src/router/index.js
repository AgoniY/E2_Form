import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'DesignForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/DesignForm.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  /* {
    path: '/word',
    name: 'Word',
    component: () => import('../components/word.vue')
  } */
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
