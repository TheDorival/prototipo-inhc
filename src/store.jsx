import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  collection, doc, addDoc, updateDoc, setDoc, getDocs, onSnapshot,
  query, where, orderBy, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { useAuth } from './auth.jsx'
import { ROOMS_INIT, SEED_RESERVAS, DISCIPLINAS } from './data.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

async function seedIfEmpty() {
  const snap = await getDocs(collection(db, 'rooms'))
  if (!snap.empty) return
  const batch = writeBatch(db)
  ROOMS_INIT.forEach(({ id, ...rest }) => batch.set(doc(db, 'rooms', id), rest))
  SEED_RESERVAS.forEach((r) => batch.set(doc(collection(db, 'reservas')), { ...r, createdAt: Date.now() }))
  await batch.commit()
}

export function StoreProvider({ children }) {
  const { user, profile, role } = useAuth()
  const [rooms, setRooms] = useState([])
  const [reservas, setReservas] = useState([])
  const [toast, setToast] = useState('')
  const seeded = useRef(false)

  const notify = (msg) => { setToast(msg); clearTimeout(window._tt); window._tt = setTimeout(() => setToast(''), 3500) }

  // semeia uma vez e assina salas em tempo real
  useEffect(() => {
    if (!user) return
    if (!seeded.current) { seeded.current = true; seedIfEmpty().catch(() => {}) }
    return onSnapshot(collection(db, 'rooms'), (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.id.localeCompare(b.id)))
    })
  }, [user])

  // assina reservas: coordenador ve tudo, demais veem as suas
  useEffect(() => {
    if (!user) return
    const col = collection(db, 'reservas')
    const q = role === 'coordenador' ? col : query(col, where('uid', '==', user.uid))
    return onSnapshot(q, (snap) => setReservas(snap.docs.map((d) => ({ rid: d.id, ...d.data() }))))
  }, [user, role])

  const setRoom = (id, patch) => updateDoc(doc(db, 'rooms', id), patch)

  const reservarAgora = async (id) => {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    await setRoom(id, { status: 'ocupada', sensor: 'presenca' })
    await addDoc(collection(db, 'reservas'), {
      sala: id, data: new Date().toISOString().slice(0, 10), inicio: hora, fim: '20:30',
      just: 'Reserva imediata - aula', persona: profile?.nome || 'Professor', uid: user.uid, role,
      tipo: 'imediata', createdAt: Date.now(),
    })
    notify('Sala ' + id + ' reservada. Visivel no painel e no mapa.')
    return hora
  }

  const agendar = async ({ sala, data, inicio, fim, just }) => {
    const r = rooms.find((x) => x.id === sala)
    if (r && r.status === 'livre') await setRoom(sala, { status: 'reservada' })
    await addDoc(collection(db, 'reservas'), {
      sala, data, inicio, fim, just, persona: profile?.nome || 'Usuario', uid: user.uid, role,
      tipo: 'agendamento', createdAt: Date.now(),
    })
    notify('Agendamento de ' + sala + ' confirmado.')
  }

  const liberarSala = async (id) => { await setRoom(id, { status: 'livre', sensor: 'vazio' }); notify(id + ' liberada e devolvida ao pool de salas.') }

  const resolverConflito = async (sala, data, inicio) => {
    const orig = rooms.find((r) => r.id === sala)
    const cands = rooms.filter((r) => r.status === 'livre' && r.id !== sala)
    const alt = cands.filter((r) => r.cat === orig?.cat).sort((a, b) => b.cap - a.cap)[0] || cands.sort((a, b) => b.cap - a.cap)[0]
    if (!alt) { notify('Sem sala alternativa disponivel.'); return }
    const grupo = reservas.filter((a) => a.sala === sala && a.data === data && a.inicio === inicio)
    for (const a of grupo.slice(1)) await updateDoc(doc(db, 'reservas', a.rid), { sala: alt.id })
    await setRoom(alt.id, { status: 'reservada' })
    notify('Conflito resolvido: agendamento movido para ' + alt.id + '.')
  }

  const localizar = (cod) => DISCIPLINAS[cod] ? rooms.find((r) => r.id === DISCIPLINAS[cod]) : null

  return (
    <Ctx.Provider value={{ rooms, reservas, toast, notify, reservarAgora, agendar, liberarSala, resolverConflito, localizar }}>
      {children}
      {toast && <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-xl bg-texto px-4 py-3 text-sm text-white shadow-lg">{toast}</div>}
    </Ctx.Provider>
  )
}
