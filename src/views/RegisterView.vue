<!-- src/views/RegisterView.vue -->
<template>
  <div class="register-page">

    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="register-card">

      <!-- Paso 1: Formulario -->
      <Transition name="slide" mode="out-in">

        <div v-if="!success" key="form">
          <!-- Header -->
          <div class="card-header">
            <span class="card-icon">🤿</span>
            <h1 class="card-title">Crear cuenta</h1>
            <p class="card-subtitle">Completa los datos para registrarte</p>
          </div>

          <!-- Barra de progreso -->
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <p class="progress-label">Completado {{ progressPercent }}%</p>

          <!-- Error global -->
          <Transition name="alert">
            <div v-if="errorMsg" class="alert-error" role="alert">
              <span>⚠</span> {{ errorMsg }}
            </div>
          </Transition>

          <!-- Formulario -->
          <form class="register-form" @submit.prevent="handleRegister" novalidate>

            <!-- Nombre -->
            <div class="field" :class="{ 'field--error': errors.name, 'field--ok': touched.name && !errors.name }">
              <label for="name" class="field-label">Nombre completo</label>
              <div class="field-input-wrap">
                <span class="field-icon">👤</span>
                <input
                  id="name"
                  v-model.trim="form.name"
                  type="text"
                  class="field-input"
                  placeholder="Ana García"
                  autocomplete="name"
                  @blur="validateName"
                  @input="touched.name && validateName()"
                />
                <span v-if="touched.name && !errors.name" class="field-check">✓</span>
              </div>
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>

            <!-- Email -->
            <div class="field" :class="{ 'field--error': errors.email, 'field--ok': touched.email && !errors.email }">
              <label for="email" class="field-label">Correo electrónico</label>
              <div class="field-input-wrap">
                <span class="field-icon">✉</span>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  class="field-input"
                  placeholder="ana@ejemplo.com"
                  autocomplete="email"
                  @blur="validateEmail"
                  @input="touched.email && validateEmail()"
                />
                <span v-if="touched.email && !errors.email" class="field-check">✓</span>
              </div>
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <!-- Contraseña -->
            <div class="field" :class="{ 'field--error': errors.password, 'field--ok': touched.password && !errors.password }">
              <label for="password" class="field-label">Contraseña</label>
              <div class="field-input-wrap">
                <span class="field-icon">🔑</span>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Mínimo 6 caracteres"
                  autocomplete="new-password"
                  @blur="validatePassword"
                  @input="touched.password && validatePassword(); touched.confirm && validateConfirm()"
                />
                <button
                  type="button"
                  class="field-toggle"
                  @click="showPassword = !showPassword"
                >{{ showPassword ? '🙈' : '👁' }}</button>
              </div>

              <!-- Indicador de fuerza -->
              <div v-if="form.password" class="strength-bar">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="strength-segment"
                  :class="{ active: n <= passwordStrength.score }"
                  :style="n <= passwordStrength.score ? { background: passwordStrength.color } : {}"
                ></div>
                <span class="strength-label" :style="{ color: passwordStrength.color }">
                  {{ passwordStrength.label }}
                </span>
              </div>

              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <!-- Confirmar contraseña -->
            <div class="field" :class="{ 'field--error': errors.confirm, 'field--ok': touched.confirm && !errors.confirm }">
              <label for="confirm" class="field-label">Confirmar contraseña</label>
              <div class="field-input-wrap">
                <span class="field-icon">🔒</span>
                <input
                  id="confirm"
                  v-model="form.confirm"
                  :type="showConfirm ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Repite tu contraseña"
                  autocomplete="new-password"
                  @blur="validateConfirm"
                  @input="touched.confirm && validateConfirm()"
                />
                <button
                  type="button"
                  class="field-toggle"
                  @click="showConfirm = !showConfirm"
                >{{ showConfirm ? '🙈' : '👁' }}</button>
                <span v-if="touched.confirm && !errors.confirm" class="field-check">✓</span>
              </div>
              <span v-if="errors.confirm" class="field-error">{{ errors.confirm }}</span>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              class="btn-submit"
              :disabled="isLoading"
              :class="{ 'btn-submit--loading': isLoading }"
            >
              <span v-if="!isLoading">Crear cuenta →</span>
              <span v-else class="spinner"></span>
            </button>

            <!-- Link a login -->
            <p class="login-link">
              ¿Ya tienes cuenta?
              <RouterLink to="/login" class="link">Inicia sesión</RouterLink>
            </p>

          </form>
        </div>

        <!-- Paso 2: Éxito -->
        <div v-else key="success" class="success-state">
          <div class="success-icon">✦</div>
          <h2 class="success-title">¡Revisa tu correo!</h2>
          <p class="success-msg">
            Enviamos un enlace de confirmación a <strong>{{ form.email }}</strong>.<br/>
          </p>
          <p class="success-msg" style="margin-top: 0.5rem; font-size: 0.85rem">
             Confirma tu cuenta para poder iniciar sesión.
          </p>
          
            <RouterLink to="/login" class="btn-submit" style="text-decoration:none; text-align:center;">
            Ir al login →
            </RouterLink>
        </div>

      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router  = useRouter()
