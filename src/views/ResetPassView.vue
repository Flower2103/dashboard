<!-- src/views/ResetPasswordView.vue -->
<template>
  <div class="login-page">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">

      <!-- Encabezado -->
      <div class="card-header">
        <span class="card-icon">🔐</span>
        <h1 class="card-title">Nueva contraseña</h1>
        <p class="card-subtitle">Elige una contraseña segura para tu cuenta</p>
      </div>

      <!-- Verificando token -->
      <div v-if="checking" class="state-box">
        <span class="spinner-lg"></span>
        <p class="state-msg">Verificando enlace...</p>
      </div>

      <!-- Token inválido / expirado -->
      <div v-else-if="tokenError" class="state-box state-box--error">
        <span class="state-icon">⚠️</span>
        <p>El enlace ha expirado o no es válido.</p>
        <button class="btn-link" @click="router.push('/login')">
          Solicitar un nuevo enlace →
        </button>
      </div>

      <!-- Formulario -->
      <form v-else-if="!success" class="login-form" @submit.prevent="handleReset" novalidate>

        <!-- Nueva contraseña -->
        <div class="field" :class="{ 'field--error': errors.password }">
          <label for="password" class="field-label">Nueva contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔑</span>
            <input
              id="password"
              v-model="form.password"
              :type="show.password ? 'text' : 'password'"
              class="field-input"
              placeholder="Mínimo 6 caracteres"
              autocomplete="new-password"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="field-toggle"
              @click="show.password = !show.password"
              :aria-label="show.password ? 'Ocultar' : 'Ver'"
            >
              {{ show.password ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Confirmar contraseña -->
        <div class="field" :class="{ 'field--error': errors.confirm }">
          <label for="confirm" class="field-label">Confirmar contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔑</span>
            <input
              id="confirm"
              v-model="form.confirm"
              :type="show.confirm ? 'text' : 'password'"
              class="field-input"
              placeholder="Repite tu contraseña"
              autocomplete="new-password"
              @blur="validateConfirm"
            />
            <button
              type="button"
              class="field-toggle"
              @click="show.confirm = !show.confirm"
              :aria-label="show.confirm ? 'Ocultar' : 'Ver'"
            >
              {{ show.confirm ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.confirm" class="field-error">{{ errors.confirm }}</span>
        </div>

        <!-- Indicador de fuerza -->
        <div class="strength-wrap" v-if="form.password">
          <div class="strength-bar">
            <div
              class="strength-fill"
              :class="strength.class"
              :style="{ width: strength.pct }"
            ></div>
          </div>
          <span class="strength-label" :class="strength.class">{{ strength.label }}</span>
        </div>

        <!-- Error servidor -->
        <Transition name="alert">
          <div v-if="serverError" class="alert-error">
            <span>⚠</span> {{ serverError }}
          </div>
        </Transition>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">Guardar contraseña →</span>
          <span v-else class="spinner"></span>
        </button>

      </form>

      <!-- Éxito -->
      <div v-else class="state-box state-box--success">
        <span class="state-icon">✅</span>
        <p>¡Contraseña actualizada correctamente!</p>
        <p class="state-sub">Redirigiendo al inicio de sesión...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

// ── Estado ──
const form = reactive({ password: '', confirm: '' })
const errors = reactive({ password: '', confirm: '' })
const show = reactive({ password: false, confirm: false })

const isLoading = ref(false)
const serverError = ref('')
const success = ref(false)
const tokenError = ref(false)
const checking = ref(true)

let recoveryToken = null
let recoveryRefreshToken = null

// ── Lifecycle ──
onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  
  console.log('session completa:', JSON.stringify(data.session, null, 2))
  
  if (!data.session) {
    tokenError.value = true
    checking.value = false
    return
  }

  recoveryToken = data.session.access_token
  recoveryRefreshToken = data.session.refresh_token
  checking.value = false
})

// ── Computed: fuerza de contraseña ──
const strength = computed(() => {
  const p = form.password
  if (!p) return { label: '', class: '', pct: '0%' }

  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const levels = [
    { label: 'Muy débil',  class: 'str--weak',   pct: '25%'  },
    { label: 'Débil',      class: 'str--weak',   pct: '25%'  },
    { label: 'Regular',    class: 'str--fair',   pct: '60%'  },
    { label: 'Fuerte',     class: 'str--good',   pct: '80%'  },
    { label: 'Muy fuerte', class: 'str--strong', pct: '100%' },
  ]

  return levels[score]
})

// ── Validaciones ──
function validatePassword() {
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres.'
  } else {
    errors.password = ''
  }
}

function validateConfirm() {
  if (!form.confirm) {
    errors.confirm = 'Confirma tu contraseña.'
  } else if (form.confirm !== form.password) {
    errors.confirm = 'Las contraseñas no coinciden.'
  } else {
    errors.confirm = ''
  }
}

function isFormValid() {
  validatePassword()
  validateConfirm()
  return !errors.password && !errors.confirm
}

// ── Acción principal ──
async function handleReset() {
  serverError.value = ''
  if (!isFormValid()) return

  isLoading.value = true

  const { error } = await supabase.auth.updateUser({ password: form.password })
  isLoading.value = false

  if (error) {
    if (error.message.includes('different from the old password')) {
      serverError.value = 'La nueva contraseña debe ser diferente a la actual.'
    } else {
      serverError.value = 'No se pudo actualizar. El enlace puede haber expirado.'
    }
    await supabase.auth.signOut()
    return
  }

  await supabase.auth.signOut()
  success.value = true
  setTimeout(() => router.push('/login'), 2500)
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
  margin-bottom: 0.75rem;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e2540;
  margin: 0 0 0.4rem;
}

.card-subtitle { color: #6b7a99; }

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

.field--error .field-input { border-color: rgba(224, 112, 112, 0.5); }

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

/* ── FUERZA CONTRASEÑA ── */
.strength-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e8ecf4;
  border-radius: 99px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease, background 0.4s ease;
}

.str--weak   { background: #e07070; color: #e07070; }
.str--fair   { background: #f4a261; color: #f4a261; }
.str--good   { background: #2a9d8f; color: #2a9d8f; }
.str--strong { background: #3a7d44; color: #3a7d44; }

.strength-label {
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}

/* ── ALERTA ERROR ── */
.alert-error {
  background: rgba(224, 112, 112, 0.1);
  border: 1px solid rgba(224, 112, 112, 0.3);
  color: #e07070;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-enter-active, .alert-leave-active { transition: all 0.3s ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-8px); }

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

/* ── SPINNERS ── */
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

.spinner-lg {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid rgba(53, 65, 110, 0.15);
  border-top-color: #35416e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── ESTADOS ── */
.state-box {
  text-align: center;
  padding: 1.75rem 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.state-box--success {
  background: rgba(42, 157, 143, 0.08);
  border: 1px solid rgba(42, 157, 143, 0.25);
  color: #2a9d8f;
}

.state-box--error {
  background: rgba(224, 112, 112, 0.08);
  border: 1px solid rgba(224, 112, 112, 0.25);
  color: #e07070;
}

.state-icon { font-size: 2rem; }

.state-msg {
  color: #6b7a99;
  margin: 0;
}

.state-sub {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
}

.btn-link {
  background: none;
  border: none;
  color: inherit;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.btn-link:hover { opacity: 0.8; }
</style>