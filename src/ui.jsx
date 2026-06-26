export const Card = ({ title, children, className = '' }) => (
  <div className={'mb-4 rounded-xl border border-borda bg-white p-5 ' + className}>
    {title && <h3 className="mb-3 text-sm font-semibold text-azul">{title}</h3>}
    {children}
  </div>
)

export const Kpi = ({ value, label }) => (
  <div className="rounded-xl border border-borda bg-white p-4">
    <b className="block text-2xl text-azul">{value}</b>
    <small className="text-xs text-muted">{label}</small>
  </div>
)

const tagColors = {
  livre: 'bg-verdebg text-verde', ocupada: 'bg-vermelhobg text-vermelho', reservada: 'bg-amarelobg text-[#a87c00]',
}
export const Tag = ({ status }) => (
  <span className={'rounded px-2 py-0.5 text-[10px] font-semibold ' + (tagColors[status] || '')}>{status}</span>
)

export const roomBg = { livre: 'bg-verde', reservada: 'bg-amarelo', ocupada: 'bg-vermelho' }

export const Legenda = () => (
  <div className="mb-3 flex gap-5 text-xs">
    <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-verde" />Livre</span>
    <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-amarelo" />Reservada</span>
    <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-sm bg-vermelho" />Ocupada</span>
  </div>
)

export function MapaSalas({ rooms, onSelect, selected }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {rooms.map((r) => {
        const clickable = onSelect && r.status === 'livre'
        return (
          <div key={r.id}
            onClick={() => clickable && onSelect(r.id)}
            className={[
              'rounded-xl border-[3px] p-3 text-center text-white transition',
              roomBg[r.status],
              clickable ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
              selected === r.id ? 'border-texto' : 'border-transparent',
              r.status === 'ocupada' ? 'opacity-90' : '',
            ].join(' ')}>
            <b className="text-[13px]">{r.id}</b>
            <small className="mt-0.5 block text-[10px] opacity-90">{r.cat}</small>
            <small className="block text-[10px] opacity-90">cap. {r.cap}</small>
          </div>
        )
      })}
    </div>
  )
}
