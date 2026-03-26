<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
 
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <div class="wave wave--1"></div>
        <div class="wave wave--2"></div>
        <div class="wave wave--3"></div>
        <div class="bubbles">
          <span v-for="n in 14" :key="n" class="bubble" :style="bubbleStyle(n)"></span>
        </div>
      </div>
 
      <div class="container hero-inner">
        <div class="hero-content">
          <div class="hero-chip">
            <span class="chip-dot"></span>
            Sistema de Administración
          </div>
 
          <h1 class="hero-title">
            Gestión de Clientes<br/>
            <em>Buceo Comercial</em>
          </h1>
 
          <p class="hero-desc">
            Administra tu catálogo de clientes, servicios y operaciones submarinas desde un solo lugar.
          </p>
 
          <div class="hero-actions">
            <RouterLink v-if="!isAuthenticated" to="/login" class="btn btn--primary">
              Acceder al sistema →
            </RouterLink>
            <RouterLink v-else to="/dashboard" class="btn btn--primary">
              Ir al Dashboard →
            </RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/register" class="btn btn--ghost">
              Crear cuenta
            </RouterLink>
          </div>
 
          <div class="hero-stats">
            <div class="hero-stat" v-for="stat in heroStats" :key="stat.label">
              <span class="hero-stat__value">{{ stat.value }}</span>
              <span class="hero-stat__label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
 
        <div class="hero-visual" aria-hidden="true">
          <div class="diver-card">
            <div class="diver-card__header">
              <span class="diver-card__badge">● En operación</span>
              <span class="diver-card__date">{{ currentDate }}</span>
            </div>
            <div class="diver-card__body">
              <div class="depth-gauge">
                <div class="depth-gauge__label">Profundidad máxima</div>
                <div class="depth-gauge__value">32m</div>
                <div class="depth-gauge__bar">
                  <div class="depth-gauge__fill"></div>
                </div>
              </div>
              <div class="diver-metrics">
                <div class="metric" v-for="m in diverMetrics" :key="m.label">
                  <span class="metric__icon">{{ m.icon }}</span>
                  <span class="metric__val">{{ m.val }}</span>
                  <span class="metric__lbl">{{ m.label }}</span>
                </div>
              </div>
            </div>
            <div class="diver-card__footer">
              <div class="diver-avatar"><span>🤿</span></div>
              <div>
                <div class="diver-name">Buzo #4 — Carlos M.</div>
                <div class="diver-task">Inspección estructural</div>
              </div>
              <span class="diver-status">Activo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
 
    <!-- BANDA STATS navy -->
    <section class="stats-band">
      <div class="container stats-band__inner">
        <div class="band-stat" v-for="stat in bandStats" :key="stat.label">
          <span class="band-stat__icon">{{ stat.icon }}</span>
          <span class="band-stat__value">{{ stat.value }}</span>
          <span class="band-stat__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>
 
    <!-- MÓDULOS -->
    <section class="modules-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Módulos del sistema</h2>
          <p class="section-sub">Todo lo que necesitas para administrar tu empresa</p>
        </div>
        <div class="modules-grid">
          <div
            v-for="(mod, i) in modules"
            :key="mod.title"
            class="module-card"
            :style="{ animationDelay: `${i * 0.1}s` }"
          >
            <div class="module-card__top">
              <span class="module-icon">{{ mod.icon }}</span>
              <span class="module-tag">{{ mod.tag }}</span>
            </div>
            <h3 class="module-title">{{ mod.title }}</h3>
            <p class="module-desc">{{ mod.desc }}</p>
            <div class="module-footer">
              <span class="module-count">{{ mod.count }}</span>
              <span class="module-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
 
    <!-- FLUJO -->
    <section class="flow-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Flujo de trabajo</h2>
          <p class="section-sub">Del cliente al servicio completado</p>
        </div>
        <div class="flow-timeline">
          <div
            v-for="(step, i) in flowSteps"
            :key="step.label"
            class="flow-step"
            :style="{ animationDelay: `${i * 0.12}s` }"
          >
            <div class="flow-step__number">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="flow-step__icon">{{ step.icon }}</div>
            <h4 class="flow-step__title">{{ step.label }}</h4>
            <p class="flow-step__desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>
 
    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-bg" aria-hidden="true">
        <div class="cta-wave cta-wave--1"></div>
        <div class="cta-wave cta-wave--2"></div>
      </div>
      <div class="container cta-content">
        <span class="cta-badge">🤿 Sistema listo</span>
        <h2 class="cta-title">Empieza a gestionar<br/>tus operaciones hoy</h2>
        <p class="cta-sub">Accede al sistema y administra tu catálogo de clientes de forma eficiente.</p>
        <RouterLink v-if="!isAuthenticated" to="/register" class="btn btn--white btn--lg">
          Crear cuenta gratis →
        </RouterLink>
        <RouterLink v-else to="/dashboard" class="btn btn--white btn--lg">
          Ver mi Dashboard →
        </RouterLink>
      </div>
    </section>
 
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()

