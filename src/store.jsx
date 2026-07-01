import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  collection, doc, addDoc, updateDoc, setDoc, deleteDoc, getDocs, onSnapshot,
  query, where, writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { useAuth } from './auth.jsx'
import { ROOMS_INIT, SEED_RESERVAS, DISCIPLINAS, horariosSobrepoem, CATEGORIA_ALUNO } from './data.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

async function seedIfEmpty(uid) {
  const snap = await getDocs(collection(db, 'rooms'))
  if (!snap.empty) return
  const batch = writeBatch(db)
  ROOMS_INIT.forEach(({ id, ...rest }) => batch.set(doc(db, 'rooms', id), rest))
  SEED_RESERVAS.forEach((r) => batch.set(doc(collection(db, 'reservas')), { ...r, uid, createdAt: Date.now() }))
  await batch.commit()
}

async function salaConflita(sala, data, inicio, fim, ignoreRid) {
  const snap = await getDocs(query(collection(db, 'reservas'), where('sala', '==', sala), where('data', '==', data)))
  return snap.docs.some((d) => d.id !== ignoreRid && horariosSobrepoem(inicio, fim, d.data().inicio, d.data().fim))
}

export function StoreProvider({ children }) {
  const { user, profile, role } = useAuth()
  const [rooms, setRooms] = useState([])
  const [reservas, setReservas] = useState([])
  const [toast, setToast] = useState('')
  const seeded = useRef(false)

  const notify = (msg) => { setToast(msg); clearTimeout(window._tt); window._tt = setTimeout(() => setToast(''), 3500) }

  useEffect(() => {
    if (!user) return
    return onSnapshot(collection(db, 'rooms'), (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.id.localeCompare(b.id)))
    })
  }, [user])

  useEffect(() => {
    if (!user) return
    const col = collection(db, 'reservas')
    const q = role === 'coordenador' ? col : query(col, where('uid', '==', user.uid))
    return onSnapshot(q, (snap) => setReservas(snap.docs.map((d) => ({ rid: d.id, ...d.data() }))))
  }, [user, role])

  useEffect(() => {
    if (user && role === 'coordenador' && !seeded.current) {
      seeded.current = true
      seedIfEmpty(user.uid).catch(() => {})
    }
  }, [user, role])

  const setRoom = (id, patch) => updateDoc(doc(db, 'rooms', id), patch)

  const agendar = async ({ sala, data, inicio, fim, just }) => {
    if (fim <= inicio) return { ok: false, erro: 'O termino deve ser depois do inicio.' }
    const r = rooms.find((x) => x.id === sala)
    if (role === 'aluno' && r?.cat !== CATEGORIA_ALUNO) return { ok: false, erro: 'Alunos so podem reservar salas de reuniao/estudo.' }
    try {
      if (await salaConflita(sala, data, inicio, fim)) return { ok: false, erro: 'A sala ja esta reservada nesse horario.' }
      if (r && r.status === 'livre') await setRoom(sala, { status: 'reservada' })
      await addDoc(collection(db, 'reservas'), {
        sala, data, inicio, fim, just, persona: profile?.nome || 'Usuario', uid: user.uid, role,
        tipo: 'agendamento', createdAt: Date.now(),
      })
      notify('Agendamento de ' + sala + ' confirmado.')
      return { ok: true }
    } catch (e) { return { ok: false, erro: 'Erro ao salvar o agendamento.' } }
  }

  const cancelarReserva = async (r) => {
    try {
      await deleteDoc(doc(db, 'reservas', r.rid))
      const restantes = await getDocs(query(collection(db, 'reservas'), where('sala', '==', r.sala)))
      if (restantes.empty) await setRoom(r.sala, { status: 'livre', sensor: 'vazio' })
      notify('Reserva cancelada.')
    } catch (e) { notify('Erro ao cancelar a reserva.') }
  }

  const editarReserva = async (r, patch) => {
    if (patch.fim <= patch.inicio) return { ok: false, erro: 'O termino deve ser depois do inicio.' }
    try {
      if (await salaConflita(r.sala, patch.data, patch.inicio, patch.fim, r.rid)) return { ok: false, erro: 'Conflito de horario nessa sala.' }
      await updateDoc(doc(db, 'reservas', r.rid), patch)
      notify('Reserva atualizada.')
      return { ok: true }
    } catch (e) { return { ok: false, erro: 'Erro ao atualizar a reserva.' } }
  }

  const liberarSala = async (id) => {
    try { await setRoom(id, { status: 'livre', sensor: 'vazio' }); notify(id + ' liberada.') }
    catch (e) { notify('Erro ao liberar a sala.') }
  }

  const resolverConflito = async (sala, data, inicio) => {
    try {
      const orig = rooms.find((r) => r.id === sala)
      const cands = rooms.filter((r) => r.status === 'livre' && r.id !== sala)
      const alt = cands.filter((r) => r.cat === orig?.cat).sort((a, b) => b.cap - a.cap)[0] || cands.sort((a, b) => b.cap - a.cap)[0]
      if (!alt) { notify('Sem sala alternativa disponivel.'); return }
      const grupo = reservas.filter((a) => a.sala === sala && a.data === data && a.inicio === inicio)
      for (const a of grupo.slice(1)) await updateDoc(doc(db, 'reservas', a.rid), { sala: alt.id })
      await setRoom(alt.id, { status: 'reservada' })
      notify('Conflito resolvido: agendamento movido para ' + alt.id + '.')
    } catch (e) { notify('Erro ao resolver o conflito.') }
  }

  const addRoom = async (room) => {
    try {
      const { id, ...rest } = room
      if (rooms.some((r) => r.id === id)) return { ok: false, erro: 'Ja existe uma sala com esse ID.' }
      await setDoc(doc(db, 'rooms', id), rest)
      notify('Sala ' + id + ' cadastrada.')
      return { ok: true }
    } catch (e) { return { ok: false, erro: 'Erro ao cadastrar a sala.' } }
  }
  const updateRoom = async (id, patch) => {
    try { await updateDoc(doc(db, 'rooms', id), patch); notify('Sala ' + id + ' atualizada.'); return { ok: true } }
    catch (e) { return { ok: false, erro: 'Erro ao atualizar a sala.' } }
  }
  const removeRoom = async (id) => {
    try { await deleteDoc(doc(db, 'rooms', id)); notify('Sala ' + id + ' removida.') }
    catch (e) { notify('Erro ao remover a sala.') }
  }

  const localizar = (cod) => DISCIPLINAS[cod] ? rooms.find((r) => r.id === DISCIPLINAS[cod]) : null

  return (
    <Ctx.Provider value={{
      rooms, reservas, toast, notify,
      agendar, cancelarReserva, editarReserva,
      liberarSala, resolverConflito, localizar,
      addRoom, updateRoom, removeRoom,
    }}>
      {children}
      {toast && <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-xl bg-fg px-4 py-3 text-sm text-canvas shadow-lg">{toast}</div>}
    </Ctx.Provider>
  )
}
