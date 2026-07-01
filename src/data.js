export const ROOMS_INIT = [
  { id: 'A-101', bloco: 'A', cap: 40, cat: 'Sala de aula', equip: ['Projetor', 'Tomada', 'Quadro'], status: 'livre', sensor: 'vazio' },
  { id: 'A-102', bloco: 'A', cap: 35, cat: 'Sala de aula', equip: ['Tomada', 'Quadro'], status: 'ocupada', sensor: 'presenca' },
  { id: 'B-1', bloco: 'B', cap: 80, cat: 'Auditorio', equip: ['Projetor', 'Tomada', 'Ar-condicionado'], status: 'livre', sensor: 'vazio' },
  { id: 'B-110', bloco: 'B', cap: 45, cat: 'Sala de aula', equip: ['Projetor', 'Tomada', 'Ar-condicionado', 'Quadro'], status: 'ocupada', sensor: 'presenca' },
  { id: 'C-204', bloco: 'C', cap: 45, cat: 'Sala de aula', equip: ['Projetor', 'Tomada', 'Quadro'], status: 'livre', sensor: 'vazio' },
  { id: 'C-205', bloco: 'C', cap: 30, cat: 'Sala de Reuniao/Estudo', equip: ['Tomada', 'Ar-condicionado'], status: 'livre', sensor: 'vazio' },
  { id: 'R-101', bloco: 'C', cap: 12, cat: 'Sala de Reuniao/Estudo', equip: ['Tomada', 'Quadro'], status: 'livre', sensor: 'vazio' },
  { id: 'R-102', bloco: 'C', cap: 10, cat: 'Sala de Reuniao/Estudo', equip: ['Tomada'], status: 'ocupada', sensor: 'presenca' },
  { id: 'Lab-03', bloco: 'D', cap: 30, cat: 'Laboratorio', equip: ['Computadores', 'Projetor', 'Ar-condicionado'], status: 'reservada', sensor: 'vazio' },
  { id: 'Lab-07', bloco: 'D', cap: 30, cat: 'Laboratorio', equip: ['Computadores', 'Tomada'], status: 'ocupada', sensor: 'presenca' },
  { id: 'D-110', bloco: 'D', cap: 40, cat: 'Sala de aula', equip: ['Projetor', 'Tomada', 'Quadro'], status: 'reservada', sensor: 'vazio' },
  { id: 'Aud-P', bloco: 'B', cap: 120, cat: 'Auditorio', equip: ['Projetor', 'Ar-condicionado'], status: 'reservada', sensor: 'vazio' },
]

// reservas de exemplo (semeadas uma unica vez) para ilustrar o conflito do painel
export const SEED_RESERVAS = [
  { sala: 'D-110', data: '2026-06-25', inicio: '18:50', fim: '20:30', just: 'Aula SI-302 Fisica (realocada)', persona: 'Coordenacao', uid: 'seed', role: 'coordenador' },
  { sala: 'Aud-P', data: '2026-06-26', inicio: '14:00', fim: '16:00', just: 'Palestra - Prof. Souza', persona: 'Prof. Souza', uid: 'seed', role: 'professor' },
  { sala: 'Aud-P', data: '2026-06-26', inicio: '14:00', fim: '16:00', just: 'Defesa de TCC - Prof. Andrade', persona: 'Prof. Andrade', uid: 'seed', role: 'professor' },
]

export const DISCIPLINAS = { 'SI-302': 'D-110', 'SI-104': 'B-110', 'SI-210': 'Lab-07' }

export function detectConflitos(reservas) {
  const map = {}
  reservas.forEach((a) => { const k = a.sala + '|' + a.data + '|' + a.inicio; (map[k] = map[k] || []).push(a) })
  return Object.values(map).filter((g) => g.length > 1)
}

export function download(nome, texto) {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = nome; a.click()
  URL.revokeObjectURL(a.href)
}

export const EQUIP = ['Projetor', 'Tomada', 'Ar-condicionado', 'Computadores', 'Quadro']
export const CATEGORIAS = ['Sala de aula', 'Sala de Reuniao/Estudo', 'Laboratorio', 'Auditorio']
export const CATEGORIA_ALUNO = 'Sala de Reuniao/Estudo'

export function horariosSobrepoem(aIni, aFim, bIni, bFim) {
  return aIni < bFim && bIni < aFim
}
