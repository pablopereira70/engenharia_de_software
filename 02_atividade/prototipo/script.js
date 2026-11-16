// 1. Configuração do Supabase
const SUPABASE_URL = "https://phvhwnzvlzfpcjjigqpo.supabase.co";
const SUPABASE_KEY = "sb_publishable_OC_3Wtqj4sLEbhnC__S-LQ_I4J38l-Z";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos HTML
const formulario = document.getElementById("formReserva");
const mensagem = document.getElementById("mensagem");
const lista = document.getElementById("listaReservas");
const campoData = document.getElementById("data");

// 2. Consultar reservas do banco

async function carregarReservas() {
    const data = campoData.value;

    if (!data) return;

    const { data: reservas, error } = await db
        .from("reservas")
        .select("usuario, horario, data_reserva")
        .eq("sala_id", 1)
        .eq("data_reserva", data)
        .order("horario");

    if (error) {
        mensagem.textContent = "Erro ao consultar reservas.";
        console.error(error);
        return;
    }

    lista.replaceChildren();

    reservas.forEach(reserva => {
        const item = document.createElement("li");

        item.textContent =
            `${reserva.data_reserva} - ${reserva.horario.slice(0, 5)} - ${reserva.usuario}`;

        lista.appendChild(item);
    });
}

// 3. Registrar uma reserva
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();

    if (!usuario) {
        mensagem.textContent = "Informe seu nome.";
        return;
    }
    const data = campoData.value;
    const horario = document.getElementById("horario").value;

    mensagem.textContent = "Processando reserva...";

    const { error } = await db
        .from("reservas")
        .insert({
            sala_id: 1,
            usuario: usuario,
            data_reserva: data,
            horario: horario
        });

    if (error) {

        if (error.code === "23505") {
            mensagem.textContent =
                "Esse horário já foi reservado!";

            await carregarReservas();   // mostra a reserva que ocupou o horário
        } else {
            mensagem.textContent =
                "Não foi possível realizar a reserva.";

            console.error(error);
        }

        return;
    }

    mensagem.textContent = "Reserva realizada com sucesso!";

    await carregarReservas();
});

// 4. Atualizar a lista
campoData.addEventListener("change", carregarReservas);

// 5. Carregar reservas ao abrir a página
carregarReservas();