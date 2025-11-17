// Pega o valor da campanha na URL (?campanha=xxxx)
function getCampaignFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("campanha");
}

// Atualiza os elementos da página
function updateLanding(data, campanhaKey) {
    const titleEl = document.querySelector(".hero-content h1");
    const descEl = document.querySelector(".hero-content p");
    const imageEl = document.getElementById("profImage");

    if (data.title) titleEl.textContent = data.title;
    if (data.description) descEl.textContent = data.description;
    if (data.image) imageEl.src = data.image;
    
    // Aplica a campanha como data-attribute no body
    document.body.dataset.campanha = campanhaKey;
    
    // Atualiza o select com a campanha atual
    const selectEl = document.getElementById("campaignSelect");
    if (selectEl) {
        selectEl.value = campanhaKey;
    }
}

// Carrega JSON e aplica campanha
function initCampaignLanding() {
    const campanha = getCampaignFromURL();

    fetch("/assets/data/data.json")
        .then(res => res.json())
        .then(json => {
            const key = (campanha && json[campanha]) ? campanha : "default";
            updateLanding(json[key], key);
        })
        .catch(err => {
            console.error("Erro ao carregar JSON:", err);
        });
}

// Função para trocar de campanha
function changeCampaign(campanhaKey) {
    if (campanhaKey) {
        window.location.href = `${window.location.pathname}?campanha=${campanhaKey}`;
    } else {
        window.location.href = window.location.pathname;
    }
}

// Inicia
initCampaignLanding();

// Adiciona listener ao select
document.addEventListener("DOMContentLoaded", function() {
    const selectEl = document.getElementById("campaignSelect");
    if (selectEl) {
        selectEl.addEventListener("change", function() {
            changeCampaign(this.value);
        });
    }
});