const currentDate = computed(() =>
  new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
)

function bubbleStyle(n) {
  return {
    left: `${(n * 37) % 100}%`,
    animationDelay: `${(n * 0.7) % 6}s`,
    animationDuration: `${5 + (n % 4)}s`,
    width: `${6 + (n % 12)}px`,
    height: `${6 + (n % 12)}px`,
    opacity: 0.1 + (n % 3) * 0.06,
  }
}

const heroStats = [
  { value: '200+', label: 'Clientes' },
  { value: '15',   label: 'Buzos activos' },
  { value: '98%',  label: 'Satisfacción' },
]
 
const bandStats = [
  { icon: '👥', value: '200+',   label: 'Clientes registrados' },
  { icon: '🤿', value: '15',     label: 'Buzos certificados' },
  { icon: '⚙️', value: '48',     label: 'Operaciones activas' },
  { icon: '✅', value: '1,200+', label: 'Servicios completados' },
  { icon: '📈', value: '98%',    label: 'Satisfacción' },
]
 
const diverMetrics = [
  { icon: '🫧', val: '210 bar', label: 'Presión' },
  { icon: '🌡️', val: '18°C',   label: 'Temp' },
  { icon: '⏱️', val: '42 min', label: 'Fondo' },
]

const modules = [
  { icon: '👥', title: 'Clientes',    desc: 'Registra y gestiona tu cartera de clientes con historial completo de servicios.', tag: 'Catálogo', count: '200+ registros' },
  { icon: '🤿', title: 'Operaciones', desc: 'Planifica y da seguimiento a cada operación de buceo desde inicio hasta cierre.',  tag: 'Gestión',  count: '48 activas'    },
  { icon: '📋', title: 'Servicios',   desc: 'Catálogo de servicios: inspección, soldadura, corte, rescate y más.',              tag: 'Catálogo', count: '12 servicios'   },
  { icon: '📊', title: 'Reportes',    desc: 'Genera reportes de operaciones, facturación y desempeño por período.',             tag: 'Análisis', count: 'Tiempo real'    },
]

const flowSteps = [
  { icon: '📝', label: 'Registro de cliente', desc: 'Captura datos del cliente y tipo de servicio requerido.' },
  { icon: '🗓️', label: 'Programación',        desc: 'Asigna fecha, buzo y equipo para la operación.' },
  { icon: '🤿', label: 'Operación',            desc: 'El equipo ejecuta el trabajo con registro en tiempo real.' },
  { icon: '✅', label: 'Cierre y reporte',     desc: 'Genera el reporte final y actualiza el historial del cliente.' },
]
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2.5rem;
}

.home {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-bottom: 3rem;
  background: #f8f9fc;
  color: #1e2540;
  font-family: 'DM Sans', sans-serif;
}

/* ── HERO ── */
.hero {
  position: relative;
  overflow: hidden;
  padding: 5rem 0 4rem;
  background: #f8f9fc;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; }
  .hero-visual { display: none; }
  .container { padding: 0 1.25rem; }
}

/* Fondo decorativo */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.wave { 
  position: absolute; 
  border-radius: 50%; 
  opacity: 0.06; }
.wave--1 { 
  width: 800px; 
  height: 800px; 
  background: #35416e; 
  bottom: -350px; 
  right: -200px; 
  animation: waveDrift 12s ease-in-out infinite alternate; 
}
.wave--2 { 
  width: 500px; 
  height: 500px; 
  background: #5b9bd5; 
  top: -200px; 
  left: -100px; 
  animation: waveDrift 16s ease-in-out infinite alternate-reverse; 
}
.wave--3 { 
  width: 350px; 
  height: 350px; 
  background: #2a9d8f; 
  top: 30%; 
  left: 45%; 
  opacity: 0.04; 
  animation: waveDrift 9s ease-in-out infinite alternate; 
}

@keyframes waveDrift {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(25px,18px) scale(1.06); }
}

