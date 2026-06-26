import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { download } from '../data.js'
import { Card, Legenda, MapaSalas } from '../ui.jsx'

export default function Agendar() {
  const { rooms, agendar } = useStore()
  const nav = useNavigate()
  const [form, setForm] = useState({ data: '2026-06-26', inicio: '14:00', fim: '16:00', cat: 'Sala de Reuniao/Estudo', just: 'Reuniao do projeto de extensao' })
  const [sala, setSala] = useState(null)
  const [ok, setOk] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const confirmar = async () => {
    await agendar({ sala, data: form.data, inicio: form.inicio, fim: form.fim, just: form.just })
    setOk({ sala, ...form }); setSala(null)
  }
  const baixar = () => download('comprovante_agendamento.txt',
    `COMPROVANTE DE AGENDAMENTO - GEIE\nSala: ${ok.sala}\nData: ${ok.data}\nHorario: ${ok.inicio} as ${ok.fim}\nSolicitante: Ana Lima\nJustificativa: ${ok.just}\nStatus: CONFIRMADO`)

  const inp = 'w-full rounded-lg border border-borda px-3 py-2 text-sm'
  return (
    <>
      <h2 className="mb-1.5 text-base font-semibold text-azul">Agendamento agil</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted">Reserve uma sala para a reuniao do seu projeto sem trocar e-mails com a secretaria. Escolha data, horario e categoria, depois selecione uma sala livre no mapa.</p>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Dados da reserva">
          <label className="mb-1 mt-3 block text-xs text-muted">Data</label>
          <input type="date" className={inp} value={form.data} onChange={set('data')} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 mt-3 block text-xs text-muted">Inicio</label><input type="time" className={inp} value={form.inicio} onChange={set('inicio')} /></div>
            <div><label className="mb-1 mt-3 block text-xs text-muted">Termino</label><input type="time" className={inp} value={form.fim} onChange={set('fim')} /></div>
          </div>
          <label className="mb-1 mt-3 block text-xs text-muted">Categoria</label>
          <select className={inp} value={form.cat} onChange={set('cat')}>
            <option>Sala de Reuniao/Estudo</option><option>Sala de aula</option><option>Laboratorio</option><option>Auditorio</option>
          </select>
          <label className="mb-1 mt-3 block text-xs text-muted">Justificativa</label>
          <input className={inp} value={form.just} onChange={set('just')} />
        </Card>
        <Card title="Mapa do campus">
          <Legenda />
          <MapaSalas rooms={rooms} onSelect={setSala} selected={sala} />
          <div className="mt-4">
            <button disabled={!sala} onClick={confirmar} className="rounded-lg bg-verde px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Confirmar agendamento</button>
          </div>
          {ok && (
            <>
              <div className="mt-3.5 rounded-lg border border-verde bg-verdebg p-3.5 text-sm text-verde"><b className="block">✓ Agendamento confirmado</b>Sala {ok.sala} reservada para {ok.data}, {ok.inicio} as {ok.fim}.</div>
              <div className="mt-3 flex gap-2.5">
                <button onClick={baixar} className="rounded-lg bg-azulc px-3 py-2 text-xs font-semibold text-azul">📄 Baixar comprovante (.txt)</button>
                <button onClick={() => nav('/agendamentos')} className="rounded-lg bg-azulc px-3 py-2 text-xs font-semibold text-azul">Ver agendamentos</button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
