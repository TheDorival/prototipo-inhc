import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts'
import { Download, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store.jsx'
import { detectConflitos, download } from '../data.js'
import { Card, Kpi, PageHead } from '../ui.jsx'

const badge = { livre: 'bg-okbg text-okfg', reservada: 'bg-warnbg text-warn', ocupada: 'bg-dangerbg text-danger' }
const CORES = { livre: '#16a34a', reservada: '#d97706', ocupada: '#dc2626' }
const OCIOS = [
  { h: '08-10h', salas: 3 }, { h: '10-12h', salas: 1 }, { h: '14-16h', salas: 5 }, { h: '16-18h', salas: 2 },
]

export default function Painel() {
  const { rooms, reservas, liberarSala, resolverConflito } = useStore()
  const emUso = rooms.filter((r) => r.status !== 'livre').length
  const ocup = rooms.length ? Math.round((emUso / rooms.length) * 100) : 0
  const ocios = rooms.filter((r) => r.status !== 'livre' && r.sensor === 'vazio')
  const conflitos = detectConflitos(reservas)
  const dist = ['livre', 'reservada', 'ocupada'].map((s) => ({ name: s, value: rooms.filter((r) => r.status === s).length })).filter((d) => d.value > 0)

  const exportar = () => download('relatorio_ociosidade.txt',
    `RELATORIO MENSAL DE OCIOSIDADE - GEIE\nGerado em: ${new Date().toLocaleString('pt-BR')}\n\nOcupacao por sala (sala;categoria;status;sensor):\n` +
    rooms.map((r) => `${r.id};${r.cat};${r.status};${r.sensor}`).join('\n') +
    `\n\nOciosidade por horario:\n08h-10h; 3 salas\n10h-12h; 1 sala\n14h-16h; 5 salas\n16h-18h; 2 salas`)

  const th = 'border-b border-line px-3 py-2.5 text-left text-[11px] font-semibold uppercase text-muted'
  const td = 'border-b border-line px-3 py-2.5'
  return (
    <>
      <PageHead title="Painel de controle" sub="Ocupacao em tempo real do campus. Reservas feitas em qualquer tela aparecem aqui automaticamente." />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi value={ocup + '%'} label="Ocupacao agora" />
        <Kpi value={emUso} label="Em uso / reservadas" />
        <Kpi value={ocios.length + conflitos.length} label="Alertas ativos" />
        <Kpi value={reservas.length} label="Reservas" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Distribuicao das salas">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={78} paddingAngle={2}>
                  {dist.map((d) => <Cell key={d.name} fill={CORES[d.name]} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 text-sm">
              {dist.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ background: CORES[d.name] }} />
                  <span className="capitalize text-fg">{d.name}</span>
                  <b className="ml-auto text-fg">{d.value}</b>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Ociosidade por horario">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={OCIOS} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <XAxis dataKey="h" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(148,163,184,.12)' }} />
              <Bar dataKey="salas" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Alertas">
          {ocios.map((r) => (
            <div key={r.id} className="mb-3 rounded-lg border border-warn/40 bg-warnbg p-3 text-sm text-fg">
              <b className="mb-0.5 flex items-center gap-1.5 text-warn"><AlertTriangle size={15} /> Sala reservada, porem vazia</b>
              Sensores indicam <b>{r.id}</b> ({r.cat}) sem presenca, apesar de constar como {r.status}.
              <div className="mt-2.5"><button onClick={() => liberarSala(r.id)} className="btn">Liberar sala</button></div>
            </div>
          ))}
          {conflitos.map((c, i) => (
            <div key={i} className="mb-3 rounded-lg border border-danger/40 bg-dangerbg p-3 text-sm text-fg">
              <b className="mb-0.5 flex items-center gap-1.5 text-danger"><AlertTriangle size={15} /> Conflito de agendamento</b>
              {c.length} reservas para <b>{c[0].sala}</b> em {c[0].data} as {c[0].inicio}.
              <div className="mt-2.5"><button onClick={() => resolverConflito(c[0].sala, c[0].data, c[0].inicio)} className="btn btn-danger">Resolver com sala alternativa</button></div>
            </div>
          ))}
          {ocios.length + conflitos.length === 0 && <div className="flex items-center gap-1.5 rounded-lg border border-green/30 bg-okbg p-3 text-sm text-okfg"><CheckCircle2 size={15} /> Nenhum alerta ativo no momento.</div>}
        </Card>
        <Card title="Ocupacao por sala">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>{['Sala', 'Categoria', 'Status', 'Sensor'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody>{rooms.map((r) => (
                <tr key={r.id}>
                  <td className={td}><b>{r.id}</b></td>
                  <td className={td}>{r.cat}</td>
                  <td className={td}><span className={'rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ' + badge[r.status]}>{r.status}</span></td>
                  <td className={td}>{r.sensor === 'presenca' ? 'Presenca' : 'Vazio'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="mt-1"><button onClick={exportar} className="btn"><Download size={15} /> Exportar relatorio</button></div>
    </>
  )
}
