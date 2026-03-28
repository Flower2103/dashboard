<!-- src/views/LoginView.vue -->
<template>
  <div class="login-page">
    <!-- Fondo decorativo -->
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">
      <!-- Encabezado -->
      <div class="card-header">
        <span class="card-icon">🤿</span>
        <h1 class="card-title">Bienvenid@</h1>
        <p class="card-subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      <!-- Alerta de error -->
      <Transition name="alert">
        <div v-if="errorMsg" class="alert-error" role="alert">
          <span>⚠</span> {{ errorMsg }}
        </div>
      </Transition>

      <!-- Formulario -->
      <form class="login-form" @submit.prevent="handleLogin" novalidate>

        <!-- Campo email -->
        <div class="field" :class="{ 'field--error': errors.email }">
          <label for="email" class="field-label">Correo electrónico</label>
          <div class="field-input-wrap">
            <span class="field-icon">✉</span>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="field-input"
              placeholder="usuario@ejemplo.com"
              autocomplete="email"
              @blur="validateEmail"
            />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Campo contraseña -->
        <div class="field" :class="{ 'field--error': errors.password }">
          <label for="password" class="field-label">Contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔑</span>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              autocomplete="current-password"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="field-toggle"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
            >
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Credenciales de prueba -->
        <div class="hint-box">
          <span class="hint-label">Credenciales de prueba:</span>
          <code>admin@vue.com</code> / <code>vue1234</code>
        </div>

        <!-- Botón enlace recuperar -->
        <button type="button" class="btn-forgot" @click="showForgot = true">
          ¿Olvidaste tu contraseña?
        </button>

        <!-- Botón submit -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="isLoading"
          :class="{ 'btn-submit--loading': isLoading }"
        >
          <span v-if="!isLoading">Iniciar sesión →</span>
          <span v-else class="spinner"></span>
        </button>

      </form>
      <!-- Recuperar -->
      <Transition name="overlay">
        <div v-if="showForgot" class="forgot-overlay" @click.self="closeForgot">
          <Transition name="modal">
            <div class="forgot-card" v-if="showForgot">
 
              <div class="forgot-header">
                <span class="forgot-icon">📩</span>
                <h2 class="forgot-title">Recuperar contraseña</h2>
                <p class="forgot-desc">
                  Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              <!-- Éxito -->
              <Transition name="alert">
                <div v-if="forgotSuccess" class="alert-success">
                  ✅ Revisa tu bandeja, te enviamos el enlace.
                </div>
              </Transition>
 
              <!-- Campo email -->
              <div v-if="!forgotSuccess" class="field" :class="{ 'field--error': forgotError }">
                <label for="forgot-email" class="field-label">Correo electrónico</label>
                <div class="field-input-wrap">
                  <span class="field-icon">✉</span>
                  <input
                    id="forgot-email"
                    v-model.trim="forgotEmail"
                    type="email"
                    class="field-input"
                    placeholder="usuario@ejemplo.com"
                    @keyup.enter="handleForgot"
                  />
                </div>
                <span v-if="forgotError" class="field-error">{{ forgotError }}</span>
              </div>

              <!-- Acciones -->
              <div class="forgot-actions">
                <button type="button" class="btn-cancel" @click="closeForgot">
                  {{ forgotSuccess ? 'Cerrar' : 'Cancelar' }}
                </button>
                <button
                  v-if="!forgotSuccess"
                  type="button"
                  class="btn-submit"
                  :disabled="isLoading"
                  @click="handleForgot"
                >
                  <span v-if="!isLoading">Enviar enlace →</span>
                  <span v-else class="spinner"></span>
                </button>
              </div>
 
            </div>
          </Transition>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, resetPassword, loading: isLoading } = useAuth()

// ── Estado del formulario ──
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const errorMsg = ref('')

// ── Estado modal recuperación ──
const showForgot = ref(false)
const forgotEmail = ref('')
const forgotError = ref('')
const forgotSuccess = ref(false)

// ── Validaciones individuales ──
function validateEmail() {
  if (!form.email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido.'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres.'
  } else {
    errors.password = ''
  }
}

function isFormValid() {
  validateEmail()
  validatePassword()
  return !errors.email && !errors.password
}


// ── Login con Supabase ──
async function handleLogin() {
  errorMsg.value = ''
  if (!isFormValid()) return

  const { error: err } = await login(form.email, form.password)

  if (err) {
    errorMsg.value = 'Credenciales incorrectas. Intenta de nuevo.'
    return
  }

  await router.push(route.query.redirect || '/dashboard')
}

