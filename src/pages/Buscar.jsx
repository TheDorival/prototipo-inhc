import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { Card, Tag, PageHead } from '../ui.jsx'

const FILTROS = [
  { f: 'cap', label: 'Capacidade 40+', on: true },
  { f: 'Projetor', label: 'Projetor', on: true },
  { f: 'Tomada', label: 'Tomada', on: false },
  { f: 'Ar-condicionado', label: 'Ar-condicionado', on: false },
]

export default function Buscar() {
  const { rooms, reservarAgora } = useStore()
  const nav = useNavigate()
  const [sel, setSel] = useState(() => Object.fromEntries(FILTROS.map((x) => [x.f, x.on])))
  const [res, setRes] = useState(null)
  const [reservada, setReservada] = useState(null)

  const buscar = () => {
    const cap = sel.cap
    const equip = FILTROS.filter((x) => x.f !== 'cap' && sel[x.f]).map((x) => x.f)
    setRes(rooms.filter((r) => r.status === 'livre' && (!cap || r.cap >= 40) && equip.every((e) => r.equip.includes(e))))
    setReservada(null)
  }
  const reservar = async (id) => { const hora = await reservarAgora(id); setReservada({ id, hora }) }

  return (
    <>
      <PageHead title="Buscar sala disponivel" sub="Filtre por capacidade e equipamentos e reserve uma sala livre imediatamente." />
      <Card title="Filtros">
        <span className="mr-1.5 inline-block rounded-full border border-[#1f883d]/30 bg-okbg px-3 py-1 text-xs font-semibold text-okfg">✓ Disponibilidade imediata</span>
        {FILTROS.map((x) => (
          <button key={x.f} onClick={() => setSel((s) => ({ ...s, [x.f]: !s[x.f] }))}
            className={'mr-1.5 mt-1.5 rounded-full border px-3 py-1 text-xs font-semibold ' + (sel[x.f] ? 'border-accent bg-accent text-white' : 'border-line bg-subtle text-fg hover:bg-inset')}>{x.label}</button>
        ))}
        <div className="mt-4"><button onClick={buscar} className="btn btn-primary">Buscar agora</button></div>
      </Card>

      {reservada ? (
        <Card title="Reserva confirmada">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-okbg text-2xl text-okfg">✓</div>
            <p className="max-w-md text-sm text-muted">Reserva de <b className="text-fg">{reservada.id}</b> aprovada. A seguranca foi notificada para liberar a porta. Use o QR Code para acessar a sala.</p>
            <div className="my-4 h-36 w-36 rounded border-[8px] border-fg" style={{ background: 'conic-gradient(#000 25%,#fff 0 50%,#000 0 75%,#fff 0)' }} />
            <p className="text-sm text-muted">{reservada.id} · valido a partir das {reservada.hora}</p>
            <div className="mt-4 flex gap-2.5">
              <button onClick={() => nav('/painel')} className="btn">Ver no painel</button>
              <button onClick={() => setReservada(null)} className="btn btn-primary">Nova busca</button>
            </div>
          </div>
        </Card>
      ) : res && (
        <Card title={res.length + ' sala(s) encontrada(s)'}>
          {res.length === 0 && <div className="py-4 text-center text-sm text-muted">Nenhuma sala livre com esses filtros.</div>}
          {res.map((r, i) => (
            <div key={r.id} className={'flex items-center justify-between gap-3 rounded-md border border-line p-3 ' + (i > 0 ? 'mt-2.5' : '')}>
              <div>
                <b className="text-sm font-semibold">{r.id} · {r.cat} <Tag status="livre" /></b>
                <small className="mt-0.5 block text-xs text-muted">Bloco {r.bloco} · capacidade {r.cap}</small>
                <div className="mt-1 text-[11px] text-muted">{r.equip.join(' · ')}</div>
              </div>
              <button onClick={() => reservar(r.id)} className={'btn ' + (i === 0 ? 'btn-primary' : '')}>Reservar</button>
            </div>
          ))}
        </Card>
      )}
    </>
  )
}
