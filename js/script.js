
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  limit,
  where
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const FALLBACK_IMAGE =
  "https://placehold.co/800x600/f5dce7/59102f?text=Rinno+Frenchies";

function getPhotos() {
  return Array.isArray(window.RINNO?.fotos)
    ? window.RINNO.fotos.filter(Boolean)
    : [];
}

function createImage(src, alt, className = "") {
  const img = document.createElement("img");
  img.src = src || FALLBACK_IMAGE;
  img.alt = alt;
  img.loading = "lazy";

  if (className) img.className = className;

  img.onerror = () => {
    img.onerror = null;
    img.src = FALLBACK_IMAGE;
  };

  return img;
}

export function makeCard(dog) {
  const card = document.createElement("article");
  card.className = "dog-card";

  const image = createImage(
    dog.foto,
    dog.nome || "Bulldog Francês"
  );

  const body = document.createElement("div");
  body.className = "dog-card-body";

  const title = document.createElement("h3");
  title.textContent = dog.nome || "Nosso Frenchie";

  const description = document.createElement("p");
  description.textContent =
    dog.descricao || "Conheça este integrante da Rinno Frenchies.";

  const link = document.createElement("a");
  link.href = "agendamento.html";
  link.textContent = "Solicitar informações →";

  body.append(title, description, link);
  card.append(image, body);

  return card;
}

export async function loadDogs(element, max = 100) {
  if (!element) return;

  element.replaceChildren();

  try {
    const dogsQuery = query(
      collection(db, "frenchies"),
      where("publicado", "==", true),
      limit(max)
    );

    const snapshot = await getDocs(dogsQuery);

    snapshot.forEach(documentSnapshot => {
      element.append(makeCard(documentSnapshot.data()));
    });

    if (!element.children.length) {
      element.innerHTML = `
        <div class="empty-state">
          <h3>Em breve, nossos Frenchies</h3>
          <p>Entre em contato para saber mais sobre os nossos cães.</p>
          <a class="btn btn-wine" href="agendamento.html">
            Fale conosco →
          </a>
        </div>
      `;
    }
  } catch (error) {
    console.error("Erro ao carregar os Frenchies:", error);

    element.innerHTML = `
      <div class="empty-state">
        <h3>Conheça nossos Frenchies</h3>
        <p>Entre em contato para receber informações sobre nossos cães.</p>
        <a class="btn btn-wine" href="agendamento.html">
          Fale conosco →
        </a>
      </div>
    `;
  }
}

export function loadGallery(element, max = 100) {
  if (!element) return;

  const photos = getPhotos().slice(0, max);
  element.replaceChildren();

  photos.forEach((src, index) => {
    const image = createImage(
      src,
      `Fotografia ${index + 1} da Rinno Frenchies`
    );

    element.append(image);
  });
}

function initializeHeroPhotos() {
  document.querySelectorAll("[data-rinno-photo]").forEach(img => {
    const index = Number(img.dataset.rinnoPhoto);
    const photos = getPhotos();

    img.src = photos[index] || FALLBACK_IMAGE;
    img.alt = index === 0
      ? "Bulldog Francês da Rinno Frenchies"
      : "Conheça os cães da Rinno Frenchies";

    img.onerror = () => {
      img.onerror = null;
      img.src = FALLBACK_IMAGE;
    };
  });
}

function initializeMenu() {
  const menuButton = document.querySelector(".menu-btn");
  const navigation = document.querySelector(".nav-links");

  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

function initializeYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

initializeHeroPhotos();
initializeMenu();
initializeYear();

loadDogs(document.getElementById("home-dogs"), 3);
loadGallery(document.getElementById("home-gallery"), 8);
