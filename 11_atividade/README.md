# Atividade 11 — Product Backlog e Sprint Backlog

**Trio:** Carlos, Pedro e Pablo  
**Disciplina:** Engenharia de Software  
**Aplicativo:** Reservas de salas da biblioteca — Sala 1  
**Base utilizada:** protótipo das Atividades 06 a 10 e orientações da Atividade 11.

## 1. Registro dos cinco relatos

| Relato | Problema ou necessidade | Encaminhamento | Justificativa |
|---|---|---|---|
| R-01 — Confirmação após reagendar | Depois de mudar uma reserva, o estudante quer ter certeza imediata de que a alteração deu certo, sem abrir “Minhas reservas” para conferir. | **Refinar item existente: PB-01.** | O item de confirmação detalhada já estava em aberto. A mensagem deve identificar Sala 1, data e novo horário. |
| R-02 — Lembrete | O estudante relata que um lembrete antes do uso da sala ajudaria a não esquecer a reserva. | **Propor item novo: PB-03.** | É uma necessidade de software diferente da confirmação do reagendamento. Beneficia quem tem uma reserva futura. |
| R-03 — Encontrar horários disponíveis | É necessário localizar rapidamente horários livres e entender quando não existe horário livre na data consultada. | **Propor item novo: PB-04.** | Um filtro reduz a necessidade de conferir manualmente cada horário. A hipótese é que o filtro deve oferecer “Todos”, “Livres” e “Ocupados”; confirmar com usuários. |
| R-04 — Consultar alterações anteriores | O trio já havia identificado o interesse em consultar as trocas de horário realizadas. | **Refinar item em aberto: PB-02; manter a descrição inicial e detalhar depois.** | O histórico já consta no backlog anterior. Não há informação suficiente nesta atividade para definir campos, período de retenção ou forma de apresentação. |
| R-05 — Evitar divergência entre telas | Durante a atividade anterior, “Minhas reservas” e “Consultar horários” chegaram a exibir estados diferentes após uma alteração. | **Registrar como melhoria da forma de trabalhar.** Acompanhar na Retrospectiva e no quadro de ações do time até a próxima Review. | Não é uma função nova do aplicativo. A ação é perguntar “que outra tela depende dessa mudança?” sempre que uma função de gravação for alterada e conferir as telas em conjunto. |

### Conversa curta do trio

**Carlos (Product Owner):** “Quando a dúvida sobre a reserva aparece: logo depois de reagendar ou só mais tarde, quando o estudante vai usar a sala?”

**Pablo (Developers):** “No cenário relatado, a dúvida aparece logo após confirmar. É possível observar se a mensagem de sucesso identifica a Sala 1, a data e o novo horário, sem exigir que o estudante abra outra tela.”

**Pedro (Scrum Master):** “Ainda precisamos confirmar se o lembrete deve ser enviado sempre 15 minutos antes ou se o estudante poderá escolher o intervalo. O protótipo manterá 15 minutos como hipótese inicial, porque esse intervalo já existia na implementação anterior.”

**Hipótese a confirmar:** para o filtro, considera-se inicialmente que “ocupados” inclui tanto reservas do próprio usuário quanto reservas de outras pessoas. O trio deve confirmar se a pessoa usuária deseja também uma opção separada para “Minhas reservas”.

---

## 2. Product Backlog ordenado

### Meta do Produto

> Permitir que estudantes consultem, reservem e gerenciem horários da Sala 1 com clareza, reduzindo dúvidas e esquecimentos durante o uso das reservas.

### Ordem definida pelo Product Owner

| Ordem | ID | Item | Estimativa | Decisão |
|---:|---|---|---:|---|
| 1 | **PB-01** | Confirmar o reagendamento com sala, data e novo horário | 1 período | Prioridade máxima: resolve diretamente a dúvida relatada e depende de uma função de reagendamento que já existe. |
| 2 | **PB-03** | Enviar lembrete antes da reserva | 2 períodos | Beneficia quem pode esquecer o horário. A estimativa considera permissão de notificação, agendamento e atualização após reagendar. |
| 3 | **PB-04** | Filtrar horários por disponibilidade | 1 período | Facilita a consulta, mas não resolve a dúvida imediata após o reagendamento; pode entrar em uma próxima Sprint. |
| 4 | **PB-02** | Histórico de alterações de reservas | A detalhar | Mantido com a descrição inicial. Depende de definir quais alterações serão registradas e como serão apresentadas. |

**Justificativa dos dois primeiros:** PB-01 vem primeiro porque responde diretamente ao feedback da Review e aproveita o reagendamento já implementado. PB-03 vem em seguida porque atende a outra necessidade expressa, mas exige mais trabalho e não é a causa da dúvida imediata após reagendar. A ordem entrega primeiro uma confirmação verificável e depois acrescenta prevenção de esquecimentos. PB-04 e PB-02 permanecem no backlog para não ultrapassar a capacidade da Sprint.

