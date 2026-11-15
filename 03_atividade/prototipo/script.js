// 1. Configuração do Supabase
const _URL = "https://phvhwnzvlzfpcjjigqpo.supabase.co";
const CHAVE = "sb_publishable_OC_3Wtqj4sLEbhnC__S-LQ_I4J38l-Z";

//notificações navegador
const botaoNotificacoes = document.getElementById("ativarNotificacoes");

const db = window.supabase.createClient(_URL, CHAVE);

// Elementos HTML
const formulario = document.getElementById("formReserva");
const mensagem = document.getElementById("mensagem");
const lista = document.getElementById("listaReservas");
const campoData = document.getElementById("data");


//personalização de cores

const inputCorFundo = document.getElementById("corFundo");
const inputCorCartao = document.getElementById("corCartao");


//solicitar permissao ao navegador

botaoNotificacoes.addEventListener("click", async () => {
    if (!("Notification" in window)) {
        mensagem.textContent = "Seu navegador não suporta notificações.";
        return;
    }

    const permissao = await Notification.requestPermission();

    if (permissao === "granted") {
        mensagem.textContent = "Notificações ativadas com sucesso!";
        botaoNotificacoes.textContent = "Notificações ativadas";
        botaoNotificacoes.disabled = true;
    } else {
        mensagem.textContent = "Permissão para notificações não concedida.";
    }
});


//centralizar notificações


function notificarReserva(usuario, data, horario) {
    if (Notification.permission !== "granted") {
        return;
    }

    new Notification("Reserva confirmada!", {
        body: `${usuario}, sua reserva foi confirmada para ${data}, às ${horario}.`
    });

    const dataReserva = new Date(`${data}T${horario}:00`);
    const tempo = dataReserva.getTime() - Date.now() - (15* 60 * 1000);

    if (tempo > 0 && tempo <= 2147483647) {
        setTimeout(() => {
            new Notification("Lembrete de reserva", {
                body: `Sua reserva da Sala 01 começa às ${horario}.`
            });
        }, tempo);
    }
}

// 2. Consultar reservas do banco

async function carregarReservas() {
    const data = campoData.value;

    if (!data) return;

    const { data: reservas, error } = await db
        .from("reservas")
        .select("id, sala_id, usuario, horario, data_reserva")
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

    const texto = document.createElement("span");

    texto.textContent =
        `${reserva.data_reserva} - ${reserva.horario.slice(0, 5)} - ${reserva.usuario}`;

    const botaoCancelar = document.createElement("button");

    botaoCancelar.type = "button";
    botaoCancelar.textContent = "Cancelar reserva";

   botaoCancelar.addEventListener("click", () => {
    alert("O botão foi clicado!"); //depuração
    cancelarReserva(reserva);
   });

    item.appendChild(texto);
    item.appendChild(botaoCancelar);

    lista.appendChild(item);
    });
}


// Cancelar uma reserva
async function cancelarReserva(reserva) {

    const confirmar = confirm(
        `Deseja realmente cancelar a reserva de ${reserva.usuario} no dia ${reserva.data_reserva}, às ${reserva.horario.slice(0, 5)}?`
    );

    if (!confirmar) {
        return;
    }


    const { data, error } = await db
        .from("reservas")
        .delete()
        .eq("id", reserva.id)
        .select("id");

    if (error) {
        mensagem.textContent = "Erro ao cancelar a reserva.";
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("Nenhuma reserva foi excluída para o id:", reserva.id);
        return;
    }

    mensagem.textContent = "Reserva cancelada com sucesso!";

    await carregarReservas();
}


// 3. Registrar uma reserva
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
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
        } else {
            mensagem.textContent =
                "Não foi possível realizar a reserva.";

            console.error(error);
        }

        return;
    }

    mensagem.textContent = "Reserva realizada com sucesso!";

    notificarReserva(usuario, data, horario);

    await carregarReservas();
});

// 4. Atualizar a lista
campoData.addEventListener("change", carregarReservas);

// 5. Carregar reservas ao abrir a página
carregarReservas();


// 6. Personalizar e salvar cores
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

carregarCoresSalvas();