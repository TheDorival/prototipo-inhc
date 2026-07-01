import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Check } from 'lucide-react'
import { useStore } from '../store.jsx'
import { Card, Tag, PageHead } from '../ui.jsx'

const FILTROS = [
  { f: 'cap', label: 'Capacidade 40+', on: true },
  { f: 'Projetor', label: 'Projetor', on: true },
  { f: 'Tomada', label: 'Tomada', on: false },
  { f: 'Ar-condicionado', label: 'Ar-condicionado', on: false },
]
const padrao = () => Object.fromEntries(FILTROS.map((x) => [x.f, x.on]))

export default function Buscar() {
  const { rooms, reservarAgora } = useStore()
  const nav = useNavigate()
  const [sel, setSel] = useState(padrao)
  const [applied, setApplied] = useState(padrao)
  const [reservada, setReservada] = useState(null)

  const res = useMemo(() => {
    const cap = applied.cap
    const equip = FILTROS.filter((x) => x.f !== 'cap' && applied[x.f]).map((x) => x.f)
    return rooms.filter((r) => r.status === 'livre' && (!cap || r.cap >= 40) && equip.every((e) => r.equip.includes(e)))
  }, [rooms, applied])

  const buscar = () => { setApplied({ ...sel }); setReservada(null) }
  const reservar = async (id) => { const r = await reservarAgora(id); if (r.ok) setReservada({ id, hora: r.hora }) }

  return (
    <>
      <PageHead title="Buscar sala disponivel" sub="Filtre por capacidade e equipamentos e reserve uma sala livre imediatamente." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card title="Filtros">
            <p className="mb-3 flex items-center gap-1.5 text-xs text-muted"><Check size={14} className="text-green" /> Mostrando apenas salas livres agora.</p>
            <div className="mt-1">
              {FILTROS.map((x) => (
                <button key={x.f} onClick={() => setSel((s) => ({ ...s, [x.f]: !s[x.f] }))}
                  className={'mr-1.5 mt-1.5 rounded-full border px-3 py-1 text-xs font-semibold ' + (sel[x.f] ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-canvas text-fg hover:bg-subtle')}>{x.label}</button>
              ))}
            </div>
            <div className="mt-4"><button onClick={buscar} className="btn btn-primary w-full">Buscar agora</button></div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {reservada ? (
            <Card title="Reserva confirmada">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-okbg text-okfg"><CheckCircle2 size={30} /></div>
                <p className="max-w-md text-sm text-muted">Reserva de <b className="text-fg">{reservada.id}</b> aprovada. A seguranca foi notificada para liberar a porta. Use o QR Code para acessar a sala.</p>
                <div className="my-4 h-36 w-36 rounded border-[8px] border-fg" style={{ background: 'conic-gradient(#000 25%,#fff 0 50%,#000 0 75%,#fff 0)' }} />
                <p className="text-sm text-muted">{reservada.id} · valido a partir das {reservada.hora}</p>
                <div className="mt-4 flex gap-2.5">
                  <button onClick={() => nav('/painel')} className="btn">Ver no painel</button>
                  <button onClick={() => setReservada(null)} className="btn btn-primary">Nova busca</button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title={res.length + ' sala(s) disponivel(is)'}>
              {rooms.length === 0 && <div className="py-6 text-center text-sm text-muted">Carregando salas...</div>}
              {rooms.length > 0 && res.length === 0 && <div className="py-6 text-center text-sm text-muted">Nenhuma sala livre com esses filtros. Ajuste os filtros e busque novamente.</div>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {res.map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-3">
                    <div className="min-w-0">
                      <b className="text-sm font-semibold">{r.id} <Tag status="livre" /></b>
                      <small className="mt-0.5 block text-xs text-muted">{r.cat} · Bloco {r.bloco} · cap. {r.cap}</small>
                      <div className="mt-1 truncate text-[11px] text-muted">{r.equip.join(' · ')}</div>
                    </div>
                    <button onClick={() => reservar(r.id)} className="btn btn-primary shrink-0">Reservar</button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
