# Backlogs e planejamento da Sprint

## Meta do Produto

Permitir que estudantes consultem a disponibilidade e reservem salas de estudo da biblioteca de forma simples, evitando conflitos de horário.

## Product Backlog

| Ordem | Item | Justificativa |
|---:|---|---|
| 1 | Reservar uma sala | É a funcionalidade central do cenário e permite tratar o problema apresentado: dois estudantes solicitarem a mesma sala no mesmo horário. |
| 2 | Cancelar uma reserva | Complementa o gerenciamento das reservas, permitindo liberar um horário quando o estudante não precisar mais dele. |
| 3 | Receber um lembrete | Ajuda o estudante a não esquecer a reserva, mas não é necessário para demonstrar o fluxo básico de consulta e reserva proposto nesta Sprint. |

## Meta da Sprint

Construir e demonstrar o fluxo de reserva da Sala 1, confirmando a solicitação quando o horário estiver livre e informando quando estiver ocupado.

## Sprint Backlog

**Item selecionado:** função de reserva de sala.

| Ação planejada | Responsável | Situação/observação |
|---|---|---|
| Montar a tela de escolha de horário | Developers — Pedro Eugênio | Protótipo desenvolvido com campos para usuário, data e horário. |
| Simular as respostas do aplicativo | Developers — Pedro Eugênio | O protótipo apresenta retorno de sucesso ou de indisponibilidade conforme a resposta da operação. |
| Executar os testes de 9h e 10h | Product Owner e Developers | Os cenários individuais devem ser registrados em `testes.md`. Também foi realizado um teste de requisições simultâneas, no qual apenas uma reserva foi efetivada. |

## Ajuste durante a Reunião Diária

**Problema apresentado:** o rascunho previa apenas a resposta de confirmação.

**Impacto sobre a Meta da Sprint:** sem tratar a indisponibilidade, o fluxo não atenderia ao cenário em que outro estudante tenta reservar um horário já ocupado.

**Ajuste registrado no Sprint Backlog:** incluir a resposta de horário ocupado e verificar que a tentativa não resulte em uma segunda reserva para o mesmo horário.
