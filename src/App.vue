<!-- App.vue -->
<template>
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-brand">
        <RouterLink to="/" class="brand-link">
          <span class="brand-icon">🤿</span>
          <span class="brand-text">BuceoCom</span>
        </RouterLink>
      </div>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <template v-if="!isResetPassword">
          <!-- Si NO está autenticado -->
          <template v-if="!isAuthenticated">
            <RouterLink to="/login" class="nav-link nav-link--cta">
              Iniciar sesión
            </RouterLink>
            <RouterLink to="/register" class="nav-link">Registrarse</RouterLink>
          </template>

          <!-- Si SÍ está autenticado -->
          <template v-else>
            <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
            <span class="nav-user">{{ userName }}</span>
            <button class="nav-link nav-link--logout" @click="handleLogout">
              Cerrar sesión
            </button>
          </template>

        </template>
      </div>
    </nav>

    <!-- CONTENIDO PRINCIPAL -->
    <main :class="isHome ? 'main-full' : 'main-content'">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route  = useRoute()
const { isAuthenticated, user, logout } = useAuth()
const isResetPassword = computed(() => route.name === 'reset-password')

const userName = computed(() =>
  user.value?.user_metadata?.full_name || user.value?.email
  )
const isHome = computed(() => route.name === 'home')

async function handleLogout() {
  await logout()
  await router.push('/login')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
/* Reset global */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f8f9fc;
  color: #1e2540;
  font-family: 'DM Sans', sans-serif;
}
</style>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* ── NAVBAR ── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #35416e, #4a5a9c);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 2px 16px rgba(53, 65, 110, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: white;
}

.brand-icon {
  font-size: 1.4rem;
}

.brand-text {
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.45rem 1rem;
  border-radius: 8px;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
  background: rgba(255,255,255,0.12);
}

.nav-link--cta {
  background: white;
  color: #35416e !important;
  font-weight: 600;
  padding: 0.45rem 1.25rem;
}

.nav-link--cta:hover {

  background: #f0f2f8 !important;
  color: #35416e !important;
}

.nav-user {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.9);
  padding: 0 0.85rem;
  border-left: 1px solid rgba(255,255,255,0.2);
  border-right: 1px solid rgba(255,255,255,0.2);
}

.nav-link--logout {
  color: #ffaaaa !important;
}

.nav-link--logout:hover {
  background: rgba(255,100,100,0.15) !important;
}

/* ── MAIN ── */
.main-full {
  /* Home: sin restricción de ancho ni padding */
  width: 100%;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ── TRANSICIONES ── */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
/* ── RESPONSIVE ── */
@media (max-width: 1080px) {
  .main-content {
    padding: 2rem 0.5rem;
  }
}
</style>
