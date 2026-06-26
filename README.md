# GEIE - Gestao de Espacos e Infraestrutura Escolar

Prototipo navegavel (site desktop) da atividade de Interacao Humano-Computador.
SPA em arquivo unico, sem dependencias nem servidor: basta abrir `index.html` no navegador.

## Como abrir

Abra `index.html` em qualquer navegador (Chrome, Edge, Firefox).

## Estrutura

Single Page Application com barra lateral e roteamento por hash (`#/rota`).
O estado e compartilhado em memoria, entao as acoes se conectam entre as telas:
uma reserva feita pelo professor aparece no mapa da Ana e no painel do Marcos.

## Cenarios cobertos

1. Buscar Sala Agora (Augusto Carlos, 42 - Professor): filtros rapidos,
   reserva imediata e QR Code de acesso.
2. Novo Agendamento (Ana Lima, 22 - Coord. de extensao): data/hora, categoria,
   mapa visual do campus (livre/reservada/ocupada), comprovante em .txt.
3. Painel de Controle (Marcos Ramos, 51 - Coord. administrativo): ocupacao em
   tempo real, sensores, alerta de conflito com resolucao automatica e
   exportacao do relatorio de ociosidade.
4. Buscar Salas Ocupadas (Gabriela Ciresi, 19 - Discente de SI): busca por
   disciplina e rota de navegacao ate a sala realocada.

## Paginas

Inicio, Buscar Sala Agora, Novo Agendamento, Buscar Salas Ocupadas,
Painel de Controle, Meus Agendamentos e Mapa do Campus.

## Observacao

Dados simulados, foco em demonstrar os fluxos. Prototipo de apresentacao.
