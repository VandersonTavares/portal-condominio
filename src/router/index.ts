import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Reservas from '../views/Reservas.vue'
import Noticias from '../views/Noticias.vue'
import Documentos from '../views/Documentos.vue'
import Eventos from '../views/Eventos.vue'
import Admin from '../views/Admin.vue'
import AdminLogin from '../views/AdminLogin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/reservas',
    name: 'Reservas',
    component: Reservas
  },
  {
    path: '/noticias',
    name: 'Noticias',
    component: Noticias
  },
  {
    path: '/documentos',
    name: 'Documentos',
    component: Documentos
  },
  {
    path: '/eventos',
    name: 'Eventos',
    component: Eventos
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for admin routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('admin_logged_in')
    if (!isAuthenticated) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})