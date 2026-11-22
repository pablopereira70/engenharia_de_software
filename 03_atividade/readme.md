# Engenharia de Software — Atividade 03 (Product Owner e Product Backlog)
**Projeto:** Sistema de Reserva de Salas da Biblioteca  
**Tecnologias do Protótipo:** HTML, CSS, JavaScript, Supabase e Vercel  

---

## 1. Resumo dos Incrementos Realizados no Protótipo

Durante o desenvolvimento prático do sistema, os três itens previstos no *Product Backlog* foram implementados e validados no código (`index.html`, `style.css`, `script.js`) e no banco de dados (Supabase). O protótipo acumula o que veio da Atividade 02 (consultar horários e reservar, com o login simulado `USUARIO_ATUAL`) e acrescenta:

1. **Enviar lembrete (Notificações):**
   * Implementado com a *Notification API* nativa do navegador (`Notification.requestPermission()`).
   * Ao confirmar uma reserva, o sistema dispara uma notificação imediata e programa um temporizador (`setTimeout`) para enviar um lembrete automático **15 minutos antes** do horário agendado.
   * Se a reserva for cancelada na mesma aba, o temporizador é desfeito (`clearTimeout`), para não avisar sobre uma reserva que não existe mais.
   * Limitação: o `setTimeout` só existe enquanto a aba está aberta. Lembretes que sobrevivam ao fechamento da página exigiriam um serviço no servidor.
2. **Cancelar reserva:**
   * Adicionado um botão **"Cancelar reserva"** gerado dinamicamente em `desenharHorarios()` para cada horário **"Reservado por você"** na tela Consultar horários.
   * Ao clicar e confirmar na caixa de diálogo (`confirm`), a função `executarCancelamento()` executa a exclusão do registro específico no Supabase (`.delete().eq("id", reserva.id).select("id")`), liberada após a configuração da política de segurança **RLS (`DELETE`)** na tabela `reservas`.
   * A tela é redesenhada automaticamente (`atualizarTelas()`), liberando o horário.
3. **Personalizar as cores:**
   * Substituição das cores fixas por variáveis globais CSS (`:root` com `--cor-fundo` e `--cor-cartao`) no `style.css`.
   * Inclusão de seletores nativos `<input type="color">` no `index.html` conectados ao JavaScript para alteração em tempo real e salvamento automático das preferências no navegador via `localStorage`.

---

## 2. Atividade 1 — Primeira Decisão do Product Owner

### Meta do Produto
> Garantir que os estudantes da instituição consigam consultar, reservar e utilizar as salas de estudo da biblioteca com pontualidade, autonomia e máximo aproveitamento dos horários disponíveis.

### Ordenação Inicial do Product Backlog
1. **Item A — Enviar lembrete** *(Prioridade 1)*
2. **Item B — Cancelar reserva** *(Prioridade 2)*
3. **Item C — Personalizar as cores** *(Prioridade 3)*

### Justificativa da Decisão (em duas frases)
O envio de lembrete (Item A) deve ser desenvolvido agora porque ataca diretamente o problema concreto identificado na semana — cinco estudantes que chegaram atrasados por esquecerem o horário — aproveitando que o aplicativo já possui base técnica para notificações. Por outro lado, a personalização de cores (Item C) pode esperar porque representa apenas um ajuste visual que não interfere na pontualidade dos alunos nem na disponibilidade das salas de estudo.

---

## 3. Atividade 2 — Revisão da Decisão com Fato Novo

### Atualização do Cenário (Fato Novo)
Nenhuma das melhorias havia sido implementada ainda quando a biblioteca descobriu que, na mesma semana, **oito reservas ficaram sem uso**: os estudantes avisaram informalmente que não iriam, mas os horários permaneceram bloqueados no aplicativo, impedindo outros alunos de reservarem as salas.

### Ordem Revisada do Product Backlog
1. **Item B — Cancelar reserva** *(Subiu de 2º para 1º)*
2. **Item A — Enviar lembrete** *(Desceu de 1º para 2º)*
3. **Item C — Personalizar as cores** *(Mantido em 3º)*

### O que mudou e como a 1ª melhoria ajuda na Meta do Produto
* **O que mudou:** Houve inversão entre as duas primeiras posições — **Cancelar reserva (Item B)** passou a ser a prioridade número 1, enquanto **Enviar lembrete (Item A)** foi movido para segundo lugar e **Personalizar as cores (Item C)** permaneceu em terceiro.
* **Relação com o fato novo e com a Meta do Produto:** O fato novo evidenciou um gargalo mais grave que os cinco atrasos: **oito salas ficaram totalmente ociosas e bloqueadas** porque os estudantes desistentes não tinham meios de liberar o horário no sistema, fazendo outros alunos encontrarem todas as salas ocupadas. Priorizar o cancelamento elimina esse desperdício de capacidade e devolve horários livres em tempo real, cumprindo diretamente a Meta do Produto de garantir o máximo aproveitamento das salas da biblioteca.

---

## 4. Demonstração do Comportamento Escolhido (Cancelar Reserva)

### Visão do Product Owner (Benefício Esperado)
Com a funcionalidade de cancelamento disponível diretamente na lista de reservas do dia, o estudante que desistir de usar a sala pode liberar o horário com poucos cliques. O benefício imediato é o fim dos "horários fantasmas" bloqueados, permitindo que outros estudantes visualizem a disponibilidade real e ocupem a sala.

### Visão do Representante dos Developers (Fluxo e Simulação de Tela)

#### Fluxo de Interação (Estudante ↔ Aplicativo)
1. O estudante (definido em `USUARIO_ATUAL`) seleciona a **Data**; o sistema consulta o Supabase e mostra a tela **"Consultar horários"** com o status de cada horário: **Livre**, **Ocupado** (de outra pessoa) ou **Reservado por você**.
2. Ao lado do horário "Reservado por você", o estudante clica em **"Cancelar reserva"**.
3. O aplicativo exibe uma caixa de confirmação:  
   > *"Deseja realmente cancelar a reserva de [Nome] no dia [Data], às [Horário]?"*
4. O estudante confirma (**OK**). O JavaScript envia o comando `DELETE` filtrando pelo `id` da reserva no Supabase.
5. O aplicativo exibe a mensagem **"Reserva cancelada com sucesso! O horário voltou a ficar livre."** e redesenha a tela.
6. **Visão de quem consulta depois:** ao selecionar a mesma data (com outro usuário), o horário cancelado aparece como **Livre** e pode ser reservado por qualquer outro estudante.

#### Simulação Visual da Tela (Estado Antes e Depois)

```text
+-------------------------------------------------------+
|                  Reserva de Salas                     |
|  Logado como: Ana                                     |
|                                                       |
|  Consultar horários — Sala 1                          |
|  Data: [ 2026-11-16 ]                                 |
|                                                       |
|  09:00  [Ocupado]                     [ Reservar ]    |
|  10:00  [Livre]                       [ Reservar ]    |
|  11:00  [Reservado por você]    [ Cancelar reserva ]  |
|                                                       |
|  Reserva cancelada com sucesso! O horário voltou      |
|  a ficar livre.                                       |
|  (O horário das 10:00 foi cancelado e está livre)     |
+-------------------------------------------------------+
```

### Visão do Scrum Master (Conferência do Trio)
* **Verificação:** O trio conferiu o comportamento implementado em relação à justificativa da revisão e validou que o fluxo resolve integralmente o problema dos oito horários ociosos: a exclusão reflete imediatamente no banco de dados (Supabase) e na interface, sem depender de intervenção manual da equipe da biblioteca.