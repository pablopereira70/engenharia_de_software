
const seletor = document.getElementById("meuSeletor");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("btnConsultar");

botao.addEventListener("click", atualizarTexto);

function atualizarTexto() {
    const horario = seletor.value;

    if (horario === "opcao1" || horario === "opcao3") {
        mensagem.textContent = "Livre";
    } else {
        mensagem.textContent = "";
    }
}