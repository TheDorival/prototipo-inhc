import { useState } from 'react'
import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import { Card, PageHead } from '../ui.jsx'

function ModalEditar({ reserva, onClose }) {
  const { editarReserva } = useStore()
  const [f, setF] = useState({ data: reserva.data, inicio: reserva.inicio, fim: reserva.fim, just: reserva.just || '' })
  const [erro, setErro] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const salvar = async () => {
    setErro('')
    const r = await editarReserva(reserva, f)
    if (r.ok) onClose(); else setErro(r.erro)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 text-base font-semibold text-fg">Editar reserva — {reserva.sala}</h3>
        <label className="lbl">Data</label>
        <input type="date" className="input" value={f.data} onChange={set('data')} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div><label className="lbl">Inicio</label><input type="time" className="input" value={f.inicio} onChange={set('inicio')} /></div>
          <div><label className="lbl">Termino</label><input type="time" className="input" value={f.fim} onChange={set('fim')} /></div>
        </div>
        <label className="lbl mt-3">Justificativa</label>
        <input className="input" value={f.just} onChange={set('just')} />
        {erro && <div className="mt-3 rounded-lg border border-danger/30 bg-dangerbg p-2.5 text-sm text-danger">{erro}</div>}
        <div className="mt-4 flex justify-end gap-2.5">
          <button onClick={onClose} className="btn">Cancelar</button>
          <button onClick={salvar} className="btn btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  )
}

export default function Agendamentos() {
  const { reservas, cancelarReserva } = useStore()
  const { role } = useAuth()
  const [editando, setEditando] = useState(null)
  const th = 'border-b border-line px-3 py-2.5 text-left text-[11px] font-semibold uppercase text-muted'
  const td = 'border-b border-line px-3 py-2.5'
  const lista = [...reservas].sort((a, b) => (a.data + a.inicio).localeCompare(b.data + b.inicio))

  const cancelar = (r) => { if (window.confirm(`Cancelar a reserva de ${r.sala} (${r.data} ${r.inicio})?`)) cancelarReserva(r) }

  return (
    <>
      <PageHead title={role === 'coordenador' ? 'Todas as reservas' : 'Minhas reservas'} sub="Gerencie suas reservas: editar horario ou cancelar (a sala e liberada)." />
      <Card>
        {lista.length === 0 ? <div className="py-6 text-center text-sm text-muted">Nenhuma reserva ainda.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>{['Sala', 'Data', 'Horario', 'Tipo', 'Solicitante', 'Justificativa', 'Acoes'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody>{lista.map((a) => (
                <tr key={a.rid}>
                  <td className={td}><b>{a.sala}</b></td>
                  <td className={td}>{a.data}</td>
                  <td className={td}>{a.inicio} - {a.fim}</td>
                  <td className={td}>{a.tipo === 'imediata' ? 'Imediata' : 'Agendamento'}</td>
                  <td className={td}>{a.persona || '-'}</td>
                  <td className={td}>{a.just}</td>
                  <td className={td}>
                    <div className="flex gap-2">
                      <button onClick={() => setEditando(a)} className="text-xs font-semibold text-accent hover:underline">Editar</button>
                      <button onClick={() => cancelar(a)} className="text-xs font-semibold text-danger hover:underline">Cancelar</button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
      {editando && <ModalEditar reserva={editando} onClose={() => setEditando(null)} />}
    </>
  )
}
