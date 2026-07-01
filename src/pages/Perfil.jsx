import { useState } from 'react'
import { Mail, Shield, Sun, Moon } from 'lucide-react'
import { useAuth } from '../auth.jsx'
import { currentTheme, applyTheme } from '../theme.js'
import { Card, PageHead } from '../ui.jsx'

const iniciais = (nome = '') => nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'

export default function Perfil() {
  const { user, profile, role } = useAuth()
  const [theme, setTheme] = useState(currentTheme())
  const escolher = (t) => { setTheme(t); applyTheme(t) }
  const seg = (on) => 'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ' + (on ? 'bg-canvas text-fg shadow-soft' : 'text-muted hover:text-fg')

  return (
    <>
      <PageHead title="Meu perfil" sub="Suas informacoes de conta e preferencias." />

      <Card title="Conta">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accentsoft text-lg font-bold text-accent">{iniciais(profile?.nome)}</span>
          <div>
            <b className="block text-base text-fg">{profile?.nome || 'Usuario'}</b>
            <span className="text-sm capitalize text-muted">{role}</span>
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex items-center gap-2 text-muted"><Mail size={16} /> <span className="text-fg">{profile?.email || user?.email}</span></div>
          <div className="flex items-center gap-2 text-muted"><Shield size={16} /> Papel: <span className="capitalize text-fg">{role}</span></div>
        </div>
      </Card>

      <Card title="Aparencia">
        <p className="mb-3 text-sm text-muted">Escolha o tema da interface.</p>
        <div className="inline-flex rounded-lg border border-line bg-subtle p-1">
          <button onClick={() => escolher('light')} className={seg(theme === 'light')}><Sun size={15} /> Claro</button>
          <button onClick={() => escolher('dark')} className={seg(theme === 'dark')}><Moon size={15} /> Escuro</button>
        </div>
      </Card>
    </>
  )
}
