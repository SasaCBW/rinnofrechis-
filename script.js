const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
        menu.classList.toggle("active");
        document.body.classList.toggle("menu-open");

        const icon = menuButton.querySelector("i");

        if (menu.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            document.body.classList.remove("menu-open");

            const icon = menuButton.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-bars";
            }
        });
    });
}


/* ANO AUTOMÁTICO */

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


/* GALERIA */

const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

galleryItems.forEach(item => {
    item.addEventListener("click", () => {
        const image = item.querySelector("img");

        if (!image || !lightbox || !lightboxImage) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});


function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}


if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}


if (lightbox) {
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});
