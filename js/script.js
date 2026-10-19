
const FALLBACK_IMAGE =
  "https://placehold.co/800x600/F5F0E6/24382F?text=Rinno+Frenchies";

function getPhotos() {
  return Array.isArray(window.RINNO?.fotos)
    ? window.RINNO.fotos
    : [];
}

function setImage(img, src, alt) {
  img.alt = alt;
  img.loading = "lazy";
  img.src = src;

  img.onerror = () => {
    img.onerror = null;
    img.src = FALLBACK_IMAGE;
  };
}

function loadHeroPhotos() {
  const photos = getPhotos();

  document.querySelectorAll("[data-rinno-photo]").forEach(img => {
    const index = Number(img.dataset.rinnoPhoto);
    const photo = photos[index];

    if (photo) {
      setImage(img, photo, "Bulldog Francês da Rinno Frenchies");
    }
  });
}

function loadGallery() {
  const gallery = document.getElementById("home-gallery");
  if (!gallery) return;

  const photos = getPhotos();
  gallery.replaceChildren();

  photos.slice(0, 8).forEach((photo, index) => {
    const img = document.createElement("img");

    setImage(
      img,
      photo,
      `Bulldog Francês — fotografia ${index + 1}`
    );

    gallery.appendChild(img);
  });

  if (photos.length === 0) {
    gallery.textContent = "As fotografias serão exibidas em breve.";
  }
}

function initializeMenu() {
  const button = document.querySelector(".menu-btn");
  const menu = document.querySelector(".nav-links");

  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const opened = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(opened));
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function initializeYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

async function loadDogs() {
  const area = document.getElementById("home-dogs");
  if (!area) return;

  try {
    const { db } = await import("./firebase.js");

    const {
      collection,
      getDocs,
      query,
      limit,
      where
    } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
    );

    const result = await getDocs(
      query(
        collection(db, "frenchies"),
        where("publicado", "==", true),
        limit(3)
      )
    );

    area.replaceChildren();

    result.forEach(item => {
      const dog = item.data();
      const card = document.createElement("article");
      card.className = "dog-card";

      const img = document.createElement("img");
      setImage(img, dog.foto || FALLBACK_IMAGE, dog.nome || "Frenchie");

      const body = document.createElement("div");
      body.className = "dog-card-body";

      const title = document.createElement("h3");
      title.textContent = dog.nome || "Nosso Frenchie";

      const description = document.createElement("p");
      description.textContent = dog.descricao || "";

      body.append(title, description);
      card.append(img, body);
      area.append(card);
    });

    if (!area.children.length) {
      area.textContent = "Em breve, novidades sobre nossos Frenchies.";
    }
  } catch (error) {
    console.error("Não foi possível carregar o catálogo:", error);

    area.textContent =
      "Consulte nossa equipe para conhecer os Frenchies disponíveis.";
  }
}

loadHeroPhotos();
loadGallery();
initializeMenu();
initializeYear();
loadDogs();
