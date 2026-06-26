import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { Card, Tag } from '../ui.jsx'

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
      <h2 className="mb-1.5 text-base font-semibold text-azul">Imprevisto em sala de aula</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted">Sua sala habitual esta trancada por manutencao e a aula comeca em 10 minutos. Aplique os filtros e reserve uma sala disponivel agora.</p>
      <Card title="Filtros rapidos">
        <span className="mr-1.5 inline-block rounded-full border border-[#bfe3cb] bg-verdebg px-3.5 py-1.5 text-xs text-verde">✓ Disponibilidade imediata</span>
        {FILTROS.map((x) => (
          <button key={x.f} onClick={() => setSel((s) => ({ ...s, [x.f]: !s[x.f] }))}
            className={'mr-1.5 mt-1 rounded-full border px-3.5 py-1.5 text-xs ' + (sel[x.f] ? 'border-azul bg-azul text-white' : 'border-borda bg-[#eef2f8] text-azul')}>{x.label}</button>
        ))}
        <div className="mt-4"><button onClick={buscar} className="rounded-lg bg-azul2 px-4 py-2.5 text-sm font-semibold text-white hover:bg-azul">Buscar agora</button></div>
      </Card>

      {reservada ? (
        <Card className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-verde text-3xl text-white">✓</div>
          <h3 className="text-sm font-semibold text-azul">Reserva de {reservada.id} aprovada</h3>
          <p className="my-2 max-w-md text-sm text-muted">A equipe de seguranca foi notificada para liberar a porta remotamente. Use o QR Code abaixo para acessar a sala.</p>
          <div className="my-4 h-40 w-40 rounded border-[9px] border-black" style={{ background: 'conic-gradient(#000 25%,#fff 0 50%,#000 0 75%,#fff 0)' }} />
          <p className="text-sm text-muted">{reservada.id} · valido a partir das {reservada.hora}</p>
          <div className="mt-4 flex gap-2.5">
            <button onClick={() => nav('/painel')} className="rounded-lg bg-azulc px-4 py-2.5 text-sm font-semibold text-azul">Ver no painel</button>
            <button onClick={() => setReservada(null)} className="rounded-lg bg-azul2 px-4 py-2.5 text-sm font-semibold text-white hover:bg-azul">Nova busca</button>
          </div>
        </Card>
      ) : res && (
        <Card title={res.length + ' sala(s) encontrada(s)'}>
          {res.length === 0 && <div className="p-4 text-center text-sm text-muted">Nenhuma sala livre com esses filtros.</div>}
          {res.map((r, i) => (
            <div key={r.id} className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-borda p-3.5">
              <div>
                <b className="text-sm">{r.id} · {r.cat} <Tag status="livre" /></b>
                <small className="mt-0.5 block text-xs text-muted">Bloco {r.bloco} · capacidade {r.cap}</small>
                <div className="mt-1 text-[11px] text-muted">{r.equip.join(' · ')}</div>
              </div>
              <button onClick={() => reservar(r.id)} className={'rounded-lg px-4 py-2.5 text-sm font-semibold ' + (i === 0 ? 'bg-verde text-white' : 'bg-azulc text-azul')}>Reservar</button>
            </div>
          ))}
        </Card>
      )}
    </>
  )
}
