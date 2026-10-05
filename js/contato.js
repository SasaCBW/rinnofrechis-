import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const form = document.getElementById("interestForm");
const statusMessage = document.getElementById("interestMessageStatus");


if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const name = document
            .getElementById("interestName")
            .value
            .trim();

        const phone = document
            .getElementById("interestPhone")
            .value
            .trim();

        const email = document
            .getElementById("interestEmail")
            .value
            .trim();

        const interest = document
            .getElementById("interestType")
            .value;

        const message = document
            .getElementById("interestMessage")
            .value
            .trim();

        const button =
            form.querySelector("button[type='submit']");


        if (!name || !phone || !interest) {

            statusMessage.textContent =
                "Preencha nome, WhatsApp e interesse.";

            return;

        }


        try {

            button.disabled = true;

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';


            await addDoc(
                collection(db, "interessados"),
                {

                    nome: name,

                    telefone: phone,

                    email: email,

                    interesse: interest,

                    mensagem: message,

                    status: "novo",

                    criadoEm: serverTimestamp()

                }
            );


            statusMessage.style.color =
                "#aee8bd";

            statusMessage.textContent =
                "Mensagem enviada com sucesso! Entraremos em contato.";


            form.reset();

        }

        catch (error) {

            console.error(
                "Erro ao enviar interesse:",
                error
            );


            statusMessage.style.color =
                "#ffb8b8";

            statusMessage.textContent =
                "Não foi possível enviar. Tente novamente.";

        }

        finally {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Enviar interesse';

        }

    });

}
