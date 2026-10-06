/* =====================================================
   RINNO FRENCHIES
   JAVASCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const header =
    document.getElementById("header");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const navigation =
    document.getElementById("navigation");

const navigationLinks =
    document.querySelectorAll(
        ".navigation a"
    );

const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxClose =
    document.getElementById("lightboxClose");

const currentYear =
    document.getElementById("currentYear");


/* =====================================================
   HEADER AO ROLAR
===================================================== */

function atualizarHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 30) {

        header.classList.add(
            "scrolled"
        );

    }

    else {

        header.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    atualizarHeader
);


atualizarHeader();


/* =====================================================
   MENU MOBILE
===================================================== */

mobileMenuButton?.addEventListener(
    "click",
    () => {

        navigation?.classList.toggle(
            "active"
        );

        document.body.classList.toggle(
            "menu-open"
        );


        const icon =
            mobileMenuButton.querySelector(
                "i"
            );


        if (
            navigation?.classList.contains(
                "active"
            )
        ) {

            icon?.classList.remove(
                "fa-bars"
            );

            icon?.classList.add(
                "fa-xmark"
            );

        }

        else {

            icon?.classList.remove(
                "fa-xmark"
            );

            icon?.classList.add(
                "fa-bars"
            );

        }

    }
);


/* FECHAR MENU AO CLICAR */

navigationLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navigation?.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "menu-open"
                );


                const icon =
                    mobileMenuButton
                        ?.querySelector(
                            "i"
                        );


                icon?.classList.remove(
                    "fa-xmark"
                );

                icon?.classList.add(
                    "fa-bars"
                );

            }
        );

    }
);


/* =====================================================
   LIGHTBOX DA GALERIA
===================================================== */

galleryItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const image =
                    item.querySelector(
                        "img"
                    );


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
                    "Bulldog Francês";


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

    }
);


/* =====================================================
   FECHAR LIGHTBOX
===================================================== */

function fecharLightbox() {

    if (!lightbox) {
        return;
    }


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
    fecharLightbox
);


lightbox?.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            fecharLightbox();

        }

    }
);


/* ESC */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            lightbox?.classList.contains(
                "active"
            )
        ) {

            fecharLightbox();

        }

    }
);


/* =====================================================
   ANO AUTOMÁTICO
===================================================== */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =====================================================
   FECHAR MENU SE A TELA AUMENTAR
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 980
        ) {

            navigation?.classList.remove(
                "active"
            );


            document.body.classList.remove(
                "menu-open"
            );


            const icon =
                mobileMenuButton
                    ?.querySelector(
                        "i"
                    );


            icon?.classList.remove(
                "fa-xmark"
            );


            icon?.classList.add(
                "fa-bars"
            );

        }

    }
);
