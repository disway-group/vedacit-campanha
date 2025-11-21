// Pega o valor da campanha na URL (?campanha=xxxx)
function getCampaignFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_campaign");
}

// Atualiza os elementos da página
function updateLanding(data, campanhaKey) {
    const titleEl = document.querySelector(".hero-content h1");
    const descEl = document.querySelector(".hero-content p");
    const imageEl = document.getElementById("profImage");

    if (data.title) titleEl.textContent = data.title;
    if (data.description) descEl.textContent = data.description;
    if (data.image) imageEl.src = data.image;

    document.body.dataset.campanha = campanhaKey;

    const selectEl = document.getElementById("campaignSelect");
    if (selectEl) selectEl.value = campanhaKey;

    // === LÓGICA DO CAMPO DE PALESTRANTE ===
    const palestranteInput = document.querySelector('[name="00NHZ000005tkwz"]');
    const palestranteField = palestranteInput?.closest(".form-group");

    if (palestranteField) {
        if (campanhaKey === "campanha_palestra") {
            palestranteField.style.display = "block";
            palestranteInput.required = true;
        } else {
            palestranteField.style.display = "none";
            palestranteInput.required = false;
            palestranteInput.value = ""; // opcional: limpa o campo
        }
    }

}

// Carrega JSON e aplica campanha
function initCampaignLanding() {
    const campanha = getCampaignFromURL();

    fetch("/vedacit-campanha/assets/data/data.json")
        .then(res => res.json())
        .then(json => {
            const key = (campanha && json[campanha]) ? campanha : "default";
            updateLanding(json[key], key);
        })
        .catch(err => {
            console.error("Erro ao carregar JSON:", err);
        });

    fillHiddenFields(campanha);
}

// Função para trocar de campanha
function changeCampaign(campanhaKey) {
    if (campanhaKey) {
        window.location.href = `${window.location.pathname}?utm_campaign=${campanhaKey}`;
    } else {
        window.location.href = window.location.pathname;
    }
    fillHiddenFields(campanhaKey);
}

// Inicia
initCampaignLanding();

// Adiciona listener ao select
document.addEventListener("DOMContentLoaded", function () {
    const selectEl = document.getElementById("campaignSelect");
    if (selectEl) {
        selectEl.addEventListener("change", function () {
            changeCampaign(this.value);
        });
    }
});

function fillHiddenFields(campanhaKey) {
    const leadSource = document.getElementById("lead_source");
    const utmField = document.getElementById("00NHZ000006SDoU");

    if (leadSource) {
        leadSource.value = "Campanha"; // sempre fixo
    }

    if (utmField) {
        utmField.value = campanhaKey || "Default"; // campanha atual
    }
}
