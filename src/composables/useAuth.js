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
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') return  // ← ignorar este evento
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
      password,
      options: { data: { full_name: name } }
     })
    if (err) error.value = err.message
    loading.value = false
    return { data, error: err }
  }

  async function logout() {
    await supabase.auth.signOut()
    // _user se limpia automáticamente via onAuthStateChange
  }

  function emailExists(email) {
    return _registeredUsers.value.some(u => u.email === email)
  }

async function resetPassword(email) {
  loading.value = true
  error.value = null
  const { data, error: err } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`, // ruta donde el usuario cambia su contraseña
  })
  if (err) error.value = err.message
  loading.value = false
  return { data, error: err }
}

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
    loading,
    error,
    emailExists,
  
  }
}
