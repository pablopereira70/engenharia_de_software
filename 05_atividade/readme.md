# Atividade 05 — Time Scrum: duas telas, um só comportamento

**Trio:** [NOME 1], [NOME 2], [NOME 3]
**Cenário:** Ana quer cancelar a reserva da Sala 1 às 10h; outro estudante deve ver o horário liberado. A falha que vamos reproduzir e corrigir é: "Minhas reservas" mostra a reserva cancelada, mas "Consultar horários" continua mostrando 10h como Ocupado.

---

## 05.A — Papéis e plano da Sprint

| Papel | Integrante |
|---|---|
| Product Owner | [NOME] |
| Scrum Master | [NOME] |
| Developers | [NOME], [NOME] |

**Meta da Sprint:** permitir que Ana cancele a reserva da Sala 1 às 10h e que o horário apareça como **Livre** para outro estudante, nas duas telas, sem recarregar a página.

| Ação | Quem conduz | Quem ajuda |
|---|---|---|
| Definir o comportamento esperado nas duas telas | PO | Developers |
| Desenhar/implementar "Minhas reservas" com Confirmar e Voltar | Developers | SM |
| Conferir o fluxo completo (cancelar → liberar horário) | SM | PO |

---

## 05.B — "Minhas reservas" com Confirmar e Voltar

Implementado em `index.html` + `script.js`:

- Cada reserva de Ana tem um botão **Cancelar**.
- Ao clicar, abre um `<dialog>` com a pergunta "Cancelar esta reserva?" e os botões **Voltar** e **Confirmar**.
- **Voltar** fecha o diálogo sem alterar nada.
- **Confirmar** apaga a reserva no Supabase e atualiza as duas telas.

---

## 05.C — Reproduzir a inconsistência de propósito

Para demonstrar a falha na apresentação, a versão "com defeito" guarda a lista de ocupados em memória e atualiza **só** "Minhas reservas" depois de cancelar:

```js
// VERSÃO COM DEFEITO (não entregar)
const estado = { ocupados: [] };

async function iniciar() {
    estado.ocupados = await listarHorasOcupadas(SALA_ID, campoData.value);
    desenharHorarios(estado.ocupados);
}

// no botão Confirmar, em vez de atualizarTelas():
await cancelarReserva(id);
const reservas = await listarMinhasReservas(USUARIO_ATUAL);
desenharMinhasReservas(reservas);   // só esta tela