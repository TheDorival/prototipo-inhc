import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  updateProfile, onAuthStateChanged, sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase.js'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const traduzErro = (code) => ({
  'auth/invalid-email': 'E-mail invalido.',
  'auth/missing-password': 'Informe a senha.',
  'auth/weak-password': 'A senha deve ter ao menos 6 caracteres.',
  'auth/email-already-in-use': 'Este e-mail ja esta cadastrado.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Usuario nao encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
}[code] || 'Nao foi possivel concluir. Tente novamente.')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u)
    if (u) {
      const snap = await getDoc(doc(db, 'users', u.uid))
      setProfile(snap.exists() ? snap.data() : { nome: u.displayName || u.email, email: u.email, role: 'aluno' })
    } else {
      setProfile(null)
    }
    setLoading(false)
  }), [])

  const cadastrar = async ({ nome, email, senha, role }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha)
      await updateProfile(cred.user, { displayName: nome })
      await setDoc(doc(db, 'users', cred.user.uid), { nome, email, role })
      setProfile({ nome, email, role })
      return { ok: true }
    } catch (e) { return { ok: false, erro: traduzErro(e.code) } }
  }

  const entrar = async ({ email, senha }) => {
    try { await signInWithEmailAndPassword(auth, email, senha); return { ok: true } }
    catch (e) { return { ok: false, erro: traduzErro(e.code) } }
  }

  const recuperarSenha = async (email) => {
    try { await sendPasswordResetEmail(auth, email); return { ok: true } }
    catch (e) { return { ok: false, erro: traduzErro(e.code) } }
  }

  const sair = () => signOut(auth)

  return (
    <Ctx.Provider value={{ user, profile, role: profile?.role, loading, cadastrar, entrar, recuperarSenha, sair }}>
      {children}
    </Ctx.Provider>
  )
}
