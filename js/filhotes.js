import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const grid = document.getElementById("puppiesGrid");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function safePhoto(path) {
  return /^imagens\/cachorro-(0[1-9]|1[0-4])\.jpeg$/.test(path)
    ? path
    : "imagens/cachorro-01.jpeg";
}

async function carregarFrenchies() {
  try {
    const snapshot = await getDocs(collection(db, "filhotes"));

    if (snapshot.empty) {
      grid.innerHTML = `
        <p class="empty">
          ♡ Em breve teremos novidades!
          Entre em contato para consultar a disponibilidade.
        </p>
      `;
      return;
    }

    grid.innerHTML = snapshot.docs.map(documento => {
      const cachorro = documento.data();

      return `
        <article class="puppy-card">
          <div class="puppy-photo">
            <img
              src="./${safePhoto(cachorro.foto)}"
              alt="${escapeHTML(cachorro.nome || "Frenchie")}"
              loading="lazy"
            >
            <span class="status">
              ${escapeHTML(cachorro.status || "Consulte")}
            </span>
          </div>

          <div class="puppy-info">
            <small>${escapeHTML(cachorro.sexo || "Bulldog Francês")}</small>
            <h3>${escapeHTML(cachorro.nome || "Frenchie")}</h3>
            <p>${escapeHTML(cachorro.descricao || "Entre em contato para saber mais.")}</p>

            <a
              href="#contato"
              data-name="${escapeHTML(cachorro.nome || "Frenchie")}"
            >
              Tenho interesse ↗
            </a>
          </div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-name]").forEach(link => {
      link.addEventListener("click", () => {
        document.getElementById("interestType").value =
          "Filhote disponível";

        document.getElementById("interestMessage").value =
          `Olá! Gostaria de saber mais sobre ${link.dataset.name}.`;
      });
    });

  } catch (error) {
    console.error("Erro ao carregar Frenchies:", error);

    grid.innerHTML = `
      <p class="empty">
        Não foi possível carregar os Frenchies agora.
        Você pode enviar sua mensagem pelo formulário.
      </p>
    `;
  }
}

carregarFrenchies();
