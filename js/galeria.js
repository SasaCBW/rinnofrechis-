import "./script.js";

const grid = document.getElementById("full-gallery");
const dialog = document.getElementById("lightbox");
const large = document.getElementById("large-photo");

grid.replaceChildren();

(window.RINNO?.fotos || []).filter(Boolean).forEach((src, i) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `Ampliar fotografia ${i + 1}`);
  const img = document.createElement("img");
  img.src = src;
  img.alt = `Frenchie da Rinno ${i + 1}`;
  img.loading = "lazy";
  button.append(img);
  button.addEventListener("click", () => {
    large.src = src;
    dialog.showModal();
  });
  grid.append(button);
});

document.getElementById("close-photo").onclick = () => dialog.close();
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