// ── Recuperar contraseña ──
function closeForgot() {
  showForgot.value = false
  setTimeout(() => {
    forgotEmail.value = ''
    forgotError.value = ''
    forgotSuccess.value = false
  }, 300)
}

async function handleForgot() {
  forgotError.value = ''
 
  if (!forgotEmail.value) {
    forgotError.value = 'El correo es obligatorio.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.value)) {
    forgotError.value = 'Ingresa un correo válido.'
    return
  }
 
  const { error: err } = await resetPassword(forgotEmail.value)
 
  if (err) {
    forgotError.value = 'No se pudo enviar el correo. Intenta de nuevo.'
    return
  }
 
  forgotSuccess.value = true
  setTimeout(closeForgot, 3500)
}
</script>

<style scoped>
/* ── PÁGINA ── */
.login-page {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}

/* Fondo decorativo */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(53, 65, 110, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(53, 65, 110, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

.bg-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;

  background: radial-gradient(circle, rgba(42, 157, 143, 0.12) 0%, transparent 70%);
}

/* ── CARD ── */
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 1.75rem;
}

.card-icon {
  display: block;
  font-size: 2rem;
  color: #6b7a99;
  margin-bottom: 0.75rem;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e2540;
  margin: 0 0 0.4rem;
}

.card-subtitle {
  color: #6b7a99;
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

/* ── ALERTA ÉXITO ── */
.alert-success {
  background: rgba(42, 157, 143, 0.1);
  border: 1px solid rgba(42, 157, 143, 0.3);
  color: #2a9d8f;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-enter-active, .alert-leave-active { transition: all 0.3s ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── FORMULARIO ── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  color: #6b7a99;
  font-size: 0.88rem;
}

.field-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 0.85rem;
  font-size: 0.9rem;
  pointer-events: none;
  opacity: 0.5;
}

.field-input {
  width: 100%;
  background: #f7f9fc;
  border: 1px solid #e8ecf4;
  border-radius: 10px;
  padding: 0.65rem 2.75rem 0.65rem 2.5rem;
  color: #1e2540;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.field-input::placeholder { color: #b0aaa5; }

.field-input:focus {
  outline: none;
  border-color: #35416e;
  background: white;
  box-shadow: 0 0 0 3px rgba(53, 65, 110, 0.08);
}

.field--error .field-input {
  border-color: rgba(224, 112, 112, 0.5);
}

.field-error {
  font-size: 0.8rem;
  color: #e07070;
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

/* ── HINT BOX ── */
.hint-box {
  background: #f7f9fc;
  border: 1px dashed #e8ecf4;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  font-size: 0.8rem;
  color: #6b7a99;
}

.hint-label { color: #9a938c; }

code {
  background: rgba(53, 65, 110, 0.08);
  color: #35416e;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

/* ── LINK OLVIDÉ CONTRASEÑA ── */
.btn-forgot {
  background: none;
  border: none;
  color: #6b7a99;
  font-size: 0.82rem;
  cursor: pointer;
  text-align: right;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  align-self: flex-end;
  margin-top: -0.4rem;
  transition: color 0.2s;
}

.btn-forgot:hover { color: #35416e; }

/* ── BOTÓN SUBMIT ── */
.btn-submit {
  margin-top: 0.5rem;
  padding: 0.8rem;
  background: #35416e;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
  width: 100%;

}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(13, 13, 15, 0.3);
  border-top-color: #0d0d0f;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── MODAL RECUPERAR CONTRASEÑA ── */
.forgot-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 37, 64, 0.45);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}
 
.forgot-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 25px 60px rgba(30, 37, 64, 0.18);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
 
.forgot-header {
  text-align: center;
}
 
.forgot-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.6rem;
}
 
.forgot-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e2540;
  margin: 0 0 0.4rem;
}
 
.forgot-desc {
  color: #6b7a99;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}
 
.forgot-actions {
  display: flex;
  gap: 0.75rem;
}
 
.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background: #f7f9fc;
  border: 1px solid #e8ecf4;
  border-radius: 10px;
  color: #6b7a99;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
 
.btn-cancel:hover {
  background: #e8ecf4;
  color: #35416e;
}
 
.forgot-actions .btn-submit {
  flex: 1.5;
  margin-top: 0;
}
 
/* Transición overlay */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
 
/* Transición modal */
.modal-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from { opacity: 0; transform: scale(0.9) translateY(10px); }
.modal-leave-to   { opacity: 0; transform: scale(0.95) translateY(5px); }
</style>
