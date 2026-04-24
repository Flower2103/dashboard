<!-- src/views/EmailConfirmedView.vue -->
<template>
  <div class="confirmed-wrapper">
    <div class="confirmed-card">
      <!-- Ícono animado -->
      <div class="icon-circle">
        <svg class="checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark-check" fill="none" d="M14 27 l8 8 l16-16" />
        </svg>
      </div>

      <h1 class="title">¡Correo confirmado!</h1>
      <p class="subtitle">
        Tu cuenta ha sido verificada exitosamente.<br />
        Ya puedes iniciar sesión.
      </p>

      <!-- Barra de progreso del redireccionamiento -->
      <div class="redirect-info">
        <span class="redirect-text">Redirigiendo en {{ countdown }}s...</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth + '%' }" />
        </div>
      </div>

      <RouterLink to="/login" class="btn-login">
        Ir al inicio de sesión
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const TOTAL = 5        // segundos antes de redirigir
const countdown = ref(TOTAL)
let interval = null

const progressWidth = computed(() =>
  ((TOTAL - countdown.value) / TOTAL) * 100
)

onMounted(() => {
  interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      router.push('/login')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.confirmed-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
  padding: 1.5rem;
}

.confirmed-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(53, 65, 110, 0.12);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Ícono ── */
.icon-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.75rem;
}

.checkmark {
  width: 80px;
  height: 80px;
}

.checkmark-circle {
  stroke: #4a5a9c;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: strokeCircle 0.6s ease forwards;
}

.checkmark-check {
  stroke: #4a5a9c;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: strokeCheck 0.4s ease 0.55s forwards;
}

@keyframes strokeCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes strokeCheck {
  to { stroke-dashoffset: 0; }
}

/* ── Textos ── */
.title {
  font-family: 'Sora', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e2540;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* ── Barra de progreso ── */
.redirect-info {
  margin-bottom: 1.75rem;
}

.redirect-text {
  font-size: 0.82rem;
  color: #9ca3af;
  display: block;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #35416e, #4a5a9c);
  border-radius: 99px;
  transition: width 1s linear;
}

/* ── Botón ── */
.btn-login {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #35416e, #4a5a9c);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: 10px;
  transition: opacity 0.2s;
}

.btn-login:hover {
  opacity: 0.88;
}
</style>