### Ficha PB-01 — Confirmar o reagendamento com detalhes

- **Origem e valor:** R-01. Beneficia o estudante que acabou de reagendar e reduz a dúvida sobre qual reserva foi alterada.
- **Requisito funcional:** quando o reagendamento for concluído com sucesso, o aplicativo deve exibir uma mensagem que identifique a Sala 1, a data da reserva e o novo horário. Se o destino estiver ocupado e a alteração não ocorrer, deve continuar exibindo o aviso de conflito e preservar a reserva original.
- **Critério verificável 1:** dada uma reserva da Sala 1 em 10/11 às 10h, quando Ana a reagendar para 11h e o horário estiver livre, então a mensagem deverá informar “Sala 1”, “10/11” e “11h”.
- **Critério verificável 2:** dada uma reserva em 10/11 às 10h, quando Ana tentar reagendar para um horário ocupado, então o aplicativo deverá informar que o destino está ocupado, não apresentar mensagem de sucesso e manter a reserva às 10h.
- **Estimativa:** **1 período**.
- **Dúvida:** confirmar com usuários se a mensagem deve também informar o nome de quem reservou. Não é necessário para o critério atual.

### Ficha PB-03 — Enviar lembrete antes da reserva

- **Origem e valor:** R-02. Beneficia estudantes com reservas futuras e reduz o risco de esquecer o horário.
- **Requisito funcional:** quando o usuário conceder permissão para notificações, o aplicativo deverá agendar um lembrete para 15 minutos antes do início de cada reserva futura do usuário. Se a reserva for reagendada, o lembrete antigo deverá ser cancelado e um novo deverá ser agendado para o horário atualizado.
- **Critério verificável 1:** dada uma reserva futura e a permissão de notificação concedida, então o aplicativo deverá programar uma notificação para 15 minutos antes, contendo a data e o horário da reserva.
- **Critério verificável 2:** dada uma reserva que foi reagendada, então o lembrete deverá corresponder ao novo horário; o horário anterior não deverá gerar um lembrete duplicado.
- **Estimativa:** **2 períodos**.
- **Dúvida/limitação:** a implementação atual usa temporizadores do navegador e só consegue disparar enquanto a página permanece aberta. Para notificar com a página fechada, seria necessária uma solução de notificações em segundo plano, como serviço de backend e/ou service worker com push. O intervalo de 15 minutos é uma hipótese inicial a confirmar.

### Ficha PB-04 — Filtrar horários por disponibilidade

- **Origem e valor:** R-03. Beneficia quem consulta a sala e reduz a conferência manual dos horários.
- **Requisito funcional:** na consulta da Sala 1 por data, o aplicativo deverá permitir visualizar todos os horários, somente os livres ou somente os ocupados. Quando o filtro selecionado não tiver resultados, deverá apresentar uma mensagem informativa.
- **Critério verificável 1:** dada uma data com 10h ocupado e 11h livre, quando o usuário selecionar “Somente livres”, então a lista deverá mostrar apenas 11h.
- **Critério verificável 2:** dada uma data sem horários livres, quando o usuário selecionar “Somente livres”, então a lista deverá informar “Não há horários livres nesta data”, sem exibir horários como se estivessem disponíveis.
- **Estimativa:** **1 período**.
- **Hipótese:** “Ocupados” inclui reservas do próprio usuário e de outras pessoas. Confirmar se será necessário um filtro separado para “Minhas reservas”.

### Registro do item PB-02 — Histórico de alterações

- **Descrição inicial mantida:** “Mostrar as trocas de horário já feitas nas reservas.”
- **Situação:** item em aberto, sem detalhamento nesta atividade.
- **Próximo refinamento:** decidir quais dados compõem cada registro (por exemplo, horário anterior, novo horário e data da reserva), quem pode consultar o histórico e por quanto tempo os registros serão mantidos.
- **Estimativa:** não definida.

---

## 3. Sprint Backlog

### Meta da Sprint

> Dar ao estudante uma confirmação clara após reagendar e ajudá-lo a lembrar da reserva futura, sem precisar conferir o novo horário em outra tela.

### Seleção do trabalho

Capacidade disponível: **3 períodos**.

| ID | Item selecionado | Estimativa | Contribuição para a Meta |
|---|---|---:|---|
| PB-01 | Confirmar o reagendamento com sala, data e novo horário | 1 | Resolve diretamente a dúvida logo após a troca. |
| PB-03 | Enviar lembrete antes da reserva | 2 | Ajuda o estudante a lembrar do horário confirmado. |
|  | **Total** | **3 períodos** | Dentro da capacidade. |

