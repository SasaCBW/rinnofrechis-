
document.addEventListener("DOMContentLoaded", function () {
  // Menu para celular
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const open = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menuButton.textContent = open ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        menuButton.textContent = "☰";
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        menuButton.textContent = "☰";
      }
    });
  }

  // Ano automático no rodapé
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Verifica se cada fotografia existe
  document.querySelectorAll(".gallery-card img, .hero-image img, .story-photo img, .feature-image img")
    .forEach(function (image) {
      image.addEventListener("error", function () {
        console.error("Imagem não encontrada:", image.getAttribute("src"));
        image.classList.add("photo-missing");
        image.alt = "Não foi possível carregar esta fotografia";
      });
    });

  // Configure os contatos comerciais abaixo.
  // WhatsApp: código do país + DDD + número, somente dígitos.
  // Exemplo de formato brasileiro: 55 + DDD + número.
  const whatsappNumero = "";
  const emailComercial = "";

  const whatsappButton = document.getElementById("whatsapp-button");
  const emailButton = document.getElementById("email-button");
  const contactNote = document.getElementById("contact-note");

  let contactConfigured = false;

  if (whatsappButton) {
    const number = whatsappNumero.replace(/\D/g, "");

    if (/^\d{12,13}$/.test(number)) {
      whatsappButton.href = "https://wa.me/" + number;
      whatsappButton.hidden = false;
      contactConfigured = true;
    } else {
      whatsappButton.hidden = true;
    }
  }

  if (emailButton) {
    const email = emailComercial.trim();

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailButton.href = "mailto:" + email;
      emailButton.hidden = false;
      contactConfigured = true;
    } else {
      emailButton.hidden = true;
    }
  }

  if (contactNote && contactConfigured) {
    contactNote.hidden = true;
  }
});
