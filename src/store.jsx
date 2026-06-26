import { createContext, useContext, useState } from 'react'
import { ROOMS_INIT, APPTS_INIT, DISCIPLINAS } from './data.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [rooms, setRooms] = useState(ROOMS_INIT)
  const [appts, setAppts] = useState(APPTS_INIT)
  const [reservas, setReservas] = useState([])
  const [toast, setToast] = useState('')

  const notify = (msg) => { setToast(msg); clearTimeout(window._tt); window._tt = setTimeout(() => setToast(''), 3500) }
  const setRoom = (id, patch) => setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const reservarAgora = (id) => {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setRoom(id, { status: 'ocupada', sensor: 'presenca' })
    setReservas((rv) => [...rv, { sala: id, hora }])
    setAppts((ap) => [...ap, { sala: id, data: '2026-06-25', inicio: hora, fim: '20:30', just: 'Reserva imediata - aula', persona: 'Augusto Carlos' }])
    notify('Sala ' + id + ' reservada. Visivel no painel e no mapa.')
    return hora
  }

  const agendar = ({ sala, data, inicio, fim, just }) => {
    setRooms((rs) => rs.map((r) => (r.id === sala && r.status === 'livre' ? { ...r, status: 'reservada' } : r)))
    setAppts((ap) => [...ap, { sala, data, inicio, fim, just, persona: 'Ana Lima' }])
    notify('Agendamento de ' + sala + ' confirmado e enviado ao calendario.')
  }

  const liberarSala = (id) => { setRoom(id, { status: 'livre', sensor: 'vazio' }); notify(id + ' liberada e devolvida ao pool de salas disponiveis.') }

  const resolverConflito = (sala, data, inicio) => {
    const orig = rooms.find((r) => r.id === sala)
    const cands = rooms.filter((r) => r.status === 'livre' && r.id !== sala)
    const alt = cands.filter((r) => r.cat === orig.cat).sort((a, b) => b.cap - a.cap)[0] || cands.sort((a, b) => b.cap - a.cap)[0]
    if (!alt) { notify('Sem sala alternativa de capacidade equivalente disponivel.'); return }
    const grupo = appts.filter((a) => a.sala === sala && a.data === data && a.inicio === inicio)
    let movidos = 0
    setAppts((ap) => ap.map((a) => {
      if (a.sala === sala && a.data === data && a.inicio === inicio && a !== grupo[0]) { movidos++; return { ...a, sala: alt.id } }
      return a
    }))
    setRoom(alt.id, { status: 'reservada' })
    notify('Conflito resolvido: agendamento movido para ' + alt.id + ' (mensagem automatica enviada).')
  }

  const localizar = (cod) => DISCIPLINAS[cod] ? rooms.find((r) => r.id === DISCIPLINAS[cod]) : null

  return (
    <Ctx.Provider value={{ rooms, appts, reservas, toast, reservarAgora, agendar, liberarSala, resolverConflito, localizar }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-xl bg-texto px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}
    </Ctx.Provider>
  )
}
