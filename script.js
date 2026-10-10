const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

menuButton.addEventListener("click", () => {
  const aberto = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(aberto));
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".gallery-item").forEach(button => {
  button.addEventListener("click", () => {
    const foto = button.querySelector("img");
    lightboxImg.src = foto.src;
    lightboxImg.alt = foto.alt;
    lightbox.showModal();
  });
});

document.getElementById("closeLightbox").addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});
