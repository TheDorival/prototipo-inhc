import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileDown, CheckCircle2, Search, Lock, AlertTriangle, Users,
  Projector, Plug, Snowflake, Monitor, Presentation,
} from 'lucide-react'
import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import { download, CATEGORIA_ALUNO } from '../data.js'
import { Card, Legenda, MapaSalas, PageHead, Tag } from '../ui.jsx'

const EQUIP_ICON = {
  'Projetor': Projector,
  'Tomada': Plug,
  'Ar-condicionado': Snowflake,
  'Computadores': Monitor,
  'Quadro': Presentation,
}

const hoje = () => new Date().toISOString().slice(0, 10)

function ModalConfirmar({ sala, form, onClose, onConfirmado }) {
  const { agendar } = useStore()
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const confirmar = async () => {
    setErro(''); setEnviando(true)
    const res = await agendar({ sala, data: form.data, inicio: form.inicio, fim: form.fim, just: form.just || 'Agendamento' })
    setEnviando(false)
    if (!res.ok) { setErro(res.erro); return }
    onConfirmado()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={enviando ? undefined : onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-sm rounded-xl border border-line bg-canvas p-5 shadow-lg" onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }}>
        <h3 className="mb-3 text-base font-semibold text-fg">Confirmar agendamento</h3>
        <div className="space-y-1.5 rounded-lg border border-line bg-subtle p-3 text-sm">
          <div className="flex justify-between"><span className="text-muted">Sala</span><b className="text-fg">{sala}</b></div>
          <div className="flex justify-between"><span className="text-muted">Data</span><b className="text-fg">{form.data}</b></div>
          <div className="flex justify-between"><span className="text-muted">Horario</span><b className="text-fg">{form.inicio} - {form.fim}</b></div>
          <div className="flex justify-between gap-4"><span className="shrink-0 text-muted">Justificativa</span><b className="text-right text-fg">{form.just || 'Agendamento'}</b></div>
        </div>
        {erro && <div className="mt-3 rounded-lg border border-danger/30 bg-dangerbg p-2.5 text-sm text-danger">{erro}</div>}
        <div className="mt-4 flex justify-end gap-2.5">
          <button onClick={onClose} className="btn" disabled={enviando}>Cancelar</button>
          <button onClick={confirmar} className="btn btn-primary" disabled={enviando}>{enviando ? 'Confirmando...' : 'Confirmar'}</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Agendar() {
  const { rooms } = useStore()
  const { role } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ data: hoje(), inicio: '14:00', fim: '16:00', cat: 'Sala de Reuniao/Estudo', just: '' })
  const [sala, setSala] = useState(location.state?.sala ?? null)
  const [busca, setBusca] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [ok, setOk] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const roomsPermitidas = useMemo(() => (
    role === 'aluno' ? rooms.filter((r) => r.cat === CATEGORIA_ALUNO) : rooms
  ), [rooms, role])

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return roomsPermitidas
    return roomsPermitidas.filter((r) => r.id.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q) || r.bloco.toLowerCase().includes(q))
  }, [roomsPermitidas, busca])

  const selRoom = roomsPermitidas.find((r) => r.id === sala)

  const confirmado = () => { setOk({ sala, ...form }); setSala(null); setConfirmando(false) }
  const baixar = () => download('comprovante_agendamento.txt',
    `COMPROVANTE DE AGENDAMENTO - GEIE\nSala: ${ok.sala}\nData: ${ok.data}\nHorario: ${ok.inicio} as ${ok.fim}\nJustificativa: ${ok.just || 'Agendamento'}\nStatus: CONFIRMADO`)

  return (
    <>
      <PageHead title="Novo agendamento" sub="Preencha os dados a esquerda e selecione uma sala livre no mapa do campus a direita." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Dados da reserva">
          <label className="lbl">Data</label>
          <input type="date" className="input" min={hoje()} value={form.data} onChange={set('data')} />
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
            {!selRoom && !ok && <p className="text-sm text-muted">Selecione uma sala no mapa ao lado para ver os detalhes e agendar.</p>}

            {selRoom && (
              <div className="mb-3 rounded-lg border border-line bg-subtle p-3">
                <div className="flex items-center justify-between">
                  <b className="text-base text-fg">{selRoom.id}</b>
                  <Tag status={selRoom.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span>{selRoom.cat}</span>
                  <span>Bloco {selRoom.bloco}</span>
                  <span className="flex items-center gap-1"><Users size={13} /> {selRoom.cap} lugares</span>
                </div>
                <div className="mt-2.5">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Equipamentos</div>
                  {(!selRoom.equip || selRoom.equip.length === 0)
                    ? <span className="text-xs text-muted">Nenhum equipamento cadastrado.</span>
                    : (
                      <div className="flex flex-wrap gap-1.5">
                        {selRoom.equip.map((e) => {
                          const Ic = EQUIP_ICON[e]
                          return <span key={e} className="flex items-center gap-1 rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-fg">{Ic && <Ic size={12} className="text-accent" />} {e}</span>
                        })}
                      </div>
                    )}
                </div>
              </div>
            )}

            {selRoom && selRoom.status === 'livre' && (
              <button onClick={() => setConfirmando(true)} className="btn btn-primary w-full">Confirmar agendamento</button>
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
          {role === 'aluno' && (
            <p className="mb-3 text-xs text-muted">Como aluno, apenas salas de reuniao/estudo estao disponiveis para reserva.</p>
          )}
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

      <AnimatePresence>
        {confirmando && selRoom && (
          <ModalConfirmar sala={selRoom.id} form={form} onClose={() => setConfirmando(false)} onConfirmado={confirmado} />
        )}
      </AnimatePresence>
    </>
  )
}
