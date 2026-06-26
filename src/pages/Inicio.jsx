import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import { detectConflitos } from '../data.js'
import { Kpi } from '../ui.jsx'

const CEN = [
  { to: '/buscar', ic: '🔍', t: 'Buscar Sala Agora', who: 'Augusto, 42 · Professor', p: 'Ache e reserve uma sala com projetor em minutos, com QR Code de acesso.', roles: ['professor', 'coordenador'] },
  { to: '/agendar', ic: '📅', t: 'Novo Agendamento', who: 'Ana, 22 · Coord. de extensao', p: 'Reserve uma sala pelo mapa visual do campus, sem depender de e-mail.', roles: ['professor', 'aluno', 'coordenador'] },
  { to: '/localizar', ic: '📍', t: 'Buscar Salas Ocupadas', who: 'Gabriela, 19 · Discente', p: 'Descubra para qual sala a aula foi realocada e veja a rota ate ela.', roles: ['professor', 'aluno', 'coordenador'] },
  { to: '/painel', ic: '📊', t: 'Painel de Controle', who: 'Marcos, 51 · Coordenador', p: 'Monitore ocupacao, resolva conflitos e exporte o relatorio de ociosidade.', roles: ['coordenador'] },
]

export default function Inicio() {
  const { rooms, reservas } = useStore()
  const { profile, role } = useAuth()
  const livres = rooms.filter((r) => r.status === 'livre').length
  const cards = CEN.filter((c) => c.roles.includes(role))
  return (
    <>
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-azul to-azul2 p-7 text-white">
        <h2 className="mb-2 text-xl font-semibold">Ola, {profile?.nome || 'usuario'}</h2>
        <p className="max-w-2xl text-sm opacity-90">Voce esta logado como <b className="capitalize">{role}</b>. Gerencie salas e reservas em tempo real. As acoes se conectam entre as telas e ficam salvas na nuvem.</p>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <Kpi value={rooms.length} label="Salas cadastradas" />
        <Kpi value={livres} label="Disponiveis agora" />
        <Kpi value={reservas.length} label={role === 'coordenador' ? 'Reservas (todas)' : 'Minhas reservas'} />
        <Kpi value={role === 'coordenador' ? detectConflitos(reservas).length : '-'} label="Conflitos ativos" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-xl border border-borda bg-white p-5 transition hover:-translate-y-0.5 hover:border-azul2 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-azulc text-xl">{c.ic}</div>
            <b className="block text-sm text-azul">{c.t}</b>
            <div className="my-1 text-xs text-muted">{c.who}</div>
            <p className="text-xs leading-relaxed text-muted">{c.p}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
