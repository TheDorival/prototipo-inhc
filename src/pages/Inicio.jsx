import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import { detectConflitos } from '../data.js'
import { Kpi } from '../ui.jsx'

const FEAT = [
  { to: '/buscar', ic: '🔍', t: 'Buscar sala agora', p: 'Encontre e reserve uma sala disponivel na hora, com filtros por capacidade e equipamentos.', roles: ['professor', 'coordenador'] },
  { to: '/agendar', ic: '📅', t: 'Novo agendamento', p: 'Reserve uma sala para data e horario especificos pelo mapa do campus.', roles: ['professor', 'aluno', 'coordenador'] },
  { to: '/localizar', ic: '📍', t: 'Localizar sala', p: 'Descubra a sala atual de uma disciplina e veja a rota ate ela.', roles: ['professor', 'aluno', 'coordenador'] },
  { to: '/painel', ic: '📊', t: 'Painel de controle', p: 'Acompanhe a ocupacao em tempo real, resolva conflitos e exporte relatorios.', roles: ['coordenador'] },
]

export default function Inicio() {
  const { rooms, reservas } = useStore()
  const { profile, role } = useAuth()
  const livres = rooms.filter((r) => r.status === 'livre').length
  const cards = FEAT.filter((c) => c.roles.includes(role))
  return (
    <>
      <div className="card mb-5 p-5">
        <h2 className="text-xl font-semibold text-fg">Bem-vindo, {profile?.nome || 'usuario'}</h2>
        <p className="mt-1 text-sm text-muted">Voce esta conectado como <b className="capitalize text-fg">{role}</b>. Gerencie salas e reservas do campus em tempo real.</p>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi value={rooms.length} label="Salas cadastradas" />
        <Kpi value={livres} label="Disponiveis agora" />
        <Kpi value={reservas.length} label={role === 'coordenador' ? 'Reservas (todas)' : 'Minhas reservas'} />
        <Kpi value={role === 'coordenador' ? detectConflitos(reservas).length : '—'} label="Conflitos ativos" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card p-4 transition hover:border-accent">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-subtle text-lg">{c.ic}</span>
              <b className="text-sm font-semibold text-accent">{c.t}</b>
            </div>
            <p className="text-sm leading-relaxed text-muted">{c.p}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
