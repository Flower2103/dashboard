<!-- src/views/DashboardView.vue -->
<template>
  <div class="dashboard">

    <!-- HEADER DE BIENVENIDA -->
    <section class="welcome-section">
      <div class="welcome-text">
        <p class="welcome-label">Panel de Administración</p>
        <h1 class="welcome-title">
          Hola, <span class="highlight">{{ displayName }}</span> 🤿
        </h1>
        <p class="welcome-sub">{{ currentDate }} — Ensenada, B.C.</p>
      </div>
      <div class="welcome-badge">
        <span class="badge-dot"></span>
        <span class="badge-text">Sistema Activo</span>
      </div>
    </section>

    <!-- TARJETAS DE STATS -->
    <section class="stats-grid">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="stat-card"
        :style="{ animationDelay: `${i * 0.08}s` }"
      >
        <div class="stat-icon-wrapper">{{ stat.icon }}</div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'trend--up' : 'trend--down'">
          {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
        </div>
      </div>
    </section>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="dashboard-body">

      <!-- ACTIVIDAD RECIENTE -->
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Operaciones reciente</h2>
          <span class="panel-badge">{{ activity.length }} registros</span>
        </div>
        <ul class="activity-list">
          <li
            v-for="(item, i) in activity"
            :key="i"
            class="activity-item"
            :style="{ animationDelay: `${i * 0.07}s` }"
          >
            <div class="activity-icon-dot" :class="`dot--${item.type}`"></div>
            <div class="activity-content">
              <span class="activity-msg">{{ item.msg }}</span>
              <span class="activity-time">{{ item.time }}</span>
            </div>
          </li>
        </ul>
      </section>

      <!-- INFO DE SESIÓN -->
      <section class="panel panel--sidebar">
        <div class="panel-header">
          <h2 class="panel-title">Estado de conexión</h2>
        </div>
        <div class="session-info">
          <div class="session-row">
            <span class="session-key">Usuario: </span>
            <span class="session-val">{{ displayName }}</span>
          </div>
          <div class="session-row">
            <span class="session-key">Correo: </span>
            <span class="session-val">{{ userEmail }}</span>
          </div>
          <div class="session-row">
            <span class="session-key">Estado: </span>
            <span class="session-val status-active">● Autenticado</span>
          </div>
        </div>

        <button class="btn-logout" @click="handleLogout">
          Cerrar sesión
        </button>
      </section>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

// ── Datos reales de Supabase ──
// user.value.email → email del usuario
// user.value.user_metadata?.full_name → nombre si usó OAuth
// user.value.id → UUID del usuario

const displayName = computed(() => {
  return user.value?.user_metadata?.full_name
    || user.value?.user_metadata?.name
    || user.value?.email?.split('@')[0]  // fallback: parte antes del @
    || 'Usuario'
})

const userEmail = computed(() => user.value?.email || '—')

const userId = computed(() => {
  const id = user.value?.id || ''
  return id ? id.slice(0, 8) + '••••••••' : '—'  // muestra solo los primeros 8 chars
})

// ── Fecha actual formateada ──
const currentDate = computed(() =>
  new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
)

// ── Datos de estadísticas ──
const stats = [
  { icon: '📦', label: 'Proyectos',   value: '12',  trend: +8  },
  { icon: '✅', label: 'Tareas',      value: '48',  trend: +15 },
  { icon: '👥', label: 'Usuarios',    value: '7',   trend: -2  },
  { icon: '📈', label: 'Rendimiento', value: '94%', trend: +3  },
]

// ── Actividad reciente simulada ──
const activity = [
  { type: 'success', msg: 'Inicio de sesión exitoso',   time: 'Justo ahora'   },
  { type: 'info',    msg: 'Perfil actualizado',          time: 'Hace 2 horas'  },
  { type: 'warning', msg: 'Intento de acceso denegado',  time: 'Ayer, 11:30pm' },
  { type: 'success', msg: 'Nueva tarea completada',      time: 'Hace 2 días'   },
  { type: 'info',    msg: 'Reporte mensual generado',    time: 'Hace 3 días'   },
]

// ── Logout ──
async function handleLogout() {
  await logout()
  await router.push('/login')
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.4s ease both;
}

/* ── WELCOME ── */
.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(53, 65, 110, 0.05);
  border: 1px solid rgba(53, 65, 110, 0.08);
}

.welcome-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #2a9d8f;
  margin-bottom: 0.5rem;
}

.welcome-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e2540;
}

.highlight {
  color: #35416e;
}


.welcome-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  background: rgba(42, 157, 143, 0.1);
  border-radius: 999px;
  color: #2a9d8f;
  font-weight: 600;
  font-size: 0.85rem;
}

.badge-dot {
  width: 8px; height: 8px;
  background: #2a9d8f;
  border-radius: 50%;
  box-shadow: 0 0 8px #2a9d8f;
}


/* ── STATS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e8ecf4;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #35416e;
  box-shadow: 0 10px 25px rgba(53, 65, 110, 0.1);
}

.stat-icon-wrapper {
  width: 48px; height: 48px;
  background: rgba(53, 65, 110, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e2540;
  display: block;
}

.stat-label {
  font-size: 0.85rem;
  color: #6b7a99;
}

/* ── BODY ── */
.dashboard-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.25rem;
}

/* ── PANEL ── */
.panel {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid #e8ecf4;
}

.panel-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  color: #1e2540;
}


/* ── ACTIVIDAD ── */

.activity-item {
  padding: 0.8rem 0;
  border-bottom: 1px dashed #e8ecf4;
}

.activity-msg {
  font-size: 0.875rem;
  font-weight: 500;
  color: #35416e;
}

.activity-time {
  color: #8892a4;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}



/* ── LOGOUT ── */
.btn-logout {
  margin-top: 1rem;
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  border: 1.5px solid #ffaaaa;
  background: transparent;
  color: #ff5555;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #fff5f5;
  transform: scale(0.98);
}

@media (max-width: 992px) {
  .dashboard-body { grid-template-columns: 1fr; }
}
</style>
