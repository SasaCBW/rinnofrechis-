import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const puppiesGrid =
    document.getElementById(
        "puppiesGrid"
    );


function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function validPhoto(photo) {

    const allowed =
        /^imagens\/cachorro-(0[1-9]|1[0-4])\.jpeg$/;

    if (allowed.test(photo || "")) {
        return photo;
    }

    return "imagens/cachorro-01.jpeg";
}


function createPuppyCard(data) {

    const nome =
        escapeHTML(
            data.nome || "Frenchie"
        );

    const sexo =
        escapeHTML(
            data.sexo || "Bulldog Francês"
        );

    const status =
        escapeHTML(
            data.status || "Consulte"
        );

    const descricao =
        escapeHTML(
            data.descricao ||
            "Entre em contato para mais informações."
        );

    const foto =
        validPhoto(data.foto);


    return `
        <article class="puppy-card">

            <div class="puppy-image">

                <img
                    src="./${foto}"
                    alt="${nome}"
                    loading="lazy"
                >

                <span class="puppy-status">
                    ${status}
                </span>

            </div>

            <div class="puppy-content">

                <span class="puppy-gender">
                    ${sexo}
                </span>

                <h3>
                    ${nome}
                </h3>

                <p>
                    ${descricao}
                </p>

                <a
                    href="#contato"
                    class="puppy-contact"
                    data-puppy="${nome}"
                >
                    TENHO INTERESSE
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>

        </article>
    `;
}


async function loadPuppies() {

    if (!puppiesGrid) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "filhotes"
                )
            );


        if (snapshot.empty) {

            puppiesGrid.innerHTML = `
                <div class="public-empty">

                    <i class="fa-solid fa-paw"></i>

                    <h3>
                        Novidades em breve
                    </h3>

                    <p>
                        Entre em contato para consultar
                        próximas ninhadas e disponibilidade.
                    </p>

                </div>
            `;

            return;
        }


        let html = "";


        snapshot.forEach(document => {

            html +=
                createPuppyCard(
                    document.data()
                );

        });


        puppiesGrid.innerHTML =
            html;


        setupInterestButtons();

    }

    catch (error) {

        console.error(
            "Erro ao carregar filhotes:",
            error
        );


        puppiesGrid.innerHTML = `
            <div class="public-empty">

                <i class="fa-solid fa-paw"></i>

                <h3>
                    Rinno Frenchies
                </h3>

                <p>
                    Entre em contato para consultar
                    nossos Frenchies e próximas ninhadas.
                </p>

            </div>
        `;

    }

}


function setupInterestButtons() {

    document
        .querySelectorAll(
            "[data-puppy]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const puppyName =
                        button.dataset.puppy;


                    const type =
                        document.getElementById(
                            "interestType"
                        );


                    const message =
                        document.getElementById(
                            "interestMessage"
                        );


                    if (type) {

                        type.value =
                            "Filhote disponível";

                    }


                    if (message) {

                        message.value =
                            `Olá! Tenho interesse em ${puppyName}. Gostaria de receber mais informações.`;

                    }

                }
            );

        });

}


loadPuppies();
