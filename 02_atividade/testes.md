# Testes da funcionalidade de reserva

## Objetivo

Verificar se a funcionalidade registra reservas para a Sala 1 e impede que duas solicitações ocupem o mesmo horário.

## Cenário de referência

Para os testes propostos na atividade, foi considerada a seguinte disponibilidade:

| Sala | Horário | Situação inicial |
|---|---|---|
| Sala 1 | 9h | Livre |
| Sala 1 | 10h | Ocupado |

Pré-condição dos casos A e B: na data usada no teste, já existe uma reserva às 10h e não existe reserva às 9h.

## Casos de teste

| Caso | Ação | Resultado esperado | Resultado observado | Situação |
|---|---|---|---|---|
| A | Reservar a Sala 1 às 9h | A tela mostra "Reserva realizada com sucesso!" e a reserva aparece em "Reservas do dia". | *(preencher após executar)* | A executar |
| B | Tentar reservar a Sala 1 às 10h | A tela mostra "Esse horário já foi reservado!" e nenhuma reserva nova aparece na lista. | *(preencher após executar)* | A executar |
| C | Enviar duas requisições simultâneas para a mesma sala, data e horário | Apenas uma reserva deve ser registrada; a outra solicitação deve ser recusada. | Foi realizado o teste com requisições simultâneas e somente uma reserva foi efetivada. | **Aprovado** |

## Resultado do teste de concorrência

O teste de concorrência verificou o comportamento do sistema quando duas solicitações tentam reservar o mesmo horário ao mesmo tempo. O resultado observado foi a efetivação de apenas uma reserva, impedindo a duplicidade para aquele horário.

## Evidências

Anexar em `evidencias/` as capturas de tela de cada caso (mensagem exibida e lista do dia) e a tabela `reservas` no Supabase depois dos testes.

## Conclusão

O caso C foi aprovado: apenas uma das solicitações resultou em reserva para o mesmo horário. Os casos A e B precisam ser executados e registrados nesta tabela antes da entrega; a conclusão da atividade só pode ser fechada depois deles.
