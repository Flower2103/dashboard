// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

// Estado GLOBAL compartido (fuera del composable)
const _user = ref(null)
// Inicializa la sesión al cargar la app
supabase.auth.getSession().then(({ data }) => {
  _user.value = data.session?.user ?? null
})

// Escucha cambios de sesión en tiempo real
supabase.auth.onAuthStateChange((_event, session) => {
  _user.value = session?.user ?? null
})



export function useAuth() {
  const isAuthenticated = computed(() => !!_user.value)
  const user = computed(() => _user.value)
  const loading = ref(false)
  const error = ref(null)

  async function login(email, password) {
    loading.value = true
    error.value = null
    
    const { data, error: err } = await supabase.auth.signInWithPassword({ 
      email, 
      password })
    if (err) error.value = err.message
    loading.value = false
    return { data, error: err }
  }

  async function register(email, password, name) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({ 
      email, 
      password })
    if (err) error.value = err.message
    loading.value = false
    return { data, error: err }
  }

  async function logout() {
    await supabase.auth.signOut()
    // _user se limpia automáticamente via onAuthStateChange
  }

  // Registra un nuevo usuario
  function register(name, email, password) {
    const exists = _registeredUsers.value.some(u => u.email === email)
    if (exists) return { ok: false, error: 'Este correo ya está registrado.' }

    _registeredUsers.value.push({ name, email, password })
    return { ok: true }
  }

  function emailExists(email) {
    return _registeredUsers.value.some(u => u.email === email)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    loading,
    error,
    emailExists,
    
  }
}
