import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './store.jsx'
import Inicio from './pages/Inicio.jsx'
import Buscar from './pages/Buscar.jsx'
import Agendar from './pages/Agendar.jsx'
import Localizar from './pages/Localizar.jsx'
import Painel from './pages/Painel.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Mapa from './pages/Mapa.jsx'

const NAV = [
  { to: '/', label: 'Inicio', ic: '■', end: true },
  { g: 'Cenarios' },
  { to: '/buscar', label: 'Buscar Sala Agora', ic: '🔍' },
  { to: '/agendar', label: 'Novo Agendamento', ic: '📅' },
  { to: '/localizar', label: 'Buscar Salas Ocupadas', ic: '📍' },
  { to: '/painel', label: 'Painel de Controle', ic: '📊' },
  { g: 'Geral' },
  { to: '/agendamentos', label: 'Meus Agendamentos', ic: '📋' },
  { to: '/mapa', label: 'Mapa do Campus', ic: '🗺' },
]

const META = {
  '/': { t: 'Inicio', p: '' },
  '/buscar': { t: 'Buscar Sala Agora', p: 'Cenario 1 · Augusto Carlos, 42 · Professor de Fisica' },
  '/agendar': { t: 'Novo Agendamento', p: 'Cenario 2 · Ana Lima, 22 · Coord. de extensao' },
  '/localizar': { t: 'Buscar Salas Ocupadas', p: 'Cenario 4 · Gabriela Ciresi, 19 · Discente de SI' },
  '/painel': { t: 'Painel de Controle', p: 'Cenario 3 · Marcos Ramos, 51 · Coord. administrativo' },
  '/agendamentos': { t: 'Meus Agendamentos', p: '' },
  '/mapa': { t: 'Mapa do Campus', p: '' },
}

export default function App() {
  const { pathname } = useLocation()
  const meta = META[pathname] || META['/']
  return (
    <StoreProvider>
      <div className="flex">
        <aside className="fixed left-0 top-0 flex min-h-screen w-60 flex-col bg-azul py-4.5 py-5 text-white">
          <div className="mb-2.5 border-b border-white/15 px-5 pb-4">
            <b className="text-lg tracking-wide">GEIE</b>
            <small className="mt-0.5 block text-[11px] opacity-80">Gestao de Espacos e Infraestrutura Escolar</small>
          </div>
          <nav className="flex flex-col">
            {NAV.map((n, i) => n.g ? (
              <div key={i} className="px-5 pb-1.5 pt-3.5 text-[10px] uppercase tracking-wider opacity-60">{n.g}</div>
            ) : (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => 'flex items-center gap-3 border-l-[3px] px-5 py-2.5 text-sm ' + (isActive ? 'border-white bg-white/15 font-semibold text-white' : 'border-transparent text-[#dbe6f6] hover:bg-white/10')}>
                <span className="w-5 text-center text-[15px]">{n.ic}</span>{n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto px-5 pt-3.5 text-[10px] opacity-60">Prototipo de apresentacao<br />IFAL · IHC · 2026</div>
        </aside>

        <div className="ml-60 min-h-screen flex-1">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-borda bg-white px-7 py-3.5">
            <h1 className="text-lg font-semibold text-azul">{meta.t}</h1>
            <div className="text-right text-xs text-muted">{meta.p}</div>
          </div>
          <main className="max-w-5xl p-7">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/agendar" element={<Agendar />} />
              <Route path="/localizar" element={<Localizar />} />
              <Route path="/painel" element={<Painel />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/mapa" element={<Mapa />} />
            </Routes>
          </main>
        </div>
      </div>
    </StoreProvider>
  )
}