const { register} = useAuth()

// ── Estado ──
const form = reactive({ name: '', email: '', password: '', confirm: '' })
const errors  = reactive({ name: '', email: '', password: '', confirm: '' })
const touched = reactive({ name: false, email: false, password: false, confirm: false })

const showPassword = ref(false)
const showConfirm  = ref(false)
const isLoading    = ref(false)
const errorMsg     = ref('')
const success      = ref(false)
const countdown    = ref(3)

// ── Progreso ──
const progressPercent = computed(() => {
  let score = 0
  if (form.name.length >= 2)                        score += 25
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) score += 25
  if (form.password.length >= 6)                    score += 25
  if (form.confirm && form.confirm === form.password) score += 25
  return score
})

// ── Fuerza de contraseña ──
const passwordStrength = computed(() => {
  const p = form.password
  let score = 0
  if (p.length >= 6)               score++
  if (p.length >= 10)              score++
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p))     score++

  const levels = [
    { score: 0, label: '',         color: '#3a3530' },
    { score: 1, label: 'Débil',    color: '#e07070' },
    { score: 2, label: 'Regular',  color: '#e8c46e' },
    { score: 3, label: 'Buena',    color: '#6eb4e8' },
    { score: 4, label: 'Fuerte',   color: '#6fcf97' },
  ]
  return levels[score]
})

// ── Validaciones ──
function validateName() {
  touched.name = true
  errors.name = !form.name
    ? 'El nombre es obligatorio.'
    : form.name.length < 2
      ? 'Mínimo 2 caracteres.'
      : ''
}

