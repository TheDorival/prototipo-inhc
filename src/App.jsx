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

const ALL = ['professor', 'aluno', 'coordenador']
const NAV = [
  { to: '/', label: 'Inicio', end: true, roles: ALL },
  { g: 'Operacoes' },
  { to: '/buscar', label: 'Buscar sala', roles: ['professor', 'coordenador'] },
  { to: '/agendar', label: 'Novo agendamento', roles: ALL },
  { to: '/localizar', label: 'Localizar sala', roles: ALL },
  { to: '/mapa', label: 'Mapa do campus', roles: ALL },
  { g: 'Gestao' },
  { to: '/agendamentos', label: 'Minhas reservas', roles: ALL },
  { to: '/painel', label: 'Painel de controle', roles: ['coordenador'] },
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

function Shell() {
  const { profile, role, sair } = useAuth()
  const itens = NAV.filter((n) => n.g || n.roles.includes(role))
  return (
    <div className="min-h-screen bg-subtle">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-black/20 bg-header px-5 text-headerfg">
        <div className="flex items-baseline gap-2">
          <b className="text-base font-semibold tracking-wide text-white">GEIE</b>
          <span className="hidden text-xs text-headerfg/70 sm:inline">Gestao de Espacos e Infraestrutura Escolar</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs leading-tight">
            <b className="block text-white">{profile?.nome}</b>
            <span className="capitalize text-headerfg/70">{role}</span>
          </div>
          <button onClick={sair} className="rounded-md border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">Sair</button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-64 shrink-0 border-r border-line bg-canvas py-4 md:block">
          <nav className="flex flex-col gap-0.5 px-2">
            {itens.map((n, i) => n.g ? (
              <div key={i} className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">{n.g}</div>
            ) : (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => 'rounded-md px-3 py-1.5 text-sm ' + (isActive ? 'bg-subtle font-semibold text-fg' : 'text-muted hover:bg-subtle hover:text-fg')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-h-[calc(100vh-56px)] flex-1 bg-subtle px-8 py-6">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/buscar" element={<Guard path="/buscar"><Buscar /></Guard>} />
              <Route path="/agendar" element={<Agendar />} />
              <Route path="/localizar" element={<Localizar />} />
              <Route path="/painel" element={<Guard path="/painel"><Painel /></Guard>} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
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
