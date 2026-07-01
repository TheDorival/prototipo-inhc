import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileDown, CheckCircle2, Search, Lock, AlertTriangle } from 'lucide-react'
import { useStore } from '../store.jsx'
import { download } from '../data.js'
import { Card, Legenda, MapaSalas, PageHead } from '../ui.jsx'

export default function Agendar() {
  const { rooms, agendar } = useStore()
  const nav = useNavigate()
  const [form, setForm] = useState({ data: '2026-06-26', inicio: '14:00', fim: '16:00', cat: 'Sala de Reuniao/Estudo', just: '' })
  const [sala, setSala] = useState(null)
  const [busca, setBusca] = useState('')
  const [ok, setOk] = useState(null)
  const [erro, setErro] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return rooms
    return rooms.filter((r) => r.id.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q) || r.bloco.toLowerCase().includes(q))
  }, [rooms, busca])

  const selRoom = rooms.find((r) => r.id === sala)

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
      <PageHead title="Novo agendamento" sub="Preencha os dados a esquerda e selecione uma sala livre no mapa do campus a direita." />
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

          <div className="mt-4 border-t border-line pt-4">
            {!selRoom && !ok && <p className="text-sm text-muted">Selecione uma sala no mapa ao lado para agendar.</p>}

            {selRoom && selRoom.status === 'livre' && (
              <>
                <div className="mb-3 rounded-lg border border-line bg-subtle p-3 text-sm text-fg">Sala selecionada: <b>{selRoom.id}</b> · {selRoom.cat} · cap. {selRoom.cap}</div>
                <button onClick={confirmar} className="btn btn-primary w-full">Confirmar agendamento</button>
              </>
            )}
            {selRoom && selRoom.status === 'reservada' && (
              <div className="flex items-start gap-2 rounded-lg border border-warn/40 bg-warnbg p-3 text-sm text-fg">
                <Lock size={16} className="mt-0.5 shrink-0 text-warn" />
                <span>A sala <b>{selRoom.id}</b> esta <b>reservada</b> para outro horario e nao pode ser agendada. Selecione uma sala livre (verde).</span>
              </div>
            )}
            {selRoom && selRoom.status === 'ocupada' && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/40 bg-dangerbg p-3 text-sm text-fg">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
                <span>A sala <b>{selRoom.id}</b> esta <b>ocupada</b> no momento e nao pode ser reservada. Selecione uma sala livre (verde).</span>
              </div>
            )}
            {erro && <div className="mt-3 rounded-lg border border-danger/30 bg-dangerbg p-3 text-sm text-danger">{erro}</div>}

            {ok && (
              <>
                <div className="rounded-lg border border-green/30 bg-okbg p-3 text-sm text-okfg"><b className="mb-0.5 flex items-center gap-1.5"><CheckCircle2 size={15} /> Agendamento confirmado</b>Sala {ok.sala} reservada para {ok.data}, {ok.inicio} as {ok.fim}.</div>
                <div className="mt-3 flex gap-2.5">
                  <button onClick={baixar} className="btn"><FileDown size={15} /> Baixar comprovante</button>
                  <button onClick={() => nav('/agendamentos')} className="btn">Ver reservas</button>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card title="Mapa do campus">
          <div className="relative mb-3">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Buscar sala por nome, bloco ou categoria" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <Legenda />
          {filtradas.length === 0
            ? <div className="py-6 text-center text-sm text-muted">Nenhuma sala encontrada para "{busca}".</div>
            : <MapaSalas rooms={filtradas} onSelect={setSala} selected={sala} allowAll />}
        </Card>
      </div>
    </>
  )
}
