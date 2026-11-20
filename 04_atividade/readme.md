# Atividade 04 — Scrum Master: encaminhar um impedimento

**Trio:** Pablo, Pedro, Carlos
**Disciplina:** Engenharia de Software
**Cenário:** o app da biblioteca já permite reservar salas. A Meta da Sprint é permitir que o estudante cancele uma reserva e que o horário volte a ficar disponível para outra pessoa. O representante dos Developers está pronto para testar o cancelamento, mas a conta de teste perdeu o acesso ao ambiente de teste. Somente a equipe de suporte pode restabelecer esse acesso.

---

## 1. Papéis (rodada 1)

| Papel | Integrante |
|---|---|
| Scrum Master | Pablo |
| Product Owner | Carlos |
| Representante dos Developers | Pedro |

---

## 2. Conversa de dois minutos — perguntas do Scrum Master

**Pergunta 1 (esclarecer o que ficou bloqueado):**
> "Qual teste exatamente você não consegue executar agora, e o que acontece quando você tenta cancelar uma reserva no ambiente de teste?"

**Pergunta 2 (decidir quem age e como acompanhar):**
> "Quem pode restabelecer esse acesso, e qual verificação concreta vamos fazer para saber que o problema foi resolvido?"

**Respostas na encenação:**
- **PO:** ao cancelar, a reserva deve deixar de constar como ativa (no protótipo, o registro é excluído) e o horário deve voltar a aparecer como **Livre** para outro estudante. Liberar o horário tem valor porque devolve a sala à biblioteca.
- **Developers:** o teste bloqueado é o do cancelamento (reserva da Sala 1 às 10h). O próximo passo é preparar o caso de teste e o fluxo da tela de confirmação enquanto o acesso não volta.
- **SM:** encaminha ao suporte, registra quem aciona e combina quando conferir a resposta.

---

## 3. Registro do impedimento

| Campo | Registro |
|---|---|
| **Impedimento** | A conta de teste perdeu o acesso ao ambiente de teste (leitura e escrita bloqueadas). |
| **Trabalho bloqueado** | Testar o cancelamento de reserva no ambiente de teste. |
| **Efeito na Meta da Sprint** | Sem o teste, não dá para confirmar que o cancelamento libera o horário — que é exatamente o objetivo da Sprint. |
| **Ação combinada** | O SM aciona o suporte; enquanto isso, os Developers adiantam o caso de teste e o fluxo da tela. |
| **Quem aciona o suporte** | Pablo |
| **Quando verificar a resposta** | Assim que o suporte responder; a verificação está descrita no item 8. |

---

## 4. Mensagem simulada ao suporte

> Olá, suporte. Somos o trio Pablo, Pedro e Carlos da disciplina de Engenharia de Software. A conta de teste do app de reservas da biblioteca perdeu o acesso ao ambiente de teste — não conseguimos ler nem gravar reservas. Sem esse acesso, não conseguimos testar o cancelamento de reservas, que é a meta da Sprint atual. Vocês conseguem restabelecer o acesso até amanhã? Assim que possível, avisem para retomarmos o teste.

---

## 5. Troca de papéis e nova conversa

| Papel (rodada 2) | Integrante |
|---|---|
| Scrum Master | Carlos |
| Product Owner | Pedro |
| Representante dos Developers | Pablo |

**Perguntas do novo Scrum Master:**
1. "O que o time consegue adiantar hoje, sem depender do acesso ao ambiente de teste?"
2. "Como vamos saber, na prática, que o acesso voltou?"

**Respostas na encenação:**
- **PO:** o comportamento esperado continua o mesmo — cancelar a reserva da Sala 1 às 10h deve liberar o horário para outro estudante.
- **Developers:** dá para adiantar hoje o caso de teste e o desenho da confirmação de cancelamento; o que depende do suporte é executar o teste no ambiente de teste.
- **SM:** registra o plano ajustado e a forma de verificação (item 8).

---

## 6. Plano ajustado

| Posso fazer hoje (não depende do suporte) | Depende do suporte |
|---|---|
| Escrever o caso de teste do cancelamento com a reserva fictícia da Sala 1 às 10h. | Executar o teste de cancelamento no ambiente de teste. |
| Desenhar (ou escrever o fluxo da) tela de confirmação de cancelamento. | Conferir que o horário volta a aparecer como **Livre** para outro estudante. |
| Registrar o comportamento esperado nas duas telas. | — |

---

## 7. Fluxo de cancelamento (descrição)

**Reserva fictícia:** Sala 1, 10/11/2026, às 10h, de Ana.

**Na tela "Consultar horários" (com `USUARIO_ATUAL = "Ana"`):**
1. Ana vê o horário das 10h como **Reservado por você** (Sala 1, 10/11), com o botão **Cancelar reserva**.
2. Ao clicar, aparece a confirmação: "Cancelar esta reserva?" com os botões **Confirmar** e **Voltar**.
3. **Voltar** fecha a confirmação sem alterar nada — a reserva continua ativa.
4. **Confirmar** cancela: o horário das 10h deixa de aparecer como "Reservado por você" e passa a **Livre**.

**Quando outra pessoa consulta o horário:**
- A consulta da Sala 1 em 10/11 deve mostrar **10h Livre** (as demais horas como estavam: 11h livre, 9h ocupada por Bruno).

---

## 8. Como verificar a remoção do impedimento

O impedimento continua **aberto** enquanto o acesso estiver indisponível. O trio vai considerar resolvido quando:

1. O suporte avisar que o acesso foi restabelecido.
2. O app abrir normalmente no ambiente de teste e o teste abaixo passar.

**Teste a executar depois da liberação:**
Com a reserva fictícia da Sala 1 às 10h ativa, cancelar e conferir duas coisas:
- Para Ana, o horário das 10h deixa de aparecer como "Reservado por você".
- Para outro usuário (por exemplo, `USUARIO_ATUAL = "Bruno"`), o horário das 10h aparece como **Livre**.

Se os dois pontos acontecerem, o impedimento foi removido e a Meta da Sprint pode ser verificada.

---

## 9. Roteiro de apresentação (3 a 5 minutos)

| Integrante | O que apresenta |
|---|---|
| Integrante 1 | Encena a primeira conversa (as duas perguntas do SM) e explica qual era o impedimento. |
| Integrante 2 | Mostra o registro do impedimento, a mensagem ao suporte e o plano ajustado. |
| Integrante 3 | Mostra o fluxo de cancelamento e explica como o trio vai verificar se o acesso voltou e qual teste executará depois. |

---

## Protótipo

Código em [`prototipo/`](prototipo/): é o app da Atividade 03 (consultar, reservar, cancelar, lembretes e cores, com o login simulado `USUARIO_ATUAL`), em que o cancelamento passa a pedir confirmação em um `<dialog>` com **Confirmar** e **Voltar**, e confere se o Supabase realmente removeu a reserva (com RLS sem política de `DELETE`, o banco não dá erro; apenas não remove nada). É esse comportamento que reproduz o impedimento do cenário.

---

## Checklist de entregáveis (do PDF)

- [x] Perguntas das **duas** conversas.
- [x] Registro do impedimento (impedimento, efeito na meta, ação combinada, quem aciona, quando verificar).
- [x] Mensagem simulada ao suporte.
- [x] Plano ajustado ("posso fazer hoje" × "depende do suporte").
- [x] Desenho ou fluxo de cancelamento (reserva fictícia da Sala 1 às 10h).
- [x] Forma de verificar a remoção do impedimento e teste a executar depois.
- [x] Roteiro de apresentação de 3 a 5 minutos.