function validateEmail() {
  touched.email = true
  if (!form.email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido.'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  touched.password = true
  errors.password = !form.password
    ? 'La contraseña es obligatoria.'
    : form.password.length < 6
      ? 'Mínimo 6 caracteres.'
      : ''
}

function validateConfirm() {
  touched.confirm = true
  errors.confirm = !form.confirm
    ? 'Confirma tu contraseña.'
    : form.confirm !== form.password
      ? 'Las contraseñas no coinciden.'
      : ''
}

function isFormValid() {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirm()
  return !errors.name && !errors.email && !errors.password && !errors.confirm
}

// ── Registro ──
async function handleRegister() {
  errorMsg.value = ''
  if (!isFormValid()) return

  isLoading.value = true
  try {
    const { data, error } = await register(form.email, form.password, form.name)

    if (error) {
      // Mensajes de error legibles en español
      if (error.message.includes('already registered')) {
        errorMsg.value = 'Este correo ya está registrado.'
      } else if (error.message.includes('Password should be')) {
        errorMsg.value = 'La contraseña debe tener al menos 6 caracteres.'
      } else {
        errorMsg.value = 'Ocurrió un error. Intenta de nuevo.'
      }
      return
    }

    // Éxito — mostrar pantalla de confirmación
    success.value = true

  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ── PÁGINA ── */
.register-page {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}

.bg-grid {
  position: absolute; 
  inset: 0;
  background-image:
    linear-gradient(rgba(53, 65, 110, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(53, 65, 110, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  width: 500px; 
  height: 500px;
  background: radial-gradient(circle, rgba(42, 157, 143, 0.12) 0%, transparent 70%);
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* ── CARD ── */
.register-card {
  position: relative;
  width: 100%;
  max-width: 420%;           /* igual que login-card */
  background: white;
  border: 1px solid rgba(53, 65, 110, 0.08);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 30px rgba(53, 65, 110, 0.08);
  animation: cardIn 0.4s ease both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── HEADER ── */
.card-header { 
  text-align: center; 
  margin-bottom: 1.25rem; }

.card-icon {
  display: block;
  font-size: 2rem;
  color: #6b7a99;
  margin-bottom: 0.75rem;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
 
.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e2540;
  margin: 0 0 0.4rem;
}

.card-subtitle { 
  color: #6b7a99;
  margin: 0; 
}

/* ── PROGRESO ── */
.progress-bar {
  height: 3px;
  background: #e8ecf4;
  border-radius: 999px;
  margin-bottom: 0.35rem;
  overflow: hidden;;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #35416e, #2a9d8f);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-label {
  font-size: 0.72rem;
  color: #9a9fae;
  text-align: right;
  margin: 0 0 1.25rem;
}

/* ── ALERTA ── */
.alert-error {
  background: rgba(224, 112, 112, 0.1);
  border: 1px solid rgba(224, 112, 112, 0.3);
  color: #e07070;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-enter-active, .alert-leave-active { transition: all 0.3s ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── FORM ── */
.register-form { 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.field { 
  display: flex; 
  flex-direction: column; 
  gap: 0.4rem; 
}

.field-label {
  color: #6b7a99;
  font-size: 0.875rem;
  font-weight: 500;
}

.field-input-wrap { 
  position: relative; 
  display: flex; 
  align-items: center; 
}

.field-icon {
  position: absolute; left: 0.85rem;
  font-size: 0.9rem; pointer-events: none; opacity: 0.5;
}

.field-input {
  width: 100%;
  background: #f7f9fc;
  border: 1px solid #e8ecf4;
  border-radius: 10px;
  padding: 0.65rem 2.75rem 0.65rem 2.5rem;
  color: #1e2540;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.field-input::placeholder { color: #3e3a36; }

.field-input:focus {
  border-color: #35416e;
  background: white;
  box-shadow: 0 0 0 3px rgba(53, 65, 110, 0.08);
}

.field--error .field-input { border-color: rgba(224,112,112,0.5); }
.field--ok    .field-input { border-color: rgba(42, 157, 143, 0.45); }

.field-error { font-size: 0.8rem; color: #e07070; }

.field-check {
  position: absolute; right: 0.85rem;
  color: #2a9d8f; font-size: 0.9rem; pointer-events: none;
}

.field-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0;
}
.field-toggle:hover { opacity: 1; }

/* ── STRENGTH ── */
.strength-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
}

.strength-segment {
  flex: 1; height: 3px;
  background:  #e8ecf4;
  border-radius: 999px;
  transition: background 0.3s;
}

.strength-label { 
  font-size: 0.75rem;
  color: #9a9fae;
  white-space: nowrap;
  font-weight: 500;
}

/* ── BOTÓN ── */
.btn-submit {
  margin-top: 0.5rem;
  padding: 0.8rem;
  background: #35416e;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.2s;
  width: 100%;
}

.btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
 
/* ── LOGIN LINK ── */
.login-link {
  font-size: 0.85rem;
  color: #6b7a99;
  text-align: center;
  margin: 0;
 }
.link {
  color: #35416e;
  text-decoration: none;
  font-weight: 700;
 }
.link:hover { text-decoration: underline; }

/* ── SUCCESS ── */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 1rem 0;
}

.success-icon {
  font-size: 2.5rem;
  color: #2a9d8f;
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.4); }
  to   { opacity: 1; transform: scale(1); }
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e2540;
  margin: 0;
}

.success-msg {
  color: #6b7a99;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
 }
.success-msg strong { color: #c8a96e; }

.success-info {
  display: flex; gap: 0.75rem; align-items: center;
  background: rgba(111,207,151,0.07);
  border: 1px solid rgba(111,207,151,0.15);
  border-radius: 8px; padding: 0.6rem 1rem;
  font-size: 0.85rem;
}

/* ── TRANSICIONES ── */
.slide-enter-active, .slide-leave-active { transition: all 0.35s ease; }
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to   { opacity: 0; transform: translateX(-30px); }
</style>