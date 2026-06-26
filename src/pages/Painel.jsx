import { useStore } from '../store.jsx'
import { detectConflitos, download } from '../data.js'
import { Card, Kpi } from '../ui.jsx'

const badge = { livre: 'bg-verdebg text-verde', reservada: 'bg-amarelobg text-[#a87c00]', ocupada: 'bg-vermelhobg text-vermelho' }

export default function Painel() {
  const { rooms, appts, liberarSala, resolverConflito } = useStore()
  const emUso = rooms.filter((r) => r.status !== 'livre').length
  const ocup = Math.round((emUso / rooms.length) * 100)
  const ocios = rooms.filter((r) => r.status !== 'livre' && r.sensor === 'vazio')
  const conflitos = detectConflitos(appts)

  const exportar = () => download('relatorio_ociosidade.txt',
    `RELATORIO MENSAL DE OCIOSIDADE - GEIE\nGerado em: ${new Date().toLocaleString('pt-BR')}\n\nOcupacao por sala (sala;categoria;status;sensor):\n` +
    rooms.map((r) => `${r.id};${r.cat};${r.status};${r.sensor}`).join('\n') +
    `\n\nOciosidade por horario:\n08h-10h; 3 salas; Remanejar turma A\n10h-12h; 1 sala\n14h-16h; 5 salas; Otimizar alocacao\n16h-18h; 2 salas`)

  return (
    <>
      <h2 className="mb-1.5 text-base font-semibold text-azul">Visao estrategica e controle de conflitos</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted">Ocupacao em tempo real de todo o campus. As reservas e agendamentos feitos nas outras telas aparecem aqui automaticamente.</p>
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <Kpi value={ocup + '%'} label="Ocupacao agora" />
        <Kpi value={emUso} label="Salas em uso/reservadas" />
        <Kpi value={ocios.length + conflitos.length} label="Alertas ativos" />
        <Kpi value={appts.length} label="Agendamentos" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Alertas em tempo real">
          {ocios.map((r) => (
            <div key={r.id} className="mb-3 rounded-lg border border-amarelo bg-amarelobg p-3.5 text-sm">
              <b className="block">⚠ Sala reservada, porem vazia</b>
              Sensores indicam <b>{r.id}</b> ({r.cat}) sem presenca, apesar de constar como {r.status}.
              <div className="mt-3"><button onClick={() => liberarSala(r.id)} className="rounded-lg bg-azul2 px-3 py-2 text-xs font-semibold text-white">Liberar sala</button></div>
            </div>
          ))}
          {conflitos.map((c, i) => (
            <div key={i} className="mb-3 rounded-lg border border-vermelho bg-vermelhobg p-3.5 text-sm">
              <b className="block">⚠ Conflito de agendamento</b>
              {c.length} professores alocaram <b>{c[0].sala}</b> em {c[0].data} as {c[0].inicio}.
              <div className="mt-3"><button onClick={() => resolverConflito(c[0].sala, c[0].data, c[0].inicio)} className="rounded-lg bg-vermelho px-3 py-2 text-xs font-semibold text-white">Resolver com sala alternativa</button></div>
            </div>
          ))}
          {ocios.length + conflitos.length === 0 && <div className="rounded-lg border border-verde bg-verdebg p-3.5 text-sm text-verde">✓ Nenhum alerta ativo no momento.</div>}
        </Card>
        <Card title="Ocupacao por sala">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] uppercase text-muted">{['Sala', 'Categoria', 'Status', 'Sensor'].map((h) => <th key={h} className="border-b border-borda p-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{rooms.map((r) => (
              <tr key={r.id}>
                <td className="border-b border-borda p-2"><b>{r.id}</b></td>
                <td className="border-b border-borda p-2">{r.cat}</td>
                <td className="border-b border-borda p-2"><span className={'rounded px-2 py-0.5 text-[10px] font-semibold ' + badge[r.status]}>{r.status}</span></td>
                <td className="border-b border-borda p-2">{r.sensor === 'presenca' ? 'Presenca' : 'Vazio'}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      </div>
      <Card title="Relatorio mensal de ociosidade">
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-muted">{['Horario', 'Salas ociosas', 'Acao sugerida'].map((h) => <th key={h} className="border-b border-borda p-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {[['08h - 10h', '3', 'Remanejar turma A para Bloco C'], ['10h - 12h', '1', '-'], ['14h - 16h', '5', 'Otimizar alocacao de laboratorios'], ['16h - 18h', '2', '-']].map((row) => (
              <tr key={row[0]}>{row.map((c, j) => <td key={j} className="border-b border-borda p-2">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4"><button onClick={exportar} className="rounded-lg bg-azulc px-4 py-2.5 text-sm font-semibold text-azul">⬇ Exportar relatorio (.txt)</button></div>
      </Card>
    </>
  )
}
