// Atividade 06 — Reagendamento (bloco 06 a 10)
// Consultar horários + Reservar sala, conectados ao Supabase.
// Novo nesta atividade: reagendar reserva em "Minhas reservas", preservando a original quando o destino está ocupado.

// 1. Configuração do Supabase
const SUPABASE_URL = "https://phvhwnzvlzfpcjjigqpo.supabase.co";
const SUPABASE_KEY = "sb_publishable_OC_3Wtqj4sLEbhnC__S-LQ_I4J38l-Z";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Simulação de login
// Troque o nome abaixo para testar outro usuário (ex.: "Bruno", "Júlia").
// Ele define quais horários aparecem como "Reservado por você".
const USUARIO_ATUAL = "Ana";

// 3. Parâmetros da sala
const SALA_ID = 1;
const HORARIOS = ["09:00", "10:00", "11:00"];

// 4. Elementos da página
const campoData = document.getElementById("data");
const filtroHorarios = document.getElementById("filtroHorarios");
const listaHorarios = document.getElementById("listaHorarios");
const mensagem = document.getElementById("mensagem");
const painelReserva = document.getElementById("painelReserva");
const detalheReserva = document.getElementById("detalheReserva");
const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");
const btnVoltarReserva = document.getElementById("btnVoltarReserva");
const botaoNotificacoes = document.getElementById("ativarNotificacoes");
const inputCorFundo = document.getElementById("corFundo");
const inputCorCartao = document.getElementById("corCartao");
const dialogCancelar = document.getElementById("dialogCancelar");
const detalheCancelar = document.getElementById("detalheCancelar");
const btnConfirmarCancelar = document.getElementById("btnConfirmarCancelar");
const btnVoltarCancelar = document.getElementById("btnVoltarCancelar");
const listaMinhas = document.getElementById("listaMinhas");
const dialogReagendar = document.getElementById("dialogReagendar");
const detalheReagendar = document.getElementById("detalheReagendar");
const selectNovaHora = document.getElementById("novaHora");
const btnConfirmarReagendar = document.getElementById("btnConfirmarReagendar");
const btnVoltarReagendar = document.getElementById("btnVoltarReagendar");

document.getElementById("usuarioAtual").textContent = USUARIO_ATUAL;

let horaSelecionada = null;
let reservaParaCancelar = null;
let reservaParaReagendar = null;

// 5. Funções auxiliares
function mostrarMensagem(texto, tipo = "info") {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

const hora5 = (horario) => horario.slice(0, 5);

function dataFormatada(data) {
    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

// Data de hoje no fuso local (toISOString usa UTC e, no Brasil, vira "amanhã" após as 21h)
function dataLocalHoje() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
}

function ehDoUsuario(reserva) {
    return (reserva.usuario ?? "").trim().toLowerCase() === USUARIO_ATUAL.trim().toLowerCase();
}

// Status de cada horário para o usuário logado:
//   livre   -> ninguém reservou
//   meu     -> reservado por USUARIO_ATUAL
//   ocupado -> reservado por outra pessoa
function statusDoHorario(hora, reservas) {
    const reserva = reservas.find(r => hora5(r.horario) === hora);

    if (!reserva) return { tipo: "livre", texto: "Livre", reserva: null };
    if (ehDoUsuario(reserva)) return { tipo: "meu", texto: "Reservado por você", reserva };
    return { tipo: "ocupado", texto: "Ocupado", reserva };
}

// 6. Notificações e lembretes (Notification API do navegador)
botaoNotificacoes.addEventListener("click", async () => {
    if (!("Notification" in window)) {
        mostrarMensagem("Seu navegador não suporta notificações.", "erro");
        return;
    }

    const permissao = await Notification.requestPermission();

    if (permissao === "granted") {
        mostrarMensagem("Notificações ativadas com sucesso!", "ok");
        botaoNotificacoes.textContent = "Notificações ativadas";
        botaoNotificacoes.disabled = true;
        await carregarLembretesDasMinhasReservas();
    } else {
        mostrarMensagem("Permissão para notificações não concedida.", "erro");
    }
});

// Lembretes agendados nesta aba: id da reserva -> id do setTimeout.
// Limitação: o setTimeout só existe enquanto a aba está aberta.
const lembretesAgendados = new Map();

function cancelarLembrete(reservaId) {
    clearTimeout(lembretesAgendados.get(reservaId));
    lembretesAgendados.delete(reservaId);
}

function agendarLembrete(reservaId, data, horario) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    // Evita manter dois lembretes para a mesma reserva após um reagendamento.
    cancelarLembrete(reservaId);

    const inicio = new Date(`${data}T${hora5(horario)}:00`);
    const tempo = inicio.getTime() - Date.now() - (15 * 60 * 1000);   // 15 min antes

    if (tempo > 0 && tempo <= 2147483647) {
        const timer = setTimeout(() => {
            new Notification("Lembrete de reserva", {
                body: `Sua reserva da Sala 1 é em ${dataFormatada(data)}, às ${hora5(horario)}.`
            });
            lembretesAgendados.delete(reservaId);
        }, tempo);

        lembretesAgendados.set(reservaId, timer);
    }
}

