
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav-links");

  // Menu para celular
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("active");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
      });
    });

    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("active") &&
        !nav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        nav.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
      }
    });
  }

  // Atualiza o ano automaticamente no rodapé
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Verifica se as fotografias carregaram
  const galleryImages = document.querySelectorAll(".gallery-item img");

  galleryImages.forEach(function (img) {
    img.addEventListener("error", function () {
      console.error("Não foi possível carregar esta fotografia:", img.src);
      img.closest(".gallery-item")?.classList.add("image-error");
    });
  });

  // Permite usar Escape para fechar o menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav && menuButton) {
      nav.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
    }
  });

  // Configuração opcional do WhatsApp.
  // Coloque o número com código do país e DDD, somente números.
  // Exemplo de formato: 55 + DDD + número.
  const whatsappNumero = "";

  const whatsappLink = document.getElementById("whatsapp-link");

  if (whatsappLink) {
    const numero = whatsappNumero.replace(/\D/g, "");

    if (numero.length >= 12 && numero.length <= 13) {
      whatsappLink.href = "https://wa.me/" + numero;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
      whatsappLink.hidden = false;
    } else {
      whatsappLink.hidden = true;
    }
  }

  // Não exibe o botão de e-mail enquanto não houver um endereço configurado.
  // Para ativá-lo, informe o e-mail comercial na variável abaixo.
  const emailComercial = "";

  const emailLink = document.querySelector(
    '.contact-actions a[href^="mailto:"]'
  );

  if (emailLink) {
    if (emailComercial.trim() !== "") {
      emailLink.href = "mailto:" + emailComercial.trim();
      emailLink.hidden = false;
    } else {
      emailLink.hidden = true;
    }
  }
});
