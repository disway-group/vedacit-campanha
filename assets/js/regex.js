document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");

    // Campos Salesforce
    const dddFinanceiro = document.getElementById("00N01000000egLL");
    const telFinanceiro = document.getElementById("00N01000000egLQ");
    const dddGeral = document.getElementById("00N1U00000UlFrR");
    const dddCelular = document.getElementById("00N1U00000UlFrQ");
    const email = document.getElementById("email")

    const form = document.querySelector(".web-to-lead-form");

    // Função da máscara
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

    // Aplica a máscara conforme digita
    phoneInput.addEventListener("input", handlePhone);

    // Validação e preenchimento dos campos antes do envio
    form.addEventListener("submit", async function (e) {
        const rawValue = phoneInput.value.replace(/\D/g, ""); // somente números
        const ddd = rawValue.substring(0, 2);
        const numero = rawValue.substring(2);

        // Preenche todos os campos ocultos
        dddFinanceiro.value = ddd;
        telFinanceiro.value = numero;
        dddGeral.value = ddd;
        dddCelular.value = ddd;

        // Validação básica
        if (ddd.length !== 2) {
            e.preventDefault();
            await Swal.fire({
                icon: 'warning',
                title: 'DDD inválido',
                text: 'O DDD deve conter exatamente 2 dígitos.',
                confirmButtonColor: '#f5a623'
            });
            phoneInput.focus();
            return false;
        }

        if (numero.length < 8 || numero.length > 9) {
            e.preventDefault();
            await Swal.fire({
                icon: 'error',
                title: 'Número inválido',
                text: 'O número de telefone deve ter entre 8 e 9 dígitos após o DDD.',
                confirmButtonColor: '#f5a623'
            });
            phoneInput.focus();
            return false;
        }

        // Valida formato total (DDD + número)
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(rawValue)) {
            e.preventDefault();
            await Swal.fire({
                icon: 'error',
                title: 'Formato incorreto',
                text: 'Por favor, insira um telefone válido no formato (11) 91234-5678.',
                confirmButtonColor: '#f5a623'
            });
            phoneInput.focus();
            return false;
        }

        // Remove a máscara antes do envio
        phoneInput.value = rawValue;

        await Swal.fire({
            icon: 'success',
            title: 'Tudo certo!',
            text: 'Seus dados foram validados!',
            confirmButtonColor: '#28a745',
            timer: 2000,
            showConfirmButton: false
        });

        return true;
    });
});