// Recupera os lembretes das reservas futuras do usuário quando a página é aberta
// ou quando ele concede a permissão de notificação.
async function carregarLembretesDasMinhasReservas() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const { data: reservas, error } = await db
        .from("reservas")
        .select("id, data_reserva, horario")
        .eq("sala_id", SALA_ID)
        .eq("usuario", USUARIO_ATUAL)
        .gte("data_reserva", dataLocalHoje());

    if (error) {
        console.error("Não foi possível carregar os lembretes:", error);
        return;
    }

    reservas.forEach(reserva => {
        agendarLembrete(reserva.id, reserva.data_reserva, reserva.horario);
    });
}

function notificarReserva(reservaId, usuario, data, horario) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    new Notification("Reserva confirmada!", {
        body: `${usuario}, sua reserva foi confirmada para ${data}, às ${hora5(horario)}.`
    });

    agendarLembrete(reservaId, data, horario);
}

// 7. Consultar: lê o banco e desenha a(s) tela(s) a partir da mesma consulta
async function atualizarTelas() {
    const data = campoData.value;
    if (!data) return;

    const { data: reservas, error } = await db
        .from("reservas")
        .select("id, usuario, horario, data_reserva")
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", data)
        .order("horario");

    if (error) {
        mostrarMensagem("Erro ao consultar reservas. Verifique o acesso ao banco.", "erro");
        console.error(error);
        return;
    }

    desenharHorarios(reservas);
    desenharMinhasReservas(reservas);
}

function desenharHorarios(reservas) {
    listaHorarios.replaceChildren();

    const filtro = filtroHorarios.value;
    const horariosVisiveis = HORARIOS.filter(hora => {
        const status = statusDoHorario(hora, reservas);

        if (filtro === "livres") return status.tipo === "livre";
        if (filtro === "ocupados") return status.tipo !== "livre";
        return true;
    });

    if (horariosVisiveis.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = filtro === "livres"
            ? "Não há horários livres nesta data."
            : "Não há horários ocupados nesta data.";
        listaHorarios.appendChild(vazio);
        return;
    }

    for (const hora of horariosVisiveis) {
        const status = statusDoHorario(hora, reservas);

        const item = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = hora;

        const selo = document.createElement("span");
        selo.textContent = status.texto;
        selo.className = `selo selo-${status.tipo}`;

        const acoes = document.createElement("span");
        acoes.className = "acoes-item";

        if (status.tipo !== "meu") {
            // O botão também aparece em horários ocupados: o banco recusa e o app avisa (Teste B).
            const btnReservar = document.createElement("button");
            btnReservar.type = "button";
            btnReservar.textContent = "Reservar";
            btnReservar.className = status.tipo === "livre" ? "btn-primario" : "btn-secundario";
            btnReservar.addEventListener("click", () => abrirReserva(hora));
            acoes.appendChild(btnReservar);
        }


        item.append(texto, selo, acoes);
        listaHorarios.appendChild(item);
    }
}

// 8. Tela "Reservar" (aninhada na consulta)
function abrirReserva(hora) {
    horaSelecionada = hora;
    detalheReserva.textContent = `${campoData.value} às ${hora} — ${USUARIO_ATUAL}`;
    painelReserva.hidden = false;
}

function fecharPainelReserva() {
    horaSelecionada = null;
    painelReserva.hidden = true;
}

btnVoltarReserva.addEventListener("click", fecharPainelReserva);

