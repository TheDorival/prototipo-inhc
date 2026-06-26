import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { detectConflitos } from '../data.js'
import { Kpi } from '../ui.jsx'

const cenarios = [
  { to: '/buscar', ic: '🔍', t: 'Buscar Sala Agora', who: 'Augusto, 42 · Professor de Fisica', p: 'Imprevisto em sala: ache e reserve uma sala com projetor em minutos, com QR Code de acesso.' },
  { to: '/agendar', ic: '📅', t: 'Novo Agendamento', who: 'Ana, 22 · Coord. de extensao', p: 'Reserve uma sala de reuniao pelo mapa visual do campus, sem depender de e-mail.' },
  { to: '/localizar', ic: '📍', t: 'Buscar Salas Ocupadas', who: 'Gabriela, 19 · Discente de SI', p: 'Descubra para qual sala a aula foi realocada e veja a rota ate ela.' },
  { to: '/painel', ic: '📊', t: 'Painel de Controle', who: 'Marcos, 51 · Coord. administrativo', p: 'Monitore ocupacao em tempo real, resolva conflitos e exporte o relatorio de ociosidade.' },
]

export default function Inicio() {
  const { rooms, appts } = useStore()
  const livres = rooms.filter((r) => r.status === 'livre').length
  return (
    <>
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-azul to-azul2 p-7 text-white">
        <h2 className="mb-2 text-xl font-semibold">Bem-vindo ao GEIE</h2>
        <p className="max-w-2xl text-sm opacity-90">Sistema de gestao de espacos e infraestrutura escolar. Encontre, reserve e monitore salas em tempo real. As acoes se conectam entre as telas: uma reserva aparece no mapa e no painel administrativo.</p>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <Kpi value={rooms.length} label="Salas cadastradas" />
        <Kpi value={livres} label="Disponiveis agora" />
        <Kpi value={appts.length} label="Agendamentos" />
        <Kpi value={detectConflitos(appts).length} label="Conflitos ativos" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cenarios.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-xl border border-borda bg-white p-4.5 p-5 transition hover:-translate-y-0.5 hover:border-azul2 hover:shadow-md">
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