**Item que ficará para outra Sprint:** PB-04 (filtro de horários), estimado em 1 período. Ele melhora a consulta, mas não é necessário para entregar a confirmação após o reagendamento nem o lembrete. PB-02 também permanece no Product Backlog, aguardando refinamento.

### Plano dos Developers

| ID do item | Ação do plano | Resultado produzido e forma de conferência |
|---|---|---|
| PB-01 | Alterar a mensagem de sucesso no fluxo de reagendamento para incluir sala, data e novo horário. | Mensagem identifica a reserva alterada. Conferir no cenário de 10/11, 10h → 11h. |
| PB-01 | Simular duas reservas da Sala 1 às 10h, uma em 10/11 e outra em 12/11; reagendar apenas a de 10/11. | Evidência de que a confirmação mostra a data correta e não confunde as reservas. |
| PB-03 | Ao conceder permissão, consultar as reservas futuras do usuário e agendar os lembretes. | Temporizador é criado para cada reserva futura. Conferir a data e o horário usados no agendamento. |
| PB-03 | Ao reagendar, cancelar o temporizador antigo e agendar outro para o novo horário. | Não permanece lembrete associado ao horário anterior. Conferir a lógica e simular a alteração. |

**PB-04 — fora da Sprint:** o filtro foi implementado como extensão do protótipo para demonstrar o comportamento solicitado e deixar a funcionalidade disponível, mas não faz parte da seleção estimada desta Sprint. A seleção formal continua sendo PB-01 + PB-03 = 3 períodos.

### Teste simulado

**Critério escolhido:** PB-01, critério verificável 1.

- **Pessoa usuária (Ana):** possui duas reservas da Sala 1 às 10h, uma em 10/11 e outra em 12/11. Solicita reagendar apenas a reserva de 10/11 para 11h.
- **Resposta simulada do aplicativo:** “Reserva da Sala 1 reagendada para 10/11 às 11:00.”
- **Registro do resultado:**

| Verificação | Resultado esperado | Resultado simulado | Situação |
|---|---|---|---|
| Identificação da sala | Sala 1 | Sala 1 | Passou |
| Identificação da data | 10/11 | 10/11 | Passou |
| Novo horário | 11h | 11:00 | Passou |
| Reserva de 12/11 | Continua às 10h | Continua às 10h | Passou |

**Conclusão:** o critério passa porque a confirmação identifica a sala, a data e o novo horário, permitindo reconhecer qual das duas reservas foi alterada. Este é um teste de cenário/documentação; a confirmação funcional deve também ser validada no protótipo conectado ao banco.

---

## 4. Refinamento final — informação nova sobre a data

Ana esclareceu que pode haver reservas em dias diferentes no mesmo horário. Por isso, a confirmação deve informar a data.

**Atualização feita sem mudar o ID:** PB-01 permanece PB-01 e continua estimado em 1 período.

- **Requisito atualizado:** após um reagendamento concluído, o aplicativo deve informar a Sala 1, a data específica da reserva alterada e o novo horário.
- **Critério atualizado:** dadas duas reservas da Sala 1 às 10h, uma em 10/11 e outra em 12/11, quando Ana reagendar somente a reserva de 10/11 para 11h, a mensagem deverá identificar “Sala 1”, “10/11” e “11h”; a reserva de 12/11 deverá permanecer inalterada.
- **Sprint Backlog:** PB-01 está selecionado. A ação de implementação e o teste de PB-01 foram ajustados para conferir a data, sem alterar a estimativa nem a Meta da Sprint.

---

## 5. Implementações realizadas no protótipo

### PB-01 — Confirmação detalhada

A mensagem após o reagendamento agora informa a sala, a data formatada e o novo horário. A lógica de conflito continua preservando a reserva original.

### PB-03 — Lembrete

A implementação existente foi aproveitada e ajustada:
- ao conceder permissão, o aplicativo consulta as reservas futuras do usuário e agenda os lembretes;
- o lembrete informa data e horário;
- ao reagendar, o temporizador antigo é cancelado e o novo é programado;
- o lembrete continua condicionado à permissão de notificações.

**Limitação técnica:** como o protótipo usa `setTimeout` no navegador, a página precisa permanecer aberta para o disparo. Fechar a aba ou o navegador interrompe o temporizador. A notificação em segundo plano exige uma implementação complementar.

### PB-04 — Filtro de horários

Foi adicionado à tela “Consultar horários” um seletor com:
- Todos os horários;
- Somente livres;
- Somente ocupados.

Quando não houver resultados para o filtro escolhido, a lista apresenta uma mensagem correspondente. O filtro atua na exibição e não altera as reservas no banco.

### Arquivos

- `index.html`: seletor do filtro na tela de consulta.
- `script.js`: confirmação detalhada, recuperação/agendamento de lembretes e filtro.
- `style.css`: mantido, pois a estrutura visual existente já comporta os novos controles.


