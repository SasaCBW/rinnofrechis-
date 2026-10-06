import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const puppiesGrid =
    document.getElementById("puppiesGrid");


async function carregarFilhotesPublicos() {

    if (!puppiesGrid) return;

    puppiesGrid.innerHTML = `
        <div class="puppies-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Carregando filhotes...
        </div>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(db, "filhotes")
            );


        if (snapshot.empty) {

            puppiesGrid.innerHTML = `
                <div class="public-empty">
                    <i class="fa-solid fa-paw"></i>

                    <h3>
                        Novidades em breve
                    </h3>

                    <p>
                        Entre em contato para saber
                        sobre nossas próximas ninhadas.
                    </p>
                </div>
            `;

            return;
        }


        let html = "";


        snapshot.forEach(documento => {

            const filhote =
                documento.data();


            const nome =
                escapeHTML(
                    filhote.nome ||
                    "Filhote"
                );

            const sexo =
                escapeHTML(
                    filhote.sexo ||
                    ""
                );

            const status =
                escapeHTML(
                    filhote.status ||
                    "Disponível"
                );

            const descricao =
                escapeHTML(
                    filhote.descricao ||
                    "Entre em contato para mais informações."
                );


            html += `

                <article class="puppy-card">

                    <div class="puppy-image">

                        <img
                            src="imagens/cachorro-01.jpeg"
                            alt="${nome}"
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
                        >
                            Tenho interesse

                            <i class="fa-solid fa-arrow-right"></i>
                        </a>

                    </div>

                </article>

            `;

        });


        puppiesGrid.innerHTML =
            html;

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
                    Conheça nossos filhotes
                </h3>

                <p>
                    Entre em contato conosco
                    para consultar disponibilidade.
                </p>

            </div>
        `;

    }

}


function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value ?? "");

    return element.innerHTML;
}


carregarFilhotesPublicos();
