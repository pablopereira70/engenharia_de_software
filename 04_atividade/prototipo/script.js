// 1. Configuração do Supabase — mesma base da Atividade 02
const SUPABASE_URL = "https://phvhwnzvlzfpcjjigqpo.supabase.co";
const SUPABASE_KEY = "sb_publishable_OC_3Wtqj4sLEbhnC__S-LQ_I4J38l-Z";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos da página
const campoData = document.getElementById("data");
const lista = document.getElementById("listaReservas");
const mensagem = document.getElementById("mensagem");
const dialog = document.getElementById("dialogCancelar");
const detalheReserva = document.getElementById("detalheReserva");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnVoltar = document.getElementById("btnVoltar");

let reservaSelecionada = null;

// 2. Carregar as reservas da data escolhida
async function carregarReservas() {
    const data = campoData.value;
    if (!data) return;

    const { data: reservas, error } = await db
        .from("reservas")
        .select("id, usuario, horario, data_reserva")
        .eq("sala_id", 1)
        .eq("data_reserva", data)
        .order("horario");

    if (error) {
        mensagem.textContent = "Erro ao consultar reservas. Verifique o acesso ao banco.";
        console.error(error);
        return;
    }

    lista.replaceChildren();
    mensagem.textContent = "";

    if (reservas.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Nenhuma reserva para esta data.";
        lista.appendChild(item);
        return;
    }

    reservas.forEach(reserva => {
        const item = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = `${reserva.horario.slice(0, 5)} — ${reserva.usuario}`;

        const btn = document.createElement("button");
        btn.textContent = "Cancelar";
        btn.className = "btn-cancelar";
        btn.addEventListener("click", () => abrirConfirmacao(reserva));

        item.appendChild(texto);
        item.appendChild(btn);
        lista.appendChild(item);
    });
}

// 3. Abrir o diálogo de confirmação
function abrirConfirmacao(reserva) {
    reservaSelecionada = reserva;
    detalheReserva.textContent = `${reserva.data_reserva} às ${reserva.horario.slice(0, 5)} — ${reserva.usuario}`;
    dialog.showModal();
}

// 4. Confirmar cancelamento (DELETE no Supabase)
btnConfirmar.addEventListener("click", async () => {
    if (!reservaSelecionada) return;

    const { data: removidas, error } = await db
        .from("reservas")
        .delete()
        .eq("id", reservaSelecionada.id)
        .select("id");

    dialog.close();

    if (error) {
        // Simula o impedimento: falta de permissão ou outro bloqueio
        mensagem.textContent = "Não foi possível cancelar. O acesso ao ambiente de teste pode estar bloqueado.";
        console.error(error);
        return;
    }

    // Com RLS sem política de DELETE, o Supabase não dá erro: apenas não remove nada.
    if (!removidas || removidas.length === 0) {
        mensagem.textContent = "Não foi possível cancelar: nenhuma reserva foi removida. O acesso ao ambiente de teste pode estar bloqueado.";
        return;
    }

    mensagem.textContent = "Reserva cancelada com sucesso! O horário voltou a ficar livre.";
    await carregarReservas();
});

// 5. Voltar sem cancelar
btnVoltar.addEventListener("click", () => {
    dialog.close();
    reservaSelecionada = null;
});

// 6. Inicialização
// Data de hoje no fuso local (toISOString usa UTC e, no Brasil, vira "amanhã" após as 21h)
function dataLocalHoje() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
}

campoData.value = dataLocalHoje();
campoData.addEventListener("change", carregarReservas);
carregarReservas();