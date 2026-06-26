export const Card = ({ title, children, className = '' }) => (
  <div className={'card mb-4 ' + className}>
    {title && <div className="border-b border-line px-4 py-3 text-sm font-semibold text-fg">{title}</div>}
    <div className="p-4">{children}</div>
  </div>
)

export const Kpi = ({ value, label }) => (
  <div className="rounded-md border border-line bg-subtle p-4">
    <b className="block text-2xl font-semibold text-fg">{value}</b>
    <small className="text-xs text-muted">{label}</small>
  </div>
)

const tagColors = {
  livre: 'bg-okbg text-okfg border-[#1f883d]/30',
  ocupada: 'bg-dangerbg text-danger border-danger/30',
  reservada: 'bg-warnbg text-warn border-warn/30',
}
export const Tag = ({ status }) => (
  <span className={'rounded-full border px-2 py-0.5 text-[11px] font-semibold ' + (tagColors[status] || '')}>{status}</span>
)

export const roomBg = { livre: 'bg-okbg border-[#1f883d]/30 text-okfg', reservada: 'bg-warnbg border-warn/30 text-warn', ocupada: 'bg-dangerbg border-danger/30 text-danger' }

export const Legenda = () => (
  <div className="mb-3 flex gap-5 text-xs text-muted">
    <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-green" />Livre</span>
    <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-warn" />Reservada</span>
    <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-danger" />Ocupada</span>
  </div>
)

export function MapaSalas({ rooms, onSelect, selected }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {rooms.map((r) => {
        const clickable = onSelect && r.status === 'livre'
        return (
          <div key={r.id}
            onClick={() => clickable && onSelect(r.id)}
            className={[
              'rounded-md border p-3 text-center transition',
              roomBg[r.status],
              clickable ? 'cursor-pointer hover:brightness-95' : 'cursor-default',
              selected === r.id ? 'ring-2 ring-accent ring-offset-1' : '',
              r.status === 'ocupada' ? 'opacity-90' : '',
            ].join(' ')}>
            <b className="text-sm font-semibold">{r.id}</b>
            <small className="mt-0.5 block text-[11px] opacity-80">{r.cat}</small>
            <small className="block text-[11px] opacity-80">cap. {r.cap}</small>
          </div>
        )
      })}
    </div>
  )
}

export const PageHead = ({ title, sub }) => (
  <div className="mb-5 border-b border-line pb-4">
    <h2 className="text-xl font-semibold text-fg">{title}</h2>
    {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
  </div>
)