btnConfirmarReserva.addEventListener("click", async () => {
    if (!horaSelecionada) return;

    const data = campoData.value;
    const horario = horaSelecionada;
    fecharPainelReserva();

    mostrarMensagem("Processando reserva...");

    const { data: nova, error } = await db
        .from("reservas")
        .insert({
            sala_id: SALA_ID,
            usuario: USUARIO_ATUAL,
            data_reserva: data,
            horario: horario
        })
        .select("id")
        .single();

    if (error) {
        if (error.code === "23505") {
            mostrarMensagem("Esse horário já foi reservado!", "erro");
            await atualizarTelas();   // mostra quem ficou com o horário
        } else {
            mostrarMensagem("Não foi possível realizar a reserva.", "erro");
            console.error(error);
        }
        return;
    }

    mostrarMensagem("Reserva realizada com sucesso!", "ok");
    notificarReserva(nova.id, USUARIO_ATUAL, data, horario);

    await atualizarTelas();
});

// 9. Cancelar reserva
function pedirCancelamento(reserva) {
    reservaParaCancelar = reserva;
    detalheCancelar.textContent = `${reserva.data_reserva} às ${hora5(reserva.horario)} — ${reserva.usuario}`;
    dialogCancelar.showModal();
}

btnVoltarCancelar.addEventListener("click", () => {
    dialogCancelar.close();
    reservaParaCancelar = null;   // Voltar não altera nada
});

btnConfirmarCancelar.addEventListener("click", async () => {
    if (!reservaParaCancelar) return;

    const reserva = reservaParaCancelar;
    reservaParaCancelar = null;
    dialogCancelar.close();

    await executarCancelamento(reserva);
});

async function executarCancelamento(reserva) {
    const { data: removidas, error } = await db
        .from("reservas")
        .delete()
        .eq("id", reserva.id)
        .select("id");

    if (error) {
        mostrarMensagem("Erro ao cancelar a reserva.", "erro");
        console.error(error);
        return;
    }

    // Com RLS sem política de DELETE, o Supabase não dá erro: apenas não remove nada.
    if (!removidas || removidas.length === 0) {
        mostrarMensagem("Não foi possível cancelar: nenhuma reserva foi removida. O acesso ao banco pode estar bloqueado (política DELETE).", "erro");
        return;
    }

    cancelarLembrete(reserva.id);   // reserva cancelada não deve gerar lembrete

    mostrarMensagem("Reserva cancelada com sucesso! O horário voltou a ficar livre.", "ok");
    await atualizarTelas();
}

// 10. Tela "Minhas reservas" (desenhada a partir da mesma consulta da tela de horários)
function desenharMinhasReservas(reservas) {
    listaMinhas.replaceChildren();

    const minhas = reservas.filter(ehDoUsuario);

    if (minhas.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Você não tem reservas nesta data.";
        listaMinhas.appendChild(vazio);
        return;
    }

    for (const reserva of minhas) {
        const item = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = `${hora5(reserva.horario)} — Sala 1`;

        const acoes = document.createElement("span");
        acoes.className = "acoes-item";

        const btnReagendar = document.createElement("button");
        btnReagendar.type = "button";
        btnReagendar.textContent = "Reagendar";
        btnReagendar.className = "btn-primario";
        btnReagendar.addEventListener("click", () => abrirReagendamento(reserva));
        acoes.appendChild(btnReagendar);

        const btnCancelar = document.createElement("button");
        btnCancelar.type = "button";
        btnCancelar.textContent = "Cancelar";
        btnCancelar.className = "btn-perigo";
        btnCancelar.addEventListener("click", () => pedirCancelamento(reserva));
        acoes.appendChild(btnCancelar);

        item.append(texto, acoes);
        listaMinhas.appendChild(item);
    }
}

