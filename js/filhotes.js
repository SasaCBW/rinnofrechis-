import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const puppiesGrid = document.getElementById("puppiesGrid");


async function carregarFilhotesPublicos() {

    if (!puppiesGrid) return;

    puppiesGrid.innerHTML = `
        <div class="puppies-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Carregando filhotes...</p>
        </div>
    `;

    try {

        const snapshot = await getDocs(
            collection(db, "filhotes")
        );

        if (snapshot.empty) {

            puppiesGrid.innerHTML = `
                <div class="public-empty">
                    <i class="fa-solid fa-paw"></i>

                    <h3>Novidades em breve</h3>

                    <p>
                        Entre em contato para saber
                        sobre nossas próximas ninhadas.
                    </p>

                    <a href="#contato" class="empty-contact-button">
                        Entrar em contato
                    </a>
                </div>
            `;

            return;
        }


        let html = "";


        snapshot.forEach(documento => {

            const filhote = documento.data();

            const nome = escapeHTML(
                filhote.nome || "Filhote"
            );

            const sexo = escapeHTML(
                filhote.sexo || ""
            );

            const status = escapeHTML(
                filhote.status || "Disponível"
            );

            const descricao = escapeHTML(
                filhote.descricao ||
                "Entre em contato para mais informações."
            );

            const foto = escapeHTML(
                filhote.foto ||
                "imagens/cachorro-01.jpeg"
            );


            html += `
                <article class="puppy-card">

                    <div class="puppy-image">

                        <img
                            src="${foto}"
                            alt="Foto de ${nome}"
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

                        <h3>${nome}</h3>

                        <p>
                            ${descricao}
                        </p>

                        <a
                            href="#contato"
                            class="puppy-contact"
                            data-puppy="${nome}"
                        >
                            Tenho interesse

                            <i class="fa-solid fa-arrow-right"></i>
                        </a>

                    </div>

                </article>
            `;

        });


        puppiesGrid.innerHTML = html;

        configurarBotoesInteresse();

    }

    catch (error) {

        console.error(
            "Erro ao carregar filhotes:",
            error
        );

        puppiesGrid.innerHTML = `
            <div class="public-empty">

                <i class="fa-solid fa-paw"></i>

                <h3>Conheça nossos filhotes</h3>

                <p>
                    Entre em contato conosco para
                    consultar disponibilidade.
                </p>

                <a href="#contato" class="empty-contact-button">
                    Entrar em contato
                </a>

            </div>
        `;

    }

}


function configurarBotoesInteresse() {

    const buttons = document.querySelectorAll(
        ".puppy-contact"
    );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const nome = button.dataset.puppy;

            setTimeout(() => {

                const select =
                    document.getElementById(
                        "interestType"
                    );

                const message =
                    document.getElementById(
                        "interestMessage"
                    );


                if (select) {
                    select.value =
                        "Filhote disponível";
                }


                if (message) {
                    message.value =
                        `Olá! Tenho interesse no filhote ${nome}. Gostaria de receber mais informações.`;
                }

            }, 100);

        });

    });

}


function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value ?? "");

    return element.innerHTML;
}


carregarFilhotesPublicos();
