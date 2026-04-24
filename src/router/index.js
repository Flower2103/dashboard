// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

// Importación lazy de vistas (carga bajo demanda)
const HomeView      = () => import('@/views/HomeView.vue')
const LoginView     = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const NotFoundView  = () => import('@/views/NotFoundView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Inicio',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Iniciar sesión',
      requiresAuth: false,
      guestOnly: true,   // Si ya estás autenticado, te redirige al dashboard
    },
  },
  {
  path: '/register',
  name: 'register',
  component: RegisterView,
  meta: {
    title: 'Crear cuenta',
    requiresAuth: false,
    guestOnly: true,
  },
},
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,  // 🔒 Ruta protegida
    },
  },
  {
      // ✅ Reset password: excluida del guard de token y de guestOnly
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/ResetPassView.vue'),
    meta: {
      title: 'Nueva contraseña',
      requiresAuth: false,
      isResetPassword: true, // 👈 flag para identificarla en el guard
    },
  },

  {
    path: '/email-confirmed',
    name: 'email-confirmed',
    component: () => import('@/views/EmailConfirmedView.vue'),
    meta: {
    title: 'Correo confirmado',
    requiresAuth: false,
    isResetPassword: true, // reutiliza el flag para saltarse el guard
   },
  },

  {
    // Catch-all: cualquier ruta no definida → 404
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Restaura el scroll al tope al cambiar de página
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// ─────────────────────────────────────────
//  NAVIGATION GUARD — con Supabase
// ─────────────────────────────────────────
router.beforeEach(async (to, from) => {
  document.title = `${to.meta.title ?? 'App'} | VueAuth`

    if (to.meta.isResetPassword) {
    return true
  }
  // Detecta si viene del link de confirmación en la URL completa
  const fullUrl = window.location.href

if (
  (fullUrl.includes('access_token') || fullUrl.includes('type=signup') || fullUrl.includes('confirmation_token')) &&
  !fullUrl.includes('type=recovery')
) {
  await supabase.auth.signOut()
  window.location.replace('/email-confirmed')
  return false
}

  const { data } = await supabase.auth.getSession()
  const session = data.session
  const isAuthenticated = !!session
  const emailConfirmed = !!session?.user?.email_confirmed_at

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAuth && isAuthenticated && !emailConfirmed) {
    await supabase.auth.signOut()
    return { name: 'login' }
  }

  if (to.meta.guestOnly && isAuthenticated && emailConfirmed) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
