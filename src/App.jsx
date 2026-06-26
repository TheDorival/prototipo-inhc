import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
  { to: '/', label: 'Inicio', ic: '■', end: true, roles: ALL },
  { g: 'Cenarios' },
  { to: '/buscar', label: 'Buscar Sala Agora', ic: '🔍', roles: ['professor', 'coordenador'] },
  { to: '/agendar', label: 'Novo Agendamento', ic: '📅', roles: ALL },
  { to: '/localizar', label: 'Buscar Salas Ocupadas', ic: '📍', roles: ALL },
  { to: '/painel', label: 'Painel de Controle', ic: '📊', roles: ['coordenador'] },
  { g: 'Geral' },
  { to: '/agendamentos', label: 'Minhas Reservas', ic: '📋', roles: ALL },
  { to: '/mapa', label: 'Mapa do Campus', ic: '🗺', roles: ALL },
]
const META = {
  '/': { t: 'Inicio', p: '' },
  '/buscar': { t: 'Buscar Sala Agora', p: 'Cenario 1 · Augusto Carlos · Professor' },
  '/agendar': { t: 'Novo Agendamento', p: 'Cenario 2 · Ana Lima · Coord. de extensao' },
  '/localizar': { t: 'Buscar Salas Ocupadas', p: 'Cenario 4 · Gabriela Ciresi · Discente' },
  '/painel': { t: 'Painel de Controle', p: 'Cenario 3 · Marcos Ramos · Coordenador' },
  '/agendamentos': { t: 'Minhas Reservas', p: '' },
  '/mapa': { t: 'Mapa do Campus', p: '' },
}
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
  const { pathname } = useLocation()
  const { profile, role, sair } = useAuth()
  const meta = META[pathname] || META['/']
  const itens = NAV.filter((n) => n.g || n.roles.includes(role))
  return (
    <div className="flex">
      <aside className="fixed left-0 top-0 flex min-h-screen w-60 flex-col bg-azul py-5 text-white">
        <div className="mb-2.5 border-b border-white/15 px-5 pb-4">
          <b className="text-lg tracking-wide">GEIE</b>
          <small className="mt-0.5 block text-[11px] opacity-80">Gestao de Espacos e Infraestrutura Escolar</small>
        </div>
        <nav className="flex flex-col">
          {itens.map((n, i) => n.g ? (
            <div key={i} className="px-5 pb-1.5 pt-3.5 text-[10px] uppercase tracking-wider opacity-60">{n.g}</div>
          ) : (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => 'flex items-center gap-3 border-l-[3px] px-5 py-2.5 text-sm ' + (isActive ? 'border-white bg-white/15 font-semibold text-white' : 'border-transparent text-[#dbe6f6] hover:bg-white/10')}>
              <span className="w-5 text-center text-[15px]">{n.ic}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-5 pt-4">
          <div className="mb-2 text-[11px] text-[#dbe6f6]"><b className="block text-white">{profile?.nome}</b><span className="capitalize opacity-80">{role}</span></div>
          <button onClick={sair} className="w-full rounded-lg border border-white/25 py-2 text-xs font-semibold text-white hover:bg-white/10">Sair</button>
        </div>
      </aside>

      <div className="ml-60 min-h-screen flex-1">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-borda bg-white px-7 py-3.5">
          <h1 className="text-lg font-semibold text-azul">{meta.t}</h1>
          <div className="text-right text-xs text-muted">{meta.p}</div>
        </div>
        <main className="mx-auto max-w-[1500px] p-7">
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