// 11. Reagendar reserva
async function abrirReagendamento(reserva) {
    reservaParaReagendar = reserva;
    detalheReagendar.textContent = `${dataFormatada(reserva.data_reserva)} — ${hora5(reserva.horario)} — ${reserva.usuario}`;

    // Busca os horários já ocupados na mesma sala e na mesma data.
    // A própria reserva é excluída da consulta para não bloquear a alteração dela.
    const { data: reservasNoDia, error } = await db
        .from("reservas")
        .select("id, horario")
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", reserva.data_reserva)
        .neq("id", reserva.id);

    if (error) {
        console.error("Erro ao consultar horários para reagendamento:", error);
        mostrarMensagem("Não foi possível consultar os horários disponíveis.", "erro");
        return;
    }

    const horariosOcupados = new Set(reservasNoDia.map(r => hora5(r.horario)));
    selectNovaHora.replaceChildren();

    for (const hora of HORARIOS) {
        if (hora !== hora5(reserva.horario) && !horariosOcupados.has(hora)) {
            selectNovaHora.append(new Option(hora, hora));
        }
    }

    if (selectNovaHora.options.length === 0) {
        mostrarMensagem("Não há outros horários livres para essa data.", "erro");
        reservaParaReagendar = null;
        return;
    }

    dialogReagendar.showModal();
}

// Confere novamente o destino na mesma sala/data, ignorando a própria reserva,
// antes de atualizar. O índice único do banco continua protegendo contra concorrência.
async function reagendar(reserva, novaHora) {
    const { data: conflito, error: erroConsulta } = await db
        .from("reservas")
        .select("id")
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", reserva.data_reserva)
        .eq("horario", novaHora)
        .neq("id", reserva.id)
        .maybeSingle();

    if (erroConsulta) throw erroConsulta;
    if (conflito) return { ok: false, motivo: "destino-ocupado" };

    const { data, error } = await db
        .from("reservas")
        .update({ horario: novaHora })
        .eq("id", reserva.id)
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", reserva.data_reserva)
        .select("id");

    if (error && error.code === "23505") {
        return { ok: false, motivo: "destino-ocupado" };
    }
    if (error) throw error;

    // Com RLS sem política de UPDATE, o Supabase não dá erro: apenas não altera nada.
    if (!data || data.length === 0) {
        throw new Error("Nenhuma reserva foi alterada (verifique a política UPDATE do Supabase).");
    }
    return { ok: true };
}

btnVoltarReagendar.addEventListener("click", () => {
    dialogReagendar.close();
    reservaParaReagendar = null;
});

btnConfirmarReagendar.addEventListener("click", async () => {
    if (!reservaParaReagendar) return;

    const reserva = reservaParaReagendar;
    const novaHora = selectNovaHora.value;

    reservaParaReagendar = null;
    dialogReagendar.close();

    try {
        const resultado = await reagendar(reserva, novaHora);

        if (resultado.ok) {
            mostrarMensagem(
                `Reserva da Sala 1 reagendada para ${dataFormatada(reserva.data_reserva)} às ${hora5(novaHora)}.`,
                "ok"
            );
            cancelarLembrete(reserva.id);                                   // some o lembrete do horário antigo
            agendarLembrete(reserva.id, reserva.data_reserva, novaHora);    // e cria o do novo horário
        } else {
            mostrarMensagem("Esse horário já está ocupado. Sua reserva continua no horário original.", "erro");
        }

        await atualizarTelas();   // nos dois caminhos, as duas telas continuam coerentes
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível reagendar. Verifique o acesso ao banco.", "erro");
    }
});

// 12. Personalizar e salvar cores
function carregarCoresSalvas() {
    const corFundoSalva = localStorage.getItem("corFundo");
    const corCartaoSalva = localStorage.getItem("corCartao");

    if (corFundoSalva) {
        document.documentElement.style.setProperty("--cor-fundo", corFundoSalva);
        inputCorFundo.value = corFundoSalva;
    }

    if (corCartaoSalva) {
        document.documentElement.style.setProperty("--cor-cartao", corCartaoSalva);
        inputCorCartao.value = corCartaoSalva;
    }
}

inputCorFundo.addEventListener("input", () => {
    const novaCor = inputCorFundo.value;
    document.documentElement.style.setProperty("--cor-fundo", novaCor);
    localStorage.setItem("corFundo", novaCor);
});

inputCorCartao.addEventListener("input", () => {
    const novaCor = inputCorCartao.value;
    document.documentElement.style.setProperty("--cor-cartao", novaCor);
    localStorage.setItem("corCartao", novaCor);
});

// Inicialização
campoData.value = dataLocalHoje();
campoData.addEventListener("change", () => {
    fecharPainelReserva();
    mostrarMensagem("");
    atualizarTelas();
});

filtroHorarios.addEventListener("change", atualizarTelas);

atualizarTelas();
carregarCoresSalvas();
carregarLembretesDasMinhasReservas();
