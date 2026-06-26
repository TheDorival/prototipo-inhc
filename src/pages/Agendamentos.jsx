import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import { Card, PageHead } from '../ui.jsx'

export default function Agendamentos() {
  const { reservas } = useStore()
  const { role } = useAuth()
  const th = 'border-b border-line px-2 py-2 text-left text-[11px] font-semibold uppercase text-muted'
  const td = 'border-b border-line px-2 py-2'
  const agendamentos = reservas.filter((r) => r.tipo !== 'imediata')
  const imediatas = reservas.filter((r) => r.tipo === 'imediata')
  return (
    <>
      <PageHead title={role === 'coordenador' ? 'Todas as reservas' : 'Minhas reservas'} sub="Reservas registradas no sistema e salvas na nuvem." />
      <Card>
        {agendamentos.length === 0 ? <div className="py-4 text-center text-sm text-muted">Nenhuma reserva ainda.</div> : (
          <table className="w-full text-sm">
            <thead><tr>{['Sala', 'Data', 'Horario', 'Solicitante', 'Justificativa'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody>{agendamentos.map((a) => (
              <tr key={a.rid}><td className={td}><b>{a.sala}</b></td><td className={td}>{a.data}</td><td className={td}>{a.inicio} - {a.fim}</td><td className={td}>{a.persona || '-'}</td><td className={td}>{a.just}</td></tr>
            ))}</tbody>
          </table>
        )}
      </Card>
      {imediatas.length > 0 && (
        <Card title="Reservas imediatas">
          <table className="w-full text-sm">
            <thead><tr>{['Sala', 'Data', 'Hora', 'Acesso'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody>{imediatas.map((r) => <tr key={r.rid}><td className={td}><b>{r.sala}</b></td><td className={td}>{r.data}</td><td className={td}>{r.inicio}</td><td className={td}>QR Code gerado</td></tr>)}</tbody>
          </table>
        </Card>
      )}
    </>
  )
}
