
(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  const imageCards = document.querySelectorAll(".cards-with-images .card");
  if (imageCards.length && "IntersectionObserver" in window) {
    imageCards.forEach((card, index) => {
      card.classList.add("reveal-on-scroll");
      card.style.transitionDelay = `${index * 100}ms`;
    });
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    imageCards.forEach((card) => cardObserver.observe(card));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Carrega os municípios oficiais do IBGE de acordo com o estado escolhido.
  const stateSelect = document.getElementById("state");
  const municipalitySelect = document.getElementById("municipality");
  const municipalityStatus = document.getElementById("municipality-status");
  if (stateSelect && municipalitySelect) {
    stateSelect.addEventListener("change", async () => {
      const selectedState = stateSelect.options[stateSelect.selectedIndex];
      const uf = selectedState ? selectedState.dataset.uf : "";
      municipalitySelect.innerHTML = "";
      municipalitySelect.disabled = true;

      if (!uf) {
        municipalitySelect.add(new Option("Selecione primeiro o estado", ""));
        if (municipalityStatus) municipalityStatus.textContent = "";
        return;
      }

      municipalitySelect.add(new Option("Carregando municípios…", ""));
      if (municipalityStatus) municipalityStatus.textContent = "";

      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
        if (!response.ok) throw new Error("Falha ao consultar o IBGE");
        const municipalities = await response.json();
        municipalitySelect.innerHTML = "";
        municipalitySelect.add(new Option("Selecione o município", ""));
        municipalities.forEach((municipality) => {
          municipalitySelect.add(new Option(municipality.nome, municipality.nome));
        });
        municipalitySelect.disabled = false;
        if (municipalityStatus) municipalityStatus.textContent = `${municipalities.length} municípios disponíveis.`;
      } catch (error) {
        municipalitySelect.innerHTML = "";
        municipalitySelect.add(new Option("Não foi possível carregar", ""));
        municipalitySelect.disabled = true;
        if (municipalityStatus) municipalityStatus.textContent = "Não foi possível carregar a lista. Verifique a conexão e selecione novamente o estado.";
      }
    });
  }

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = document.getElementById("form-status");
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonHTML = submitButton ? submitButton.innerHTML : "";
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const state = String(data.get("state") || "").trim();
      const municipality = String(data.get("municipality") || "").trim();
      const message = String(data.get("message") || "").trim();

      status.classList.add("show");
      status.classList.remove("is-success", "is-error");

      if (!form.reportValidity()) return;
      if (!name || !email || !phone || !subject || !state || !municipality || !message) {
        status.textContent = "Preencha todos os campos obrigatórios antes de enviar.";
        status.classList.add("is-error");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        submitButton.textContent = "Enviando…";
      }
      status.textContent = "Enviando sua mensagem…";

      const payload = {
        name,
        email,
        phone,
        _replyto: email,
        _subject: `[Site Metallographica] ${subject}`,
        _template: "table",
        organisation: String(data.get("organisation") || "").trim() || "Não informado",
        state,
        municipality,
        message,
        _honey: String(data.get("_honey") || "")
      };

      try {
        const response = await fetch("https://formsubmit.co/ajax/gregorio.santana@simateriais.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || result.success === "false" || result.success === false) {
          throw new Error(result.message || "Não foi possível enviar a mensagem.");
        }

        status.textContent = "Mensagem enviada com sucesso! A equipe da SIM receberá sua solicitação.";
        status.classList.add("is-success");
        form.reset();
      } catch (error) {
        status.textContent = "Não foi possível enviar sua mensagem agora. Verifique sua conexão e tente novamente. Se o problema continuar, escreva para gregorio.santana@simateriais.com.";
        status.classList.add("is-error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
          submitButton.innerHTML = originalButtonHTML;
        }
      }
    });
  }
})();
