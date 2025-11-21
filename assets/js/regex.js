document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");

    // Campos Salesforce
    const dddFinanceiro = document.getElementById("00N01000000egLL");
    const telFinanceiro = document.getElementById("00N01000000egLQ");
    const dddGeral = document.getElementById("00N1U00000UlFrR");
    const dddCelular = document.getElementById("00N1U00000UlFrQ");

    const form = document.querySelector(".web-to-lead-form");
    if (!form) return;

    // Máscara do telefone
    const handlePhone = (event) => {
        let input = event.target;
        input.value = phoneMask(input.value);
    };

    const phoneMask = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        return value;
    };

    phoneInput.addEventListener("input", handlePhone);

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // bloquear envio imediato

        const rawValue = (phoneInput.value || "").replace(/\D/g, "");
        const ddd = rawValue.substring(0, 2);
        const numero = rawValue.substring(2);

        // Preenche campos ocultos (verifica existência)
        if (dddFinanceiro) dddFinanceiro.value = ddd || "";
        if (telFinanceiro) telFinanceiro.value = numero || "";
        if (dddGeral) dddGeral.value = ddd || "";
        if (dddCelular) dddCelular.value = ddd || "";

        // Validações
        if (ddd.length !== 2) {
            await Swal.fire({
                icon: 'warning',
                title: 'DDD inválido',
                text: 'O DDD deve conter exatamente 2 dígitos.',
                confirmButtonColor: '#f5a623'
            });
            phoneInput.focus();
            return;
        }

        if (numero.length < 8 || numero.length > 9) {
            await Swal.fire({
                icon: 'error',
                title: 'Número inválido',
                text: 'O número deve ter entre 8 e 9 dígitos.',
                confirmButtonColor: '#f5a623'
            });
            phoneInput.focus();
            return;
        }

        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(rawValue)) {
            await Swal.fire({
                icon: 'error',
                title: 'Formato incorreto',
                text: 'Insira um telefone válido no formato (11) 91234-5678.',
                confirmButtonColor: '#f5a623'
            });
            phoneInput.focus();
            return;
        }

        // Remove máscara do campo visível para enviar
        phoneInput.value = rawValue;

        // Atualiza retURL adicionando utm_campaign corretamente
        const campanhaKey = getCampaignFromURL() || "default";
        const retURLField = document.querySelector("input[name='retURL']");
        if (retURLField) {
            try {
                // usa URL para montar corretamente (compatível com absolute + relative)
                let base = retURLField.value;
                // Se base for relativa (começa com / ou https?), tenta usar URL constructor com origin atual
                let url;
                try {
                    url = new URL(base);
                } catch {
                    // base relativa -> constrói com origin atual
                    url = new URL(base, window.location.origin);
                }

                // Se já tiver utm_campaign, substitui; senão adiciona
                url.searchParams.set('utm_campaign', campanhaKey);

                // Se originalmente era relativo, queremos definir o mesmo formato que havia antes.
                // Mas para segurança com Salesforce, manter valor absoluto é ok.
                retURLField.value = url.toString();
            } catch (err) {
                // fallback simples
                const base = retURLField.value || "";
                const separator = base.includes('?') ? '&' : '?';
                retURLField.value = `${base}${separator}utm_campaign=${encodeURIComponent(campanhaKey)}`;
            }
        }

        // Mostra alerta de sucesso por ~2s
        await Swal.fire({
            icon: 'success',
            title: 'Tudo certo!',
            text: 'Seus dados foram validados!',
            confirmButtonColor: '#28a745',
            timer: 2000,
            showConfirmButton: false
        });

        // Pequeno delay adicional
        await new Promise(res => setTimeout(res, 200));

        // Chamada segura ao submit nativo (ignora se algo chama submit como nome de campo)
        HTMLFormElement.prototype.submit.call(form);
    });
});
