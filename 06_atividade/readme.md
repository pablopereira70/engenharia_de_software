# Sprint de Reagendamento — registros 06, 07, 09, 08 e 10

**Trio:** Carlos, Pedro, Pablo
**Disciplina:** Engenharia de Software
**Aplicativo:** Reservas de salas da biblioteca (Sala 1)

## Papéis assumidos

| Papel | Integrante |
|---|---|
| Product Owner | Carlos |
| Scrum Master | Pedro |
| Representante dos Developers | Pablo |

**Cenário comum a todas as etapas.**
Sala 1, mesmo dia: **10h reservada por Ana · 11h livre · 9h reservada por Bruno**.
Ana quer trocar a reserva das 10h para outro horário. Se o destino estiver ocupado, a reserva original tem que ser preservada.
O protótipo tem um **seletor "Quem está usando?"** (Ana / Bruno) para simular o login — sem ele não seria possível demonstrar o cenário com os dois estudantes.

---

## 06 — Cerimônias do Scrum

### Linha do tempo da Sprint (segunda a sexta)

| Dia | Evento | Pergunta que ele ajuda a responder no app |
|---|---|---|
| Segunda | **Planejamento da Sprint** | "O que queremos permitir que Ana faça até o fim da Sprint?" |
| Segunda a sexta | **Reunião Diária (15 min)** | "O que avançou em direção à troca de horário e o que está bloqueado hoje?" |
| Quarta (encenada) | **Reunião Diária (15 min)** | "A falha das duas telas impede a meta? Que ação tomamos agora?" |
| Quinta (perto do fim) | **Review da Sprint** | "O que Ana consegue fazer de fato, e o que o estudante que testou o app pediu de novo?" |
| Sexta (encerramento) | **Retrospectiva da Sprint** | "Como o trio trabalhou para achar a inconsistência, e o que vamos mudar no próximo ciclo?" |

**Papéis nesta etapa:** Carlos = PO · Pedro = SM · Pablo = Developers.
Quando uma etapa pede troca temporária (encenar estudante ou mais Developers), retomamos os papéis originais ao terminar.

---

## 07 — Planejamento da Sprint

### Meta da Sprint (uma frase)

> Permitir que Ana **troque a reserva da Sala 1 das 10h para um horário livre** em uma única operação, sem perder a reserva original quando o destino estiver ocupado, e ver o resultado coerente nas duas telas.

### Seleção para 5 períodos de capacidade

| Item | Comportamento | Períodos | Selecionado? |
|---|---|---|---|
| **A. Reagendamento básico** | Trocar para horário livre; preservar a reserva se o destino estiver ocupado; as duas telas refletem | 3 | ✅ |
| **B. Confirmação detalhada** | Mostrar a sala e o novo horário na mensagem de sucesso (depende de A) | 1 | ✅ |
| **C. Histórico de alterações** | Mostrar as trocas já feitas (depende de A) | 2 | ❌ adiado |

**Total estimado:** 3 + 1 = **4 períodos** (sobra 1 de folga, para o caso de a correção da Daily consumir tempo).

**Justificativa:**
- **A** é o item necessário para a meta — sem ele, Ana não consegue trocar o horário.
- **B** cabe na folga e melhora a confirmação que o estudante vê ao reagendar (depende de A).
- **C** ficou para depois porque depende de A e, sozinho, consumiria 2 dos 5 períodos; não é necessário para a meta desta Sprint.

### Plano de trabalho

| Ação | Resultado esperado |
|---|---|
| Desenhar/implementar a tela "Minhas reservas" com o botão **Reagendar** em cada reserva | Ana vê o botão ao lado da reserva das 10h |
| Desenhar/implementar a tela "Consultar horários" com 10h, 11h e 9h | As três horas aparecem com o estado real |
| Implementar o **seletor de usuário** (Ana / Bruno) | É possível trocar quem está usando o app sem login |
| Implementar o **diálogo de reagendamento** com escolha de nova hora | Ana escolhe 11h ou 9h e confirma |
| **Teste 1:** trocar 10h → 11h | Reserva passa para 11h; 10h livre; 11h ocupada; 9h ocupada |
| **Teste 2:** trocar 10h → 9h | Reserva continua às 10h; app avisa que o destino está ocupado; 10h e 9h ocupadas; 11h livre |

**Confirmação do Scrum Master (Pedro):** o plano cabe em 4 dos 5 períodos e cobre as duas situações (livre e ocupada).

---

## 09 — Reunião Diária

### Falha observada na quarta-feira

O rascunho do reagendamento já funcionava: Ana trocou das 10h para as 11h e a reserva mudou. Porém, ao conferir **as duas telas em conjunto**, o trio viu que:

- **"Minhas reservas"** mostrava 11h (correto);
- **"Consultar horários"** continuava mostrando **10h como Ocupado** (errado — devia estar Livre).

Cada tela guardava uma cópia dos dados, e a cópia de "Consultar horários" ficou velha.

### Encenação da Daily (2 minutos)

**Participantes:** Pablo e Carlos como Developers; Pedro como observador.

**Perguntas e respostas:**

1. **O que avançou em relação à meta?**  
   O reagendamento básico já grava a troca no banco e "Minhas reservas" reflete a mudança. Ana consegue trocar das 10h para as 11h.

2. **O que a falha impede?**  
   Quem consulta o horário logo depois vê 10h como Ocupado — decisão errada sobre a sala. A meta de "as duas telas refletem a decisão" ainda não foi atingida.

3. **Que ação deve acontecer agora?**  
   Corrigir a atualização das duas telas com uma função única (`atualizarTelas()`) e repetir os dois testes (livre e ocupado).

**Anotação do observador (Pedro):** a conversa terminou com **próxima ação clara** — corrigir e reexecutar os dois testes. ✅

### Renegociação da seleção

A correção + repetição dos testes acrescenta **2 períodos** ao item A. Nova conta:

| Item | Antes | Depois |
|---|---|---|
| A. Reagendamento básico | 3 | **5** |
| B. Confirmação detalhada | 1 | 1 (não cabe mais) |
| **Total** | 4 | **6** → estoura o limite de 5 |

**Decisão:** manter **A** na Sprint com os 5 períodos, **adiar B** para a próxima Sprint e **manter C adiado**. Assim, a meta continua visível e o limite de 5 não é ultrapassado.

- **Feito primeiro:** corrigir a atualização das duas telas.
- **Quem confere:** Pedro confere as duas telas em conjunto antes da demonstração.
- **Adiados:** B e C voltam para o Product Backlog.

### Resultado dos dois testes (após a correção)

Estado inicial de cada teste: **10h reservada por Ana · 11h livre · 9h reservada por Bruno**.

| Ação de Ana | Esperado em Minhas reservas | Esperado em Consultar horários | Ocorrido em Minhas reservas | Ocorrido em Consultar horários | Passou? |
|---|---|---|---|---|---|
| **Teste 1:** trocar 10h → 11h | Reserva passa para 11h | 10h **Livre**; 11h **Ocupado**; 9h **Ocupado** | Reserva foi para 11h | 10h **Livre**; 11h **Ocupado**; 9h **Ocupado** | ✅ |
| **Teste 2:** trocar 10h → 9h | Reserva continua às 10h; app avisa "destino ocupado" | 10h e 9h **Ocupados**; 11h **Livre** | Reserva ficou às 10h; aviso apareceu | 10h e 9h **Ocupados**; 11h **Livre** | ✅ |

**Sprint Backlog atualizado:** A (5 períodos) + B e C adiados.

---

## 08 — Review da Sprint

### Demonstração para a parte interessada

**Quem demonstrou:** Carlos (PO) conduzindo; Pablo (Developers) operando o app.
**Quem representou o estudante:** Pedro (SM) assumiu temporariamente o papel de estudante de outro trio.

**Roteiro da demonstração:**
1. Seletor de usuário em **Ana** → "Minhas reservas" mostra a reserva das 10h com o botão **Reagendar**.
2. Ana reagenda para **11h** → as duas telas atualizam; 10h fica **Livre**, 11h **Ocupado**, 9h continua **Ocupado**.
3. Ana tenta reagendar das 10h para **9h** (horário do Bruno) → app avisa "destino ocupado" e a reserva **continua às 10h**; as duas telas continuam coerentes.
4. Troca-se o seletor para **Bruno** → "Minhas reservas" mostra a reserva das 9h.

**Consideração:** o reagendamento básico está **concluído na simulação** — os dois testes passaram. A **confirmação detalhada (B)** ficou adiada por falta de período.

### Comentário do estudante (simulado)

> "Eu vi que a reserva foi alterada, mas tive de abrir Minhas reservas de novo para conferir qual ficou sendo o horário. Um lembrete também me ajudaria a não esquecer."

### Pergunta do Product Owner

**Carlos (PO):** "Quando você diz que precisou abrir 'Minhas reservas' de novo — a dúvida aparece **logo depois de reagendar**, na hora de confirmar, ou **mais tarde**, quando você vai usar a sala?"

**Resposta simulada do estudante:** "Na hora de confirmar mesmo. Eu queria ter certeza de que a troca deu certo para o horário novo, sem precisar ir para outra tela conferir."

### Distinção feita pelos Developers

