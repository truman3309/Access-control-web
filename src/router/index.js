import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/',        name: 'Home',     component: () => import('../views/HomeView.vue') },
  { path: '/login',  name: 'Login',    component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/RegisterView.vue') },
  { path: '/records', name: 'Records',  component: () => import('../views/RecordsView.vue') },
  { path: '/visitor', name: 'Visitor',  component: () => import('../views/VisitorView.vue') },
  { path: '/query',   name: 'Query',    component: () => import('../views/QueryView.vue') },
  { path: '/profile', name: 'Profile',  component: () => import('../views/ProfileView.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
