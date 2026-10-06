import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const form =
    document.getElementById(
        "interestForm"
    );

const statusMessage =
    document.getElementById(
        "interestMessageStatus"
    );

const submitButton =
    document.getElementById(
        "sendInterestButton"
    );


function showMessage(
    message,
    success = false
) {

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent =
        message;

    statusMessage.style.color =
        success
            ? "#315a43"
            : "#a53d3d";
}


form?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const nome =
            document
                .getElementById(
                    "interestName"
                )
                .value
                .trim();


        const telefone =
            document
                .getElementById(
                    "interestPhone"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "interestEmail"
                )
                .value
                .trim();


        const interesse =
            document
                .getElementById(
                    "interestType"
                )
                .value;


        const mensagem =
            document
                .getElementById(
                    "interestMessage"
                )
                .value
                .trim();


        if (
            !nome ||
            !telefone ||
            !interesse
        ) {

            showMessage(
                "Preencha os campos obrigatórios."
            );

            return;
        }


        try {

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerHTML = `
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    ENVIANDO...
                `;
            }


            showMessage(
                "Enviando..."
            );


            await addDoc(
                collection(
                    db,
                    "interessados"
                ),
                {
                    nome,
                    telefone,
                    email,
                    interesse,
                    mensagem,

                    status:
                        "novo",

                    criadoEm:
                        serverTimestamp()
                }
            );


            form.reset();


            showMessage(
                "Mensagem enviada com sucesso! Obrigado pelo interesse.",
                true
            );

        }

        catch (error) {

            console.error(
                "Erro ao enviar interesse:",
                error
            );


            showMessage(
                "Não foi possível enviar agora. Tente novamente."
            );

        }

        finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.innerHTML = `
                    <span>
                        ENVIAR INTERESSE
                    </span>

                    <i class="fa-solid fa-arrow-right"></i>
                `;

            }

        }

    }
);
