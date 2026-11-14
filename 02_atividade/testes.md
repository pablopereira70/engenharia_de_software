# Testes da funcionalidade de reserva

## Objetivo

Verificar se a funcionalidade registra reservas para a Sala 1 e impede que duas solicitações ocupem o mesmo horário.

## Cenário de referência

Para os testes propostos na atividade, foi considerada a seguinte disponibilidade:

| Sala | Horário | Situação inicial |
|---|---|---|
| Sala 1 | 9h | Livre |
| Sala 1 | 10h | Ocupado |

## Casos de teste

| Caso | Ação | Resultado esperado | Resultado observado | Situação |
|---|---|---|---|---|
| A | Reservar a Sala 1 às 9h | A reserva deve ser confirmada. | Resultado específico não informado no registro dos testes. | Pendente de registro |
| B | Tentar reservar a Sala 1 às 10h | O sistema deve informar que o horário está ocupado e não registrar uma nova reserva. | Resultado específico não informado no registro dos testes. | Pendente de registro |
| C | Enviar duas requisições simultâneas para a mesma sala, data e horário | Apenas uma reserva deve ser registrada; a outra solicitação deve ser recusada. | Foi realizado o teste com requisições simultâneas e somente uma reserva foi efetivada. | **Aprovado** |

## Resultado do teste de concorrência

O teste de concorrência verificou o comportamento do sistema quando duas solicitações tentam reservar o mesmo horário ao mesmo tempo. O resultado observado foi a efetivação de apenas uma reserva, impedindo a duplicidade para aquele horário.

## Evidências

As evidências visuais dos testes não foram incluídas nesta documentação. Caso estejam disponíveis, podem ser adicionadas aqui por meio de capturas de tela do protótipo ou do registro das reservas no banco de dados.

## Conclusão

O teste de requisições simultâneas foi aprovado: apenas uma das solicitações resultou em reserva para o mesmo horário. Os resultados individuais dos cenários de 9h e 10h não foram detalhados nas informações fornecidas para esta documentação e, por isso, permanecem sem classificação. Eles devem ser registrados separadamente caso tenham sido executados.