.bubbles { 
  position: absolute; 
  inset: 0; }
.bubble { 
  position: absolute; 
  bottom: -20px; 
  border-radius: 50%; 
  background: #35416e; 
  animation: bubbleRise linear infinite; 
}

@keyframes bubbleRise {
  0%   { transform: translateY(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-110vh) translateX(15px); opacity: 0; }
}



/* Contenido hero */
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(53,65,110,0.08);
  border: 1px solid rgba(53,65,110,0.2);
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: #35416e;
  width: fit-content;
  font-weight: 600;
}

.chip-dot {
  width: 7px; height: 7px;
  background: #2a9d8f;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2.4rem, 4.5vw, 3.4rem);
  font-weight: 800; letter-spacing: -0.04em;
  color: #1e2540; line-height: 1.1; margin: 0;
}
 
.hero-title em {
  font-style: normal; color: #35416e; position: relative;
}
.hero-title em::after {
  content: ''; position: absolute; bottom: 2px; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, #35416e, #5b9bd5); border-radius: 2px;
}
 
.hero-desc { color: #6b7a99; font-size: 1.05rem; line-height: 1.7; margin: 0; max-width: 440px; }
.hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.hero-stats { display: flex; gap: 2.5rem; padding-top: 1rem; border-top: 1px solid rgba(53,65,110,0.1); }
.hero-stat  { display: flex; flex-direction: column; gap: 0.15rem; }
.hero-stat__value { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 700; color: #35416e; }
.hero-stat__label { font-size: 0.75rem; color: #8892a4; text-transform: uppercase; letter-spacing: 0.05em; }
 
.btn {
  display: inline-flex; align-items: center;
  padding: 0.75rem 1.6rem; border-radius: 10px;
  font-size: 0.9rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
  text-decoration: none; cursor: pointer; border: none; transition: all 0.2s ease;
}

.btn--primary { background: #35416e; color: white; }
.btn--primary:hover { background: #2a3358; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(53,65,110,0.3); }
.btn--ghost { background: white; color: #35416e; border: 1.5px solid rgba(53,65,110,0.25); }
.btn--ghost:hover { border-color: #35416e; background: rgba(53,65,110,0.04); }
.btn--white { background: white; color: #35416e; font-weight: 700; }
.btn--white:hover { background: #f0f2f8; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.btn--lg { padding: 0.9rem 2.2rem; font-size: 1rem; }
 
/* Diver card */
.hero-visual { position: relative; z-index: 1; display: flex; justify-content: center; }
 
.diver-card {
  background: white; border: 1px solid rgba(53,65,110,0.1); border-radius: 20px;
  width: 100%; max-width: 380px;
  box-shadow: 0 4px 6px rgba(53,65,110,0.04), 0 20px 48px rgba(53,65,110,0.14);
  animation: floatCard 6s ease-in-out infinite; overflow: hidden;
}
@keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

.diver-card__header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: #35416e; }
.diver-card__badge { font-size: 0.75rem; font-weight: 600; color: #6fcf97; }
.diver-card__date  { font-size: 0.72rem; color: rgba(255,255,255,0.6); }
.diver-card__body  { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
 
.depth-gauge__label { font-size: 0.72rem; color: #8892a4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
.depth-gauge__value { font-family: 'Sora', sans-serif; font-size: 2.2rem; font-weight: 700; color: #35416e; line-height: 1; margin-bottom: 0.6rem; }
.depth-gauge__bar   { height: 6px; background: #e8ecf4; border-radius: 999px; overflow: hidden; }
.depth-gauge__fill  { height: 100%; width: 65%; background: linear-gradient(90deg, #35416e, #5b9bd5); border-radius: 999px; animation: fillBar 3s ease-in-out infinite alternate; }
@keyframes fillBar { from { width: 55%; } to { width: 72%; } }
 
.diver-metrics { display: flex; gap: 0.75rem; }
.metric { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.2rem; padding: 0.75rem 0.5rem; background: #f8f9fc; border-radius: 10px; }
.metric__icon { font-size: 1.1rem; }
.metric__val  { font-size: 0.82rem; font-weight: 700; color: #35416e; }
.metric__lbl  { font-size: 0.65rem; color: #8892a4; }
 
.diver-card__footer { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-top: 1px solid #e8ecf4; }
.diver-avatar { width: 36px; height: 36px; background: rgba(53,65,110,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.diver-name   { font-size: 0.82rem; font-weight: 600; color: #1e2540; }
.diver-task   { font-size: 0.72rem; color: #8892a4; }
.diver-status { margin-left: auto; font-size: 0.72rem; font-weight: 600; color: #2a9d8f; background: rgba(42,157,143,0.1); padding: 0.2rem 0.6rem; border-radius: 999px; }
 
/* ── STATS BAND ── */
.stats-band { background: #35416e; padding: 2.5rem 0; }
.stats-band__inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
.band-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; flex: 1; min-width: 120px; }
.band-stat__icon  { font-size: 1.4rem; }
.band-stat__value { font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 700; color: white; }
.band-stat__label { font-size: 0.75rem; color: rgba(255,255,255,0.6); text-align: center; }
 
/* ── SECCIÓN HEADER ── */
.section-header { text-align: center; margin-bottom: 2.5rem; }
.section-title { font-family: 'Sora', sans-serif; font-size: 1.9rem; font-weight: 700; color: #1e2540; letter-spacing: -0.03em; margin: 0 0 0.5rem; }
.section-sub   { color: #8892a4; font-size: 0.95rem; margin: 0; }
 
/* ── MÓDULOS ── */
.modules-section { padding: 5rem 0; }

.modules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.25rem; }
 
.module-card {
  background: white; border: 1.5px solid #e8ecf4; border-radius: 16px;
  padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;
  animation: slideUp 0.4s ease both;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; cursor: pointer;
}
.module-card:hover { border-color: #35416e; transform: translateY(-4px); box-shadow: 0 12px 32px rgba(53,65,110,0.12); }
 
@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
 
.module-card__top { display: flex; justify-content: space-between; align-items: flex-start; }
.module-icon { font-size: 2rem; display: block; }
.module-tag  { font-size: 0.7rem; font-weight: 600; color: #35416e; background: rgba(53,65,110,0.08); padding: 0.2rem 0.6rem; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.module-title { font-family: 'Sora', sans-serif; font-size: 1.05rem; font-weight: 700; color: #1e2540; margin: 0; }
.module-desc  { font-size: 0.85rem; color: #6b7a99; line-height: 1.6; margin: 0; flex: 1; }
.module-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid #e8ecf4; }
.module-count { font-size: 0.78rem; color: #8892a4; }
.module-arrow { color: #35416e; font-size: 1rem; font-weight: 700; transition: transform 0.2s; }
.module-card:hover .module-arrow { transform: translateX(4px); }
 
/* ── FLUJO ── */
.flow-section { background: #eef1f8; padding: 5rem 0; }
 
.flow-timeline { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; position: relative; }
.flow-timeline::before { content: ''; position: absolute; top: 56px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, #35416e, #5b9bd5, #2a9d8f); opacity: 0.2; z-index: 0; }

.flow-step { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 1rem; position: relative; z-index: 1; animation: slideUp 0.4s ease both; }
.flow-step__number { font-family: 'Sora', sans-serif; font-size: 0.7rem; font-weight: 700; color: #35416e; opacity: 0.4; margin-bottom: 0.5rem; letter-spacing: 0.1em; }
.flow-step__icon   { width: 60px; height: 60px; background: white; border: 2px solid rgba(53,65,110,0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(53,65,110,0.08); transition: border-color 0.2s, transform 0.2s; }
.flow-step:hover .flow-step__icon { border-color: #35416e; transform: scale(1.08); }
.flow-step__title { font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; color: #1e2540; margin: 0 0 0.4rem; }
.flow-step__desc  { font-size: 0.78rem; color: #8892a4; line-height: 1.5; margin: 0; }
 
/* ── CTA ── */
.cta-section { position: relative; overflow: hidden; background: #35416e; padding: 5rem 0; }
.cta-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.cta-wave { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
.cta-wave--1 { width: 600px; height: 600px; bottom: -300px; right: -100px; animation: waveDrift 8s ease-in-out infinite alternate; }
.cta-wave--2 { width: 400px; height: 400px; top: -200px; left: -100px; animation: waveDrift 11s ease-in-out infinite alternate-reverse; }
 
.cta-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem; }
.cta-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.35rem 0.9rem; border-radius: 999px; font-size: 0.78rem; color: rgba(255,255,255,0.9); font-weight: 600; }
.cta-title { font-family: 'Sora', sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; color: white; letter-spacing: -0.03em; margin: 0; line-height: 1.2; }
.cta-sub   { color: rgba(255,255,255,0.65); font-size: 1rem; max-width: 420px; line-height: 1.6; margin: 0; }
</style>
 