import { useStore } from '../store.jsx'
import { detectConflitos, download } from '../data.js'
import { Card, Kpi, PageHead } from '../ui.jsx'

const badge = { livre: 'bg-okbg text-okfg', reservada: 'bg-warnbg text-warn', ocupada: 'bg-dangerbg text-danger' }

export default function Painel() {
  const { rooms, reservas, liberarSala, resolverConflito } = useStore()
  const emUso = rooms.filter((r) => r.status !== 'livre').length
  const ocup = rooms.length ? Math.round((emUso / rooms.length) * 100) : 0
  const ocios = rooms.filter((r) => r.status !== 'livre' && r.sensor === 'vazio')
  const conflitos = detectConflitos(reservas)

  const exportar = () => download('relatorio_ociosidade.txt',
    `RELATORIO MENSAL DE OCIOSIDADE - GEIE\nGerado em: ${new Date().toLocaleString('pt-BR')}\n\nOcupacao por sala (sala;categoria;status;sensor):\n` +
    rooms.map((r) => `${r.id};${r.cat};${r.status};${r.sensor}`).join('\n') +
    `\n\nOciosidade por horario:\n08h-10h; 3 salas; Remanejar turma A\n10h-12h; 1 sala\n14h-16h; 5 salas; Otimizar alocacao\n16h-18h; 2 salas`)

  const th = 'border-b border-line px-2 py-2 text-left text-[11px] font-semibold uppercase text-muted'
  const td = 'border-b border-line px-2 py-2'
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
        <Card title="Alertas">
          {ocios.map((r) => (
            <div key={r.id} className="mb-3 rounded-md border border-warn/40 bg-warnbg p-3 text-sm text-fg">
              <b className="block text-warn">⚠ Sala reservada, porem vazia</b>
              Sensores indicam <b>{r.id}</b> ({r.cat}) sem presenca, apesar de constar como {r.status}.
              <div className="mt-2.5"><button onClick={() => liberarSala(r.id)} className="btn">Liberar sala</button></div>
            </div>
          ))}
          {conflitos.map((c, i) => (
            <div key={i} className="mb-3 rounded-md border border-danger/40 bg-dangerbg p-3 text-sm text-fg">
              <b className="block text-danger">⚠ Conflito de agendamento</b>
              {c.length} reservas para <b>{c[0].sala}</b> em {c[0].data} as {c[0].inicio}.
              <div className="mt-2.5"><button onClick={() => resolverConflito(c[0].sala, c[0].data, c[0].inicio)} className="btn btn-danger">Resolver com sala alternativa</button></div>
            </div>
          ))}
          {ocios.length + conflitos.length === 0 && <div className="rounded-md border border-[#1f883d]/30 bg-okbg p-3 text-sm text-okfg">✓ Nenhum alerta ativo no momento.</div>}
        </Card>
        <Card title="Ocupacao por sala">
          <table className="w-full text-sm">
            <thead><tr>{['Sala', 'Categoria', 'Status', 'Sensor'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody>{rooms.map((r) => (
              <tr key={r.id}>
                <td className={td}><b>{r.id}</b></td>
                <td className={td}>{r.cat}</td>
                <td className={td}><span className={'rounded-full px-2 py-0.5 text-[11px] font-semibold ' + badge[r.status]}>{r.status}</span></td>
                <td className={td}>{r.sensor === 'presenca' ? 'Presenca' : 'Vazio'}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      </div>
      <Card title="Relatorio mensal de ociosidade">
        <table className="w-full text-sm">
          <thead><tr>{['Horario', 'Salas ociosas', 'Acao sugerida'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody>
            {[['08h - 10h', '3', 'Remanejar turma A para Bloco C'], ['10h - 12h', '1', '-'], ['14h - 16h', '5', 'Otimizar alocacao de laboratorios'], ['16h - 18h', '2', '-']].map((row) => (
              <tr key={row[0]}>{row.map((c, j) => <td key={j} className={td}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4"><button onClick={exportar} className="btn">⬇ Exportar relatorio</button></div>
      </Card>
    </>
  )
}
