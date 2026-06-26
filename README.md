# GEIE - Gestao de Espacos e Infraestrutura Escolar

Prototipo navegavel (site desktop) da atividade de Interacao Humano-Computador,
feito com React + Vite + Tailwind CSS. Cobre os 4 cenarios das proto-personas
do documento, com estado conectado entre as telas.

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- React Router (HashRouter)

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de producao (pasta dist)
npm run preview  # serve o build
```

## Estrutura

```
src/
  main.jsx        entrada da aplicacao
  App.jsx         layout (sidebar, topbar) e rotas
  store.jsx       estado compartilhado e acoes (Context)
  data.js         salas, agendamentos, disciplinas e utilitarios
  ui.jsx          componentes reutilizaveis (Card, Kpi, Tag, mapa)
  pages/          uma pagina por rota
```

O estado fica em memoria via Context: reservar uma sala em "Buscar Sala Agora"
deixa a sala ocupada no mapa da Ana e no painel do Marcos automaticamente.

## Cenarios cobertos

1. Buscar Sala Agora (Augusto Carlos, 42 - Professor): filtros rapidos,
   reserva imediata e QR Code de acesso.
2. Novo Agendamento (Ana Lima, 22 - Coord. de extensao): data/hora, categoria,
   mapa visual do campus, comprovante em .txt.
3. Painel de Controle (Marcos Ramos, 51 - Coord. administrativo): ocupacao em
   tempo real, alerta de conflito com resolucao automatica e relatorio de ociosidade.
4. Buscar Salas Ocupadas (Gabriela Ciresi, 19 - Discente de SI): busca por
   disciplina e rota ate a sala realocada.

## Observacao

Dados simulados, foco em demonstrar os fluxos. Prototipo de apresentacao.
