import { useStore } from '../store.jsx'
import { Card } from '../ui.jsx'

export default function Agendamentos() {
  const { appts, reservas } = useStore()
  const th = 'border-b border-borda p-2 text-left text-[11px] uppercase text-muted'
  const td = 'border-b border-borda p-2'
  return (
    <>
      <h2 className="mb-1.5 text-base font-semibold text-azul">Meus agendamentos</h2>
      <p className="mb-4 text-sm text-muted">Todas as reservas e agendamentos registrados no sistema.</p>
      <Card>
        <table className="w-full text-sm">
          <thead><tr>{['Sala', 'Data', 'Horario', 'Solicitante', 'Justificativa'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody>{appts.map((a, i) => (
            <tr key={i}><td className={td}><b>{a.sala}</b></td><td className={td}>{a.data}</td><td className={td}>{a.inicio} - {a.fim}</td><td className={td}>{a.persona || '-'}</td><td className={td}>{a.just}</td></tr>
          ))}</tbody>
        </table>
      </Card>
      {reservas.length > 0 && (
        <Card title="Reservas imediatas">
          <table className="w-full text-sm">
            <thead><tr>{['Sala', 'Hora', 'Acesso'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody>{reservas.map((r, i) => <tr key={i}><td className={td}><b>{r.sala}</b></td><td className={td}>{r.hora}</td><td className={td}>QR Code gerado</td></tr>)}</tbody>
          </table>
        </Card>
      )}
    </>
  )
}
