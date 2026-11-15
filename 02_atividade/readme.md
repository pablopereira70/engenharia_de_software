# Atividade 02 — Papéis, Artefatos e Eventos do Scrum

## Objetivo

Aplicar os conceitos de papéis, artefatos e eventos do Scrum por meio da construção, teste e avaliação de uma funcionalidade de reserva de salas de estudo.

A atividade simulou o trabalho de um Time Scrum, desde a definição das prioridades do produto e o planejamento da Sprint até a demonstração do protótipo, a execução dos testes e a identificação de melhorias.

## Cenário proposto

O desafio consistiu em desenvolver uma funcionalidade para um aplicativo de reserva de salas de estudo da biblioteca.

O problema apresentado era a possibilidade de dois estudantes solicitarem a mesma sala no mesmo horário. Para representar essa situação, foi utilizada a Sala 1, com dois horários:

| Horário | Disponibilidade |
|---|---|
| 9h | Livre |
| 10h | Ocupado |

A funcionalidade deveria permitir que o usuário escolhesse um horário e acionasse a opção **Reservar**. O aplicativo deveria confirmar a reserva quando o horário estivesse livre e informar sua indisponibilidade quando já estivesse ocupado.

## Desenvolvimento da atividade

A atividade foi organizada em etapas que representam o planejamento, o desenvolvimento e a avaliação de uma Sprint.

### Planejamento do produto e da Sprint

Inicialmente, o Product Owner definiu a Meta do Produto e organizou o Product Backlog, considerando os pedidos de reserva de sala, cancelamento de reserva e recebimento de lembretes.

Em seguida, o trio definiu a Meta da Sprint e selecionou a funcionalidade de reserva para desenvolvimento. O planejamento e as decisões relacionadas aos backlogs estão registrados em [backlogs.md](backlogs.md).

### Construção do protótipo

O representante dos Developers elaborou o protótipo da funcionalidade de reserva, com campos para identificação do usuário, escolha da data e seleção do horário. A aplicação utiliza HTML, CSS e JavaScript, com integração ao Supabase para registrar e consultar as reservas.

O protótipo está disponível na pasta [prototipo](prototipo/).

### Ajuste durante a Reunião Diária

Durante a simulação da Reunião Diária, foi considerado que o rascunho inicial previa apenas a resposta de confirmação. Como esse comportamento não tratava a tentativa de reservar um horário ocupado, o plano precisou ser ajustado para contemplar também a indicação de indisponibilidade.

O ajuste realizado no Sprint Backlog está descrito em [backlogs.md](backlogs.md).

### Testes da funcionalidade

Além dos cenários previstos na atividade — reservar a Sala 1 às 9h, quando está livre, e às 10h, quando está ocupada —, foi realizado um teste com requisições simultâneas. Nesse teste, apenas uma das tentativas resultou em reserva, evitando que duas reservas fossem registradas para o mesmo horário.

Os resultados observados e as limitações dos testes estão registrados em [testes.md](testes.md).

## Organização da equipe

A equipe foi composta pelos seguintes integrantes e papéis:

- **Product Owner:** Carlos Daniel.
- **Scrum Master:** Pablo Leon.
- **Developers:** Pedro Eugênio.

A distribuição dos papéis está detalhada em [equipe.md](equipe.md).

## Revisão e Retrospectiva da Sprint

Na Revisão da Sprint, o protótipo foi apresentado a um colega no papel de usuário da biblioteca. O feedback recebido foi que o aplicativo é intuitivo e fácil de usar. Como ponto de melhoria, foi observada a falta de uma indicação de que a lista exibe somente as reservas da data selecionada; essa informação poderia orientar o usuário a preencher o campo de data para visualizar as reservas correspondentes.

A decisão do Product Owner sobre esse feedback e os registros da Retrospectiva estão disponíveis em [revisao_retrospectiva.md](revisao_retrospectiva.md).

## Conclusão

A atividade permitiu observar como os papéis, artefatos e eventos do Scrum se relacionam durante o desenvolvimento de uma funcionalidade. O protótipo atendeu ao comportamento principal solicitado para a reserva, e o teste simultâneo indicou que apenas uma solicitação foi efetivada para o mesmo horário. A avaliação também revelou uma melhoria de usabilidade: deixar explícito que a lista de reservas depende da data informada pelo usuário.
