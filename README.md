# GEIE - Gestao de Espacos e Infraestrutura Escolar

Aplicacao web para gestao de espacos e infraestrutura escolar, feita com
React + Vite + Tailwind e Firebase (Auth + Firestore). Interface de painel moderna, com reservas por usuario e papel salvas
em tempo real.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- React Router (HashRouter)
- Firebase Authentication (e-mail/senha)
- Cloud Firestore (banco em tempo real)

## Funcionalidades

- Cadastro e login de usuarios com papel (professor, aluno, coordenador)
- Rotas protegidas e navegacao filtrada por papel
- Buscar e reservar sala na hora (com QR Code) - professor/coordenador
- Novo agendamento pelo mapa do campus + comprovante .txt
- Localizar a sala de uma disciplina e ver a rota
- Painel do coordenador: ocupacao em tempo real, resolucao de conflitos e
  exportacao de relatorio
- Salas e reservas persistem no Firestore e atualizam ao vivo entre telas/usuarios

## Configuracao do Firebase (obrigatorio)

1. Crie um projeto em https://console.firebase.google.com
2. Em "Authentication" > "Sign-in method", habilite **E-mail/senha**
3. Em "Firestore Database", crie o banco (modo de teste para comecar)
4. Em "Configuracoes do projeto" > "Seus apps" (Web), copie as chaves do SDK
5. Copie `.env.example` para `.env` e preencha as variaveis `VITE_FIREBASE_*`

Regras minimas do Firestore para desenvolvimento (Console > Firestore > Regras):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de producao (pasta dist)
npm run preview  # serve o build
```

No primeiro acesso autenticado, o sistema semeia automaticamente as salas e
algumas reservas de exemplo (incluindo o conflito do auditorio para o painel).

## Estrutura

```
src/
  main.jsx        entrada
  App.jsx         layout, rotas e protecao por papel
  auth.jsx        AuthProvider (login, cadastro, logout)
  firebase.js     inicializacao do Firebase (le do .env)
  store.jsx       dados em tempo real e acoes (Firestore)
  data.js         seed de salas/reservas e utilitarios
  ui.jsx          componentes reutilizaveis
  pages/          Login, Cadastro e as paginas dos cenarios
```

## Papeis e acesso

- Professor: buscar/reservar, agendar, localizar, suas reservas, mapa
- Aluno: agendar, localizar, suas reservas, mapa
- Coordenador: tudo acima + Painel de Controle (ve todas as reservas)
