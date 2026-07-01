import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { download } from '../data.js'
import { Card, Legenda, MapaSalas, PageHead } from '../ui.jsx'

export default function Agendar() {
  const { rooms, agendar } = useStore()
  const nav = useNavigate()
  const [form, setForm] = useState({ data: '2026-06-26', inicio: '14:00', fim: '16:00', cat: 'Sala de Reuniao/Estudo', just: '' })
  const [sala, setSala] = useState(null)
  const [ok, setOk] = useState(null)
  const [erro, setErro] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const confirmar = async () => {
    setErro('')
    const res = await agendar({ sala, data: form.data, inicio: form.inicio, fim: form.fim, just: form.just || 'Agendamento' })
    if (!res.ok) { setErro(res.erro); return }
    setOk({ sala, ...form }); setSala(null)
  }
  const baixar = () => download('comprovante_agendamento.txt',
    `COMPROVANTE DE AGENDAMENTO - GEIE\nSala: ${ok.sala}\nData: ${ok.data}\nHorario: ${ok.inicio} as ${ok.fim}\nJustificativa: ${ok.just || 'Agendamento'}\nStatus: CONFIRMADO`)

  return (
    <>
      <PageHead title="Novo agendamento" sub="Escolha data, horario e categoria, depois selecione uma sala livre no mapa do campus." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Dados da reserva">
          <label className="lbl">Data</label>
          <input type="date" className="input" value={form.data} onChange={set('data')} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div><label className="lbl">Inicio</label><input type="time" className="input" value={form.inicio} onChange={set('inicio')} /></div>
            <div><label className="lbl">Termino</label><input type="time" className="input" value={form.fim} onChange={set('fim')} /></div>
          </div>
          <label className="lbl mt-3">Categoria</label>
          <select className="input" value={form.cat} onChange={set('cat')}>
            <option>Sala de Reuniao/Estudo</option><option>Sala de aula</option><option>Laboratorio</option><option>Auditorio</option>
          </select>
          <label className="lbl mt-3">Justificativa</label>
          <input className="input" placeholder="Motivo da reserva" value={form.just} onChange={set('just')} />
        </Card>
        <Card title="Mapa do campus">
          <Legenda />
          <MapaSalas rooms={rooms} onSelect={setSala} selected={sala} />
          <div className="mt-4">
            <button disabled={!sala} onClick={confirmar} className="btn btn-primary">Confirmar agendamento</button>
          </div>
          {erro && <div className="mt-3 rounded-lg border border-danger/30 bg-dangerbg p-3 text-sm text-danger">{erro}</div>}
          {ok && (
            <>
              <div className="mt-3 rounded-md border border-[#1f883d]/30 bg-okbg p-3 text-sm text-okfg"><b className="block">✓ Agendamento confirmado</b>Sala {ok.sala} reservada para {ok.data}, {ok.inicio} as {ok.fim}.</div>
              <div className="mt-3 flex gap-2.5">
                <button onClick={baixar} className="btn">📄 Baixar comprovante</button>
                <button onClick={() => nav('/agendamentos')} className="btn">Ver reservas</button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
