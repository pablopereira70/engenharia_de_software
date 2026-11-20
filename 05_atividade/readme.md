# Atividade 05 — Time Scrum: duas telas, um só comportamento

**Trio:** Pablo Leon, Pedro Eugênio, Carlos Daniel
**Cenário:** Ana quer cancelar a reserva da Sala 1 às 10h; outro estudante deve ver o horário liberado. A falha que vamos reproduzir e corrigir é: "Minhas reservas" mostra a reserva cancelada, mas "Consultar horários" continua mostrando 10h como Ocupado.

---

## 05.A — Papéis e plano da Sprint

| Papel | Integrante |
|---|---|
| Product Owner | Carlos Daniel |
| Scrum Master | Pablo Leon |
| Developers | Pedro |

> Cada papel deve ter uma pessoa diferente do trio. Preencher conforme a rodada realizada.

**Meta da Sprint:** permitir que Ana cancele a reserva da Sala 1 às 10h e que o horário apareça como **Livre** para outro estudante, nas duas telas, sem recarregar a página.

| Ação | Quem conduz | Quem ajuda |
|---|---|---|
| Definir o comportamento esperado nas duas telas | PO | Developers |
| Desenhar/implementar "Minhas reservas" com Confirmar e Voltar | Developers | SM |
| Conferir o fluxo completo (cancelar → liberar horário) | SM | PO |

---

## 05.B — "Minhas reservas" com Confirmar e Voltar

Implementado em `prototipo/index.html` + `prototipo/script.js`, acrescentando à tela "Consultar horários" (da Atividade 04) uma segunda tela:

- **Minhas reservas** lista as reservas do usuário simulado (`USUARIO_ATUAL`) na data escolhida, cada uma com o botão **Cancelar** (que saiu da grade de horários e veio para esta tela).
- Ao clicar, abre o `<dialog>` com "Cancelar esta reserva?" e os botões **Voltar** e **Confirmar** (o mesmo diálogo da Atividade 04).
- **Voltar** fecha o diálogo sem alterar nada.
- **Confirmar** apaga a reserva no Supabase e atualiza as duas telas.

---

## 05.C — Reproduzir a inconsistência de propósito

Para demonstrar a falha na apresentação, a versão "com defeito" guarda a lista de reservas em memória e atualiza **só** "Minhas reservas" depois de cancelar:

```js
// VERSÃO COM DEFEITO (só para a demonstração; não está no protótipo entregue)
let reservasEmMemoria = [];

async function iniciar() {
    reservasEmMemoria = await buscarReservas(campoData.value);   // só uma vez, ao abrir
    desenharHorarios(reservasEmMemoria);
}

// no botão Confirmar, em vez de atualizarTelas():
await executarCancelamento(reserva);                             // aqui só apaga no banco
desenharMinhasReservas(await buscarReservas(campoData.value));   // só esta tela
```

Resultado: depois de confirmar, "Minhas reservas" já não mostra a reserva, mas "Consultar horários" continua mostrando 10h como **Reservado por você** (e como **Ocupado** para outro estudante) até a página ser recarregada. Cada tela tinha a sua própria cópia dos dados, e a cópia de "Consultar horários" ficou velha.

---

## 05.D — Conversa e ajuste do plano

| Pergunta | Registro |
|---|---|
| Qual o impacto para quem quer reservar? (PO) | Um estudante que consulta o horário vê 10h como Ocupado e desiste, embora a sala esteja livre. |
| O que precisa mudar? (SM) | As telas não podem guardar cópias dos dados: depois de qualquer gravação, as duas precisam ser redesenhadas a partir do banco. |
| Plano ajustado (Developers) | Trocar a atualização individual por uma função única, `atualizarTelas()`, chamada depois de cancelar; depois conferir as duas telas em conjunto. |

---

## 05.E — Correção: fonte única da verdade

O banco de dados passou a ser a única fonte da verdade. A função `atualizarTelas()` faz **uma única consulta** ao Supabase e redesenha as duas telas a partir dela:

```js
async function atualizarTelas() {
    const data = campoData.value;
    if (!data) return;

    const { data: reservas, error } = await db
        .from("reservas")
        .select("id, usuario, horario, data_reserva")
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", data)
        .order("horario");

    if (error) { /* mostra mensagem de erro */ return; }

    desenharHorarios(reservas);          // tela "Consultar horários"
    desenharMinhasReservas(reservas);    // tela "Minhas reservas" (só as do USUARIO_ATUAL)
}
```

Ela é chamada ao abrir a página, ao mudar a data e logo depois de qualquer gravação (reservar ou cancelar). Além disso, `executarCancelamento()` confere se o Supabase realmente removeu a linha: com RLS sem política de `DELETE`, o banco não devolve erro, apenas não apaga nada, e o app chegaria a dizer que cancelou sem ter cancelado.

---

## 05.F — Casos de teste

Estado inicial de cada caso: reserva de Ana às 10h ativa na data escolhida; 10h aparece como **Reservado por você** em "Consultar horários" (e como **Ocupado** para outro usuário).

| Caso | Ação | Esperado em "Minhas reservas" | Esperado em "Consultar horários" | Observado | Passou? |
|---|---|---|---|---|---|
| A | Cancelar → **Confirmar** | A reserva das 10h some da lista | 10h aparece como **Livre** | *(preencher)* | *(preencher)* |
| B | Cancelar → **Voltar** | A reserva das 10h continua na lista | 10h continua **Reservado por você** (e **Ocupado** para outro usuário) | *(preencher)* | *(preencher)* |

Executar os dois casos, anotando o que apareceu de fato nas duas telas, e repor o estado inicial (recriar a reserva das 10h) entre um caso e outro.

---

## 05.G — Definição de Pronto (versão 1)

Um item só é considerado pronto quando:

1. Os testes cobrem o caso em que o usuário **conclui** a ação e o caso em que ele **desiste** (Confirmar e Voltar).
2. As duas telas afetadas foram conferidas **em conjunto** depois da mudança.

---

## Apresentação (3 a 5 minutos)

| Integrante | O que apresenta |
|---|---|
| Integrante 1 | A meta e o problema (reserva cancelada, horário ainda ocupado). |
| Integrante 2 | Como o plano foi reorganizado depois de a falha aparecer. |
| Integrante 3 | A correção nas duas telas e os resultados dos casos A e B. |
