(function () {
  // helpers
  const isVisible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const isFieldElement = el => el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA');

  function createMessageIfMissing(container, text) {
    if (!container) return null;
    let msg = container.querySelector('.error-message');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'error-message';
      msg.innerText = text || 'Este campo é obrigatório.';
      container.appendChild(msg);
    } else {
      if (text) msg.innerText = text;
    }
    return msg;
  }

  function getContainer(field) {
    // tenta encontrar .form-group ou pega parentElement como fallback
    return field.closest('.form-group') || field.parentElement;
  }

  function setErrorVisual(field, container, hasError) {
    // aplica classes de erro de forma inteligente
    if (!container) return;
    if (field.type === 'checkbox' || field.type === 'radio') {
      // para checkbox/radio marcamos o container
      if (hasError) container.classList.add('error', 'form-check', 'error-check');
      else container.classList.remove('error', 'error-check');
      // também marca o input
      if (hasError) field.classList.add('error'); else field.classList.remove('error');
    } else {
      if (hasError) field.classList.add('error'); else field.classList.remove('error');
      if (!hasError) {
        // limpa outline do container se existir
        container.classList.remove('error');
      }
    }
  }

  function validateSingleField(field) {
    if (!isFieldElement(field)) return true;
    if (field.disabled) return true;
    if (field.type === 'hidden') return true;
    if (!field.hasAttribute('required')) return true;
    if (!isVisible(field)) return true; // ignora campos escondidos

    // ignore buttons
    if (field.tagName === 'INPUT' && (field.type === 'submit' || field.type === 'button' || field.type === 'image')) return true;

    const container = getContainer(field);
    const customMsg = field.getAttribute('data-error') || (container && container.getAttribute('data-error'));
    const msgEl = createMessageIfMissing(container, customMsg || 'Este campo é obrigatório.');

    let valid = true;

    if (field.type === 'checkbox') {
      valid = field.checked === true;
    } else if (field.type === 'radio') {
      // para radio: valida se algum com mesmo name está checked
      const form = field.form || document;
      const radios = form.querySelectorAll(`input[type="radio"][name="${CSS.escape(field.name)}"]`);
      valid = Array.from(radios).some(r => r.checked);
    } else {
      valid = field.value != null && field.value.toString().trim() !== '';
    }

    if (!valid) {
      msgEl.classList.add('active');
      setErrorVisual(field, container, true);
      return false;
    } else {
      msgEl.classList.remove('active');
      setErrorVisual(field, container, false);
      return true;
    }
  }

  // Aplica listeners a cada campo relevante
  function bindField(field) {
    if (!isFieldElement(field)) return;
    // evitar adicionar múltiplos listeners
    if (field.__validation_bound) return;
    field.__validation_bound = true;

    // eventos
    field.addEventListener('blur', () => validateSingleField(field));
    field.addEventListener('input', () => validateSingleField(field));
    field.addEventListener('change', () => validateSingleField(field));
  }

  // inicializa
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.web-to-lead-form');
    if (!form) return;

    // pega só inputs/selects/textarea dentro do form que tenham required
    const requiredFields = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'))
      .filter(f => {
        if (!isFieldElement(f)) return false;
        if (f.type === 'hidden') return false;
        if (f.tagName === 'INPUT' && (f.type === 'submit' || f.type === 'button' || f.type === 'image')) return false;
        return true;
      });

    // cria mensagens e bind
    requiredFields.forEach(f => {
      const container = getContainer(f);
      createMessageIfMissing(container, f.getAttribute('data-error') || undefined);
      bindField(f);
    });

    // exemplo: se quiser máscaras, pegue os elementos aqui e aplique
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
      // máscara simples de exemplo (troque pela sua)
      phoneInput.addEventListener('input', (e) => {
        const old = e.target.value;
        let v = old.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        e.target.value = v;
      });
    }

    // submit: valida todos e foca no primeiro inválido
    form.addEventListener('submit', (ev) => {
      let ok = true;
      let firstInvalid = null;

      requiredFields.forEach(f => {
        const valid = validateSingleField(f);
        if (!valid) {
          ok = false;
          if (!firstInvalid) firstInvalid = f;
        }
      });

      if (!ok) {
        ev.preventDefault();
        // foca/rola ao primeiro inválido (com pequeno offset)
        if (firstInvalid) {
          firstInvalid.focus({ preventScroll: true });
          const rect = firstInvalid.getBoundingClientRect();
          const top = window.scrollY + rect.top - 80; // offset header
          window.scrollTo({ top, behavior: 'smooth' });
        }
        return false;
      }

      // Antes de enviar: exemplo de limpeza de máscara (adapte se tiver campos mascarados)
      if (phoneInput) {
        phoneInput.value = phoneInput.value.replace(/\D/g, '');
      }

      // tudo OK: formulário segue
      return true;
    });
  });
})();
