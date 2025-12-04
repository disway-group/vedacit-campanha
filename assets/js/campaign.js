// -------------------------
// Utilidades
// -------------------------

const getCampaignFromURL = () =>
    new URLSearchParams(window.location.search).get("utm_campaign") || "default";

const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

// -------------------------
// Atualiza a landing
// -------------------------

function updateLanding(data, key) {
    qs(".hero-content h1").textContent = data.title || "";
    qs(".hero-content p").textContent = data.description || "";
    
    const imageEl = document.getElementById("profImage");
    if (imageEl && data.image) {
        imageEl.src = data.image;
    }

    document.body.dataset.campanha = key;

    const selectEl = qs("#campaignSelect");
    if (selectEl) selectEl.value = key;

    // Campo palestrante
    const palestranteInput = qs('[name="00NHZ000005tkwz"]');
    const wrapper = palestranteInput?.closest(".form-group");

    if (wrapper) {
        const isPalestra = key === "campanha_palestra";
        wrapper.style.display = isPalestra ? "block" : "none";
        palestranteInput.required = isPalestra;
        if (!isPalestra) palestranteInput.value = "";
    }
}

// -------------------------
// Preenche hidden fields
// -------------------------

function fillHiddenFields(key) {
    const utm = key || "default";

    const leadSource = qs("#lead_source");
    const utmField = document.getElementById("00NHZ000006SDoU"); // <-- Ajustado

    if (leadSource) leadSource.value = "Site_Institucional";
    if (utmField) utmField.value = utm;
}

// -------------------------
// Inicia tudo
// -------------------------

async function initCampaignLanding() {
    const campanhaKey = getCampaignFromURL();

    try {
        const res = await fetch("/assets/data/data.json");
        const json = await res.json();

        const data = json[campanhaKey] || json.default;
        updateLanding(data, campanhaKey);
    } catch (err) {
        console.error("Erro ao carregar JSON:", err);
    }

    fillHiddenFields(campanhaKey);

    document.body.classList.remove("preload");
}

// -------------------------
// Execução
// -------------------------

document.addEventListener("DOMContentLoaded", () => {
    initCampaignLanding();
});
