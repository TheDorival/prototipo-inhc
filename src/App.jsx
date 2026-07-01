import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth.jsx'
import { StoreProvider } from './store.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Inicio from './pages/Inicio.jsx'
import Buscar from './pages/Buscar.jsx'
import Agendar from './pages/Agendar.jsx'
import Localizar from './pages/Localizar.jsx'
import Painel from './pages/Painel.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Mapa from './pages/Mapa.jsx'
import AdminSalas from './pages/AdminSalas.jsx'

const ALL = ['professor', 'aluno', 'coordenador']
const NAV = [
  { to: '/', label: 'Inicio', ic: '◧', end: true, roles: ALL },
  { g: 'Operacoes' },
  { to: '/buscar', label: 'Buscar sala', ic: '🔍', roles: ['professor', 'coordenador'] },
  { to: '/agendar', label: 'Novo agendamento', ic: '🗓', roles: ALL },
  { to: '/localizar', label: 'Localizar sala', ic: '📍', roles: ALL },
  { to: '/mapa', label: 'Mapa do campus', ic: '🗺', roles: ALL },
  { g: 'Gestao' },
  { to: '/agendamentos', label: 'Minhas reservas', ic: '📋', roles: ALL },
  { to: '/painel', label: 'Painel de controle', ic: '📊', roles: ['coordenador'] },
  { to: '/admin', label: 'Salas (admin)', ic: '🏫', roles: ['coordenador'] },
]
const ACCESS = {
  '/': ALL, '/buscar': ['professor', 'coordenador'], '/agendar': ALL,
  '/localizar': ALL, '/painel': ['coordenador'], '/agendamentos': ALL, '/mapa': ALL,
}

function Guard({ path, children }) {
  const { role } = useAuth()
  if (role && !ACCESS[path].includes(role)) return <Navigate to="/" replace />
  return children
}

const iniciais = (nome = '') => nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'

function Shell() {
  const { profile, role, sair } = useAuth()
  const itens = NAV.filter((n) => n.g || n.roles.includes(role))
  return (
    <div className="min-h-screen bg-subtle">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-line bg-white md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">GE</span>
          <div className="leading-tight">
            <b className="block text-sm font-bold text-fg">GEIE</b>
            <span className="text-[11px] text-muted">Gestao de Espacos</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
          {itens.map((n, i) => n.g ? (
            <div key={i} className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted/70">{n.g}</div>
          ) : (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ' + (isActive ? 'bg-accentsoft font-semibold text-accent' : 'text-muted hover:bg-subtle hover:text-fg')}>
              <span className="w-4 text-center text-[13px]">{n.ic}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accentsoft text-xs font-bold text-accent">{iniciais(profile?.nome)}</span>
            <div className="min-w-0 flex-1 leading-tight">
              <b className="block truncate text-sm text-fg">{profile?.nome}</b>
              <span className="text-[11px] capitalize text-muted">{role}</span>
            </div>
          </div>
          <button onClick={sair} className="btn mt-2 w-full">Sair</button>
        </div>
      </aside>

      <main className="md:ml-64">
        <div className="mx-auto max-w-[1500px] px-6 py-8 sm:px-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/buscar" element={<Guard path="/buscar"><Buscar /></Guard>} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/localizar" element={<Localizar />} />
            <Route path="/painel" element={<Guard path="/painel"><Painel /></Guard>} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/admin" element={<Guard path="/admin"><AdminSalas /></Guard>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function Roteador() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Carregando...</div>
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }
  return <StoreProvider><Shell /></StoreProvider>
}

export default function App() {
  return <AuthProvider><Roteador /></AuthProvider>
}
