
# Registro dos testes do protótipo

## Objetivo

Registrar os resultados dos testes realizados nas duas rodadas da atividade, observando como a alteração do protótipo influenciou a compreensão do usuário.

## Cenário de teste

O usuário deveria consultar dois horários da Sala 1 da biblioteca:

- 9h: horário livre.
- 10h: horário ocupado.

O teste consistia em selecionar os horários e interpretar as respostas apresentadas pelo protótipo.

## Rodada 1 — Primeiro protótipo

### Comportamento esperado

- Horário livre: exibir "Livre".
- Horário ocupado: deixar a resposta em branco.

### Resultado observado

| Horário consultado | Resultado apresentado | Observação |
|---|---|---|
| 9h | Livre | O usuário identificou corretamente que o horário estava disponível. |
| 10h | Resposta em branco | O usuário ficou em dúvida sobre o significado da ausência de resposta. |

### Problema identificado

A ausência de uma mensagem para o horário ocupado gerou ambiguidade. O usuário não sabia se o aplicativo havia travado, se a consulta ainda estava carregando ou se o horário estava indisponível.

## Rodada 2 — Protótipo adaptado

### Alteração realizada

Após a inspeção do primeiro teste, o grupo modificou o comportamento da interface para apresentar uma indicação explícita de indisponibilidade.

Em vez de deixar a resposta em branco, o protótipo passou a informar que o horário estava ocupado, utilizando uma mensagem como "Ocupado" ou "Nenhum horário disponível".

### Resultado observado

| Horário consultado | Resultado apresentado | Observação |
|---|---|---|
| 9h | Livre | O usuário identificou corretamente a disponibilidade. |
| 10h | Indicação de ocupado | O usuário identificou corretamente que o horário não estava disponível. |

### Resultado da adaptação

No segundo teste, o usuário conseguiu compreender as duas situações sem a dúvida observada na primeira rodada.

## Comparação entre as rodadas

| Aspecto | Rodada 1 | Rodada 2 |
|---|---|---|
| Horário livre | Exibia "Livre" | Exibia "Livre" |
| Horário ocupado | Resposta em branco | Indicação explícita de indisponibilidade |
| Compreensão do usuário | Houve dúvida | As respostas foram compreendidas |

## Conclusão

O teste evidenciou que uma resposta em branco não comunica adequadamente a indisponibilidade de um horário.

A partir da observação do comportamento do usuário, a equipe adaptou o protótipo e tornou a informação mais clara. Isso demonstra a importância de inspecionar o resultado do trabalho e utilizar o feedback para orientar melhorias.
