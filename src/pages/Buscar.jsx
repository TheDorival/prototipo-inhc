import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
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
  const { rooms } = useStore()
  const nav = useNavigate()
  const [sel, setSel] = useState(padrao)
  const [applied, setApplied] = useState(padrao)

  const res = useMemo(() => {
    const cap = applied.cap
    const equip = FILTROS.filter((x) => x.f !== 'cap' && applied[x.f]).map((x) => x.f)
    return rooms.filter((r) => r.status === 'livre' && (!cap || r.cap >= 40) && equip.every((e) => r.equip.includes(e)))
  }, [rooms, applied])

  const buscar = () => setApplied({ ...sel })
  const reservar = (id) => nav('/agendar', { state: { sala: id } })

  return (
    <>
      <PageHead title="Buscar sala disponivel" sub="Filtre por capacidade e equipamentos e reserve uma sala livre no novo agendamento." />
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
        </div>
      </div>
    </>
  )
}
