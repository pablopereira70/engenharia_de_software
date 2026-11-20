// Atividade 02 — Consultar e Reservar
// Consultar horários + Reservar sala, conectados ao Supabase.
// Novo nesta atividade: tela "Reservar" aninhada na consulta, dados do banco e status por usuário (USUARIO_ATUAL).

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

    await atualizarTelas();
});

// Inicialização
campoData.value = dataLocalHoje();
campoData.addEventListener("change", () => {
    fecharPainelReserva();
    mostrarMensagem("");
    atualizarTelas();
});
atualizarTelas();
