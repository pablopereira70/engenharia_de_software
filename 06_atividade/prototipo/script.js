// Configuração — mesma base das atividades anteriores
const SUPABASE_URL = "https://phvhwnzvlzfpcjjigqpo.supabase.co";
const SUPABASE_KEY = "sb_publishable_OC_3Wtqj4sLEbhnC__S-LQ_I4J38l-Z";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Parâmetros da tela
const SALA_ID = 1;
const HORARIOS = ["09:00","10:00", "11:00"];

// Elementos
const seletorUsuario = document.getElementById("usuario");
const campoData = document.getElementById("data");
const listaReservas = document.getElementById("listaReservas");
const listaHorarios = document.getElementById("listaHorarios");
const mensagem = document.getElementById("mensagem");
const dialog = document.getElementById("dialogReagendar");
const detalheReserva = document.getElementById("detalheReserva");
const selectNovaHora = document.getElementById("novaHora");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnVoltar = document.getElementById("btnVoltar");

let reservaSelecionada = null;

// Data de hoje no fuso local (toISOString usa UTC e, no Brasil, vira "amanhã" após as 21h)
function dataLocalHoje() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
}

function mostrarMensagem(texto, ok) {
    mensagem.textContent = texto;
    mensagem.className = ok ? "ok" : "erro";
}

// --- Dados ---

async function listarMinhasReservas(usuario, data) {
    const { data: linhas, error } = await db
        .from("reservas")
        .select("id, usuario, horario, data_reserva")
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", data)
        .eq("usuario", usuario)
        .order("horario");

    if (error) throw error;
    return linhas ?? [];
}

async function listarHorasOcupadas(data) {
    const { data: linhas, error } = await db
        .from("reservas")
        .select("horario")
        .eq("sala_id", SALA_ID)
        .eq("data_reserva", data);

    if (error) throw error;
    return (linhas ?? []).map(l => l.horario.slice(0, 5));
}

// Troca o horário em uma única operação. Se o destino já estiver ocupado, o banco
// recusa (erro 23505) e a reserva original continua como estava.
async function reagendar(reservaId, novaHora) {
    const { data, error } = await db
        .from("reservas")
        .update({ horario: novaHora })
        .eq("id", reservaId)
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

// --- Desenho ---

function desenharMinhasReservas(reservas) {
    listaReservas.replaceChildren();

    if (reservas.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Nenhuma reserva para esta data.";
        listaReservas.appendChild(item);
        return;
    }

    for (const r of reservas) {
        const li = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = `${r.horario.slice(0, 5)} — ${r.usuario}`;

        const btn = document.createElement("button");
        btn.textContent = "Reagendar";
        btn.className = "btn-reagendar";
        btn.addEventListener("click", () => abrirDialogo(r));

        li.append(texto, btn);
        listaReservas.appendChild(li);
    }
}

function desenharHorarios(ocupadas) {
    listaHorarios.replaceChildren();

    for (const hora of HORARIOS) {
        const li = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = hora;

        const livre = !ocupadas.includes(hora);
        const badge = document.createElement("span");
        badge.textContent = livre ? "Livre" : "Ocupado";
        badge.className = "badge " + (livre ? "badge-livre" : "badge-ocupado");

        li.append(texto, badge);
        listaHorarios.appendChild(li);
    }
}

// --- Fonte única da verdade: toda gravação termina chamando esta função ---

async function atualizarTelas() {
    const data = campoData.value;
    if (!data) return;

    try {
        const [reservas, ocupadas] = await Promise.all([
            listarMinhasReservas(seletorUsuario.value, data),
            listarHorasOcupadas(data),
        ]);
        desenharMinhasReservas(reservas);
        desenharHorarios(ocupadas);
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao carregar os dados. Verifique o acesso ao banco.", false);
    }
}

// --- Diálogo de reagendamento ---

function abrirDialogo(reserva) {
    reservaSelecionada = reserva;
    detalheReserva.textContent = `${reserva.data_reserva} às ${reserva.horario.slice(0, 5)} — ${reserva.usuario}`;

    // Todos os horários, menos o atual. Os ocupados ficam disponíveis de propósito:
    // o Teste 2 escolhe um destino ocupado e o app precisa avisar.
    selectNovaHora.replaceChildren();
    for (const hora of HORARIOS) {
        if (hora !== reserva.horario.slice(0, 5)) {
            selectNovaHora.append(new Option(hora, hora));
        }
    }

    dialog.showModal();
}

btnVoltar.addEventListener("click", () => {
    dialog.close();
    reservaSelecionada = null;
});

btnConfirmar.addEventListener("click", async () => {
    if (!reservaSelecionada) return;

    const id = reservaSelecionada.id;
    const novaHora = selectNovaHora.value;

    dialog.close();
    reservaSelecionada = null;

    try {
        const resultado = await reagendar(id, novaHora);

        if (resultado.ok) {
            mostrarMensagem("Reserva reagendada com sucesso.", true);
        } else {
            mostrarMensagem("Esse horário já está ocupado. Sua reserva continua no horário original.", false);
        }

        await atualizarTelas();   // nos dois caminhos, para as duas telas continuarem coerentes
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível reagendar. Verifique o acesso ao banco.", false);
    }
});

// --- Inicialização ---

campoData.value = dataLocalHoje();
campoData.addEventListener("change", atualizarTelas);
seletorUsuario.addEventListener("change", atualizarTelas);
atualizarTelas();
