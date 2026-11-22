// Atividade 03 — Reserva de Salas
// Consultar horários + Reservar sala, conectados ao Supabase.
// Novo nesta atividade: cancelar reserva (confirm), notificações com lembrete de 15 min e cores personalizáveis.

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
const listaHorarios = document.getElementById("listaHorarios");
const mensagem = document.getElementById("mensagem");
const painelReserva = document.getElementById("painelReserva");
const detalheReserva = document.getElementById("detalheReserva");
const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");
const btnVoltarReserva = document.getElementById("btnVoltarReserva");
const botaoNotificacoes = document.getElementById("ativarNotificacoes");
const inputCorFundo = document.getElementById("corFundo");
const inputCorCartao = document.getElementById("corCartao");

document.getElementById("usuarioAtual").textContent = USUARIO_ATUAL;

let horaSelecionada = null;

// 5. Funções auxiliares
function mostrarMensagem(texto, tipo = "info") {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

const hora5 = (horario) => horario.slice(0, 5);

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

    const inicio = new Date(`${data}T${hora5(horario)}:00`);
    const tempo = inicio.getTime() - Date.now() - (15 * 60 * 1000);   // 15 min antes

    if (tempo > 0 && tempo <= 2147483647) {
        const timer = setTimeout(() => {
            new Notification("Lembrete de reserva", {
                body: `Sua reserva da Sala 01 começa às ${hora5(horario)}.`
            });
            lembretesAgendados.delete(reservaId);
        }, tempo);

        lembretesAgendados.set(reservaId, timer);
    }
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
}

function desenharHorarios(reservas) {
    listaHorarios.replaceChildren();

    for (const hora of HORARIOS) {
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

        if (status.tipo === "meu") {
            const btnCancelar = document.createElement("button");
            btnCancelar.type = "button";
            btnCancelar.textContent = "Cancelar reserva";
            btnCancelar.className = "btn-perigo";
            btnCancelar.addEventListener("click", () => pedirCancelamento(status.reserva));
            acoes.appendChild(btnCancelar);
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
async function pedirCancelamento(reserva) {
    const confirmar = confirm(
        `Deseja realmente cancelar a reserva de ${reserva.usuario} no dia ${reserva.data_reserva}, às ${hora5(reserva.horario)}?`
    );

    if (!confirmar) return;

    await executarCancelamento(reserva);
}

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
atualizarTelas();
carregarCoresSalvas();
