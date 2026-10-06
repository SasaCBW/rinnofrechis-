const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

function updateHeader() {
    if (!header) return;

    header.classList.toggle(
        "scrolled",
        window.scrollY > 35
    );
}

updateHeader();

window.addEventListener(
    "scroll",
    updateHeader
);


/* MENU MOBILE */

menuButton?.addEventListener(
    "click",
    () => {

        const opened =
            mainNav.classList.toggle("active");

        document.body.classList.toggle(
            "menu-open",
            opened
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(opened)
        );

        const icon =
            menuButton.querySelector("i");

        if (opened) {
            icon.className =
                "fa-solid fa-xmark";
        } else {
            icon.className =
                "fa-solid fa-bars";
        }
    }
);


document
    .querySelectorAll("#mainNav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mainNav?.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "menu-open"
                );

                menuButton?.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const icon =
                    menuButton?.querySelector("i");

                if (icon) {
                    icon.className =
                        "fa-solid fa-bars";
                }
            }
        );

    });


/* GALERIA */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );


document
    .querySelectorAll(".gallery-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const image =
                    item.querySelector("img");

                if (
                    !image ||
                    !lightbox ||
                    !lightboxImage
                ) {
                    return;
                }

                lightboxImage.src =
                    image.src;

                lightboxImage.alt =
                    image.alt ||
                    "Imagem ampliada";

                lightbox.classList.add(
                    "active"
                );

                lightbox.setAttribute(
                    "aria-hidden",
                    "false"
                );

                document.body.style.overflow =
                    "hidden";
            }
        );

    });


function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove(
        "active"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


lightboxClose?.addEventListener(
    "click",
    closeLightbox
);


lightbox?.addEventListener(
    "click",
    event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeLightbox();
        }

    }
);


/* ANO */

const currentYear =
    document.getElementById(
        "currentYear"
    );

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}


/* RESIZE */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 980) {

            mainNav?.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "menu-open"
            );

            menuButton?.setAttribute(
                "aria-expanded",
                "false"
            );

            const icon =
                menuButton?.querySelector("i");

            if (icon) {
                icon.className =
                    "fa-solid fa-bars";
            }
        }
    }
);
