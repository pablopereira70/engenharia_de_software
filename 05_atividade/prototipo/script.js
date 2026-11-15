// Configuração — mesma base da Atividade 04
const SUPABASE_URL = "https://phvhwnzvlzfpcjjigqpo.supabase.co";
const SUPABASE_KEY = "sb_publishable_OC_3Wtqj4sLEbhnC__S-LQ_I4J38l-Z";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Parâmetros da tela
const SALA_ID = 1;
const HORARIOS = ["10:00", "11:00", "14:00"];
const USUARIO_ATUAL = "Ana";

// Elementos
const campoData = document.getElementById("data");
const listaReservas = document.getElementById("listaReservas");
const listaHorarios = document.getElementById("listaHorarios");
const mensagem = document.getElementById("mensagem");
const dialog = document.getElementById("dialogCancelar");
const detalheReserva = document.getElementById("detalheReserva");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnVoltar = document.getElementById("btnVoltar");
const nomeUsuario = document.getElementById("nomeUsuario");

nomeUsuario.textContent = USUARIO_ATUAL;

let reservaSelecionada = null;

// --- Dados ---

async function listarMinhasReservas(usuario) {
    const data = campoData.value;
    if (!data) return [];

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

async function listarHorasOcupadas(salaId, data) {
    const { data: linhas, error } = await db
        .from("reservas")
        .select("horario")
        .eq("sala_id", salaId)
        .eq("data_reserva", data);

    if (error) throw error;
    return (linhas ?? []).map(l => l.horario.slice(0, 5));
}

async function cancelarReserva(id) {
    const { error } = await db.from("reservas").delete().eq("id", id);
    if (error) throw error;
}

// --- Desenho ---

function desenharMinhasReservas(reservas) {
    listaReservas.replaceChildren();

    if (reservas.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Nenhuma reserva ativa para esta data.";
        listaReservas.appendChild(item);
        return;
    }

    for (const r of reservas) {
        const li = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = `${r.horario.slice(0, 5)} — ${r.usuario}`;

        const btn = document.createElement("button");
        btn.textContent = "Cancelar";
        btn.className = "btn-cancelar";
        btn.addEventListener("click", () => abrirConfirmacao(r));

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

// --- Fonte única da verdade ---

async function atualizarTelas() {
    const data = campoData.value;
    if (!data) return;

    try {
        const [reservas, ocupadas] = await Promise.all([
            listarMinhasReservas(USUARIO_ATUAL),
            listarHorasOcupadas(SALA_ID, data),
        ]);
        desenharMinhasReservas(reservas);
        desenharHorarios(ocupadas);
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro ao carregar os dados. Verifique o acesso ao banco.";
    }
}

// --- Diálogo ---

function abrirConfirmacao(reserva) {
    reservaSelecionada = reserva;
    detalheReserva.textContent = `${reserva.data_reserva} às ${reserva.horario.slice(0, 5)} — ${reserva.usuario}`;
    dialog.showModal();
}

btnVoltar.addEventListener("click", () => {
    dialog.close();
    reservaSelecionada = null;
});

btnConfirmar.addEventListener("click", async () => {
    if (!reservaSelecionada) return;
    const id = reservaSelecionada.id;

    dialog.close();
    reservaSelecionada = null;

    try {
        await cancelarReserva(id);
        await atualizarTelas();
        mensagem.textContent = "Reserva cancelada. O horário voltou a ficar livre.";
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Não foi possível cancelar. O acesso ao banco pode estar bloqueado.";
    }
});

// --- Inicialização ---

campoData.value = new Date().toISOString().split("T")[0];
campoData.addEventListener("change", atualizarTelas);
atualizarTelas();