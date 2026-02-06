function updateProfImage() {
    const select = document.getElementById("00NU4000005pspy");
    const image = document.getElementById("profImage");
    const value = select.value.toLowerCase();

    // Caminho base das imagens
    const basePath = "./assets/images/";

    // Define a imagem padrão
    let fileName = "default.png";

    if (value.includes("pedreiro") || value.includes("mestre")) {
        fileName = "MestreCenter.png";
    } else if (value.includes("engenheiro")) {
        fileName = "engenheiro.png";
    } else if (value.includes("consumidor")) {
        fileName = "ConsumidorCenter.png";
    } else if (value.includes("lojista")) {
        fileName = "RevendedorCenter.png";
    }

    image.src = basePath + fileName;
}