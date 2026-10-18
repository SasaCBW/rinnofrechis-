
import { db } from "./firebase.js";
import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const fallback = "data:image/svg+xml," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#ead1dc"/><text x="50%" y="50%" text-anchor="middle" font-size="35" fill="#87415f">Rinno Frenchies</text></svg>');

export function photo(src) {
  return src || fallback;
}

export function makeCard(dog) {
  const card = document.createElement("article");
  card.className = "dog-card";
  const img = document.createElement("img");
  img.src = photo(dog.foto);
  img.alt = dog.nome || "Bulldog Francês";
  img.loading = "lazy";
  img.onerror = () => { img.onerror = null; img.src = fallback; };

  const body = document.createElement("div");
  body.className = "dog-card-body";
  const title = document.createElement("h3");
  title.textContent = dog.nome || "Frenchie";
  const desc = document.createElement("p");
  desc.textContent = dog.descricao || "Conheça este Frenchie.";
  const link = document.createElement("a");
  link.href = "agendamento.html";
  link.textContent = "Solicitar informações →";
  body.append(title, desc, link);
  card.append(img, body);
  return card;
}

export async function loadDogs(element, max = 100) {
  if (!element) return;
  element.textContent = "Carregando Frenchies...";
  try {
    const q = query(collection(db, "frenchies"), orderBy("nome"), limit(max));
    const snapshot = await getDocs(q);
    element.replaceChildren();
    snapshot.forEach(doc => {
      const dog = doc.data();
      if (dog.publicado === true) element.append(makeCard(dog));
    });
    if (!element.children.length) {
      element.innerHTML = '<div class="empty-state">Entre em contato para conhecer nossos Frenchies.</div>';
    }
  } catch (error) {
    console.error(error);
    element.textContent = "Não foi possível carregar os Frenchies.";
  }
}

export function loadGallery(element, max = 100) {
  if (!element) return;
  const photos = (window.RINNO?.fotos || []).filter(Boolean).slice(0, max);
  element.replaceChildren();
  photos.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Fotografia Rinno Frenchies ${i + 1}`;
    img.loading = "lazy";
    img.onerror = () => { img.onerror = null; img.src = fallback; };
    element.append(img);
  });
}

document.querySelectorAll("[data-rinno-photo]").forEach(img => {
  const index = Number(img.dataset.rinnoPhoto);
  img.src = photo(window.RINNO?.fotos?.[index]);
  img.onerror = () => { img.onerror = null; img.src = fallback; };
});

const menu = document.querySelector(".menu-btn");
const links = document.querySelector(".nav-links");
if (menu && links) {
  menu.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

loadDogs(document.getElementById("home-dogs"), 3);
loadGallery(document.getElementById("home-gallery"), 8);
