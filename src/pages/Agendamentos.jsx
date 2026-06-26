import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import { Card } from '../ui.jsx'

export default function Agendamentos() {
  const { reservas } = useStore()
  const { role } = useAuth()
  const th = 'border-b border-borda p-2 text-left text-[11px] uppercase text-muted'
  const td = 'border-b border-borda p-2'
  const agendamentos = reservas.filter((r) => r.tipo !== 'imediata')
  const imediatas = reservas.filter((r) => r.tipo === 'imediata')
  return (
    <>
      <h2 className="mb-1.5 text-base font-semibold text-azul">{role === 'coordenador' ? 'Todas as reservas' : 'Minhas reservas'}</h2>
      <p className="mb-4 text-sm text-muted">Reservas registradas no sistema e salvas na nuvem.</p>
      <Card>
        {agendamentos.length === 0 ? <div className="p-4 text-center text-sm text-muted">Nenhuma reserva ainda.</div> : (
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