| O que já existe | O que exigiria trabalho novo |
|---|---|
| Reagendamento funcional (A) com as duas telas coerentes | **Confirmação detalhada (B):** mostrar sala + data + novo horário na mensagem de sucesso |
| Aviso de destino ocupado preservando a reserva original | **Histórico de alterações (C):** mostrar as trocas feitas |
| Seletor de usuário (Ana / Bruno) | **Lembrete:** notificação antes do horário |

### Decisão sobre o Product Backlog

**Carlos (PO):** o próximo item de maior valor é a **Confirmação detalhada (B)** — ela ataca exatamente a dúvida que o estudante descreveu: ele quer confirmação clara **na hora da troca**, sem precisar abrir outra tela. B já estava no backlog e continua em primeiro.

**Sobre o lembrete:** entra no Product Backlog **agora, como novo item**, mas fica em posição posterior a B. Justificativa: o estudante também pediu, mas o problema dele na demonstração era de **confirmação**, não de esquecimento. O lembrete resolve outro problema e exige mais trabalho (notificação, horário de envio, reagendamento etc.).

**Ordem atualizada do Product Backlog:**

| Ordem | Item | Origem |
|---|---|---|
| 1 | B. Confirmação detalhada (sala + data + novo horário) | Já estava no backlog — agora em primeiro |
| 2 | Lembrete (notificação antes do horário) | **Novo item** vindo do feedback da Review |
| 3 | C. Histórico de alterações | Adiado do Planejamento |

**Atualização:** nenhum item foi duplicado. O lembrete entrou como item novo; B foi reordenado, não recriado.

---

## 10 — Retrospectiva da Sprint

### Fatos da Sprint

**Uma dificuldade:** o primeiro rascunho atualizava "Minhas reservas", mas "Consultar horários" mantinha o horário errado. O trio só percebeu quando **conferiu as duas telas em conjunto** — antes disso, cada tela parecia certa isoladamente.

**Uma prática que ajudou:** conferir as duas telas em conjunto antes de dizer que algo estava "pronto". Foi o que revelou a inconsistência.

### Classificação dos dois assuntos

| Assunto | Onde deve ser tratado | Por quê |
|---|---|---|
| Mostrar a sala e o novo horário na confirmação do reagendamento (B) | **Review** → entra/reordena no **Product Backlog** | Muda o **aplicativo** e o que o estudante vê. É decisão sobre o produto, tomada com a parte interessada. |
| Conferir as telas em conjunto antes da demonstração | **Retrospectiva** → vira **ação de melhoria do time** | Muda **a forma de trabalhar** do trio. Não depende do produto nem de parte interessada. |

### Ação de melhoria escolhida

**Sugestões dadas por cada integrante:**

- **Carlos:** "Antes da demonstração, conferir as duas telas em conjunto com o app aberto."
- **Pedro:** "Toda vez que uma tela for alterada, perguntar 'que outra tela depende disso?' antes de dizer que está pronto."
- **Pablo:** "Rodar os dois testes sempre que uma função de gravação for mexida, mesmo que pareça não afetar."

**Ação escolhida (a do Pedro, por ser verificável e cobrir o problema real):**

> Vamos **perguntar em voz alta "que outra tela depende dessa mudança?" toda vez que uma função de gravação for alterada.** Pablo vai combinar a execução até **a próxima Review**. Vamos verificar se ajudou olhando **quantas inconsistências entre telas apareceram só na demonstração** (meta: zero).

- **Ação:** perguntar em voz alta "que outra tela depende dessa mudança?" ao mexer em qualquer função de gravação.
- **Responsável:** Pablo (Developers) combina a execução.
- **Momento:** até a próxima Review.
- **Evidência:** número de inconsistências entre telas descobertas na demonstração (meta: **zero**).

---

## Protótipo (referência)

- **Telas:** "Minhas reservas" (com botão **Reagendar** em cada reserva) e "Consultar horários" (com 9h, 10h, 11h).
- **Seletor "Quem está usando?"** com Ana e Bruno — simula o login (necessário para o cenário, que envolve os dois estudantes).
- **Diálogo de reagendamento:** escolha da nova hora + **Confirmar** / **Voltar**.
- **Aviso de destino ocupado:** quando o horário escolhido já tem reserva ativa, a reserva original é preservada e o app avisa.
- **Confirmação de sucesso:** mensagem na tela (a versão detalhada com sala e data fica para a próxima Sprint — item B).

---

## Apresentação (5 a 7 minutos)

| Integrante | Papel | O que apresenta |
|---|---|---|
| **Pedro** | Scrum Master | A linha do tempo da Sprint e a melhoria da Retrospectiva ("que outra tela depende dessa mudança?"). |
| **Pablo** | Developers | O ajuste do plano na Daily (renegociação dos 5 períodos) e a demonstração dos dois testes (10h→11h e 10h→9h). |
| **Carlos** | Product Owner | A Meta da Sprint e a decisão da Review (B em primeiro, lembrete como item novo). |