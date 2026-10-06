import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const loginForm =
    document.getElementById(
        "loginForm"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


/* MOSTRAR / ESCONDER SENHA */

togglePassword?.addEventListener(
    "click",
    () => {

        const visible =
            passwordInput.type ===
            "text";


        passwordInput.type =
            visible
                ? "password"
                : "text";


        togglePassword.innerHTML =
            visible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';

    }
);


/* SE JÁ ESTIVER LOGADO */

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            window.location.href =
                "admin.html";

        }

    }
);


/* LOGIN */

loginForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        loginMessage.textContent =
            "";


        loginButton.disabled =
            true;


        loginButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Entrando...
        `;


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            loginMessage.className =
                "login-message success";


            loginMessage.textContent =
                "Login realizado com sucesso!";


            window.location.href =
                "admin.html";

        }

        catch (error) {

            console.error(
                "Erro no login:",
                error
            );


            loginMessage.className =
                "login-message error";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                loginMessage.textContent =
                    "E-mail ou senha incorretos.";

            }

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                loginMessage.textContent =
                    "Muitas tentativas. Aguarde um pouco e tente novamente.";

            }

            else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                loginMessage.textContent =
                    "Verifique sua conexão com a internet.";

            }

            else {

                loginMessage.textContent =
                    "Não foi possível entrar no painel.";

            }

        }

        finally {

            loginButton.disabled =
                false;


            loginButton.innerHTML = `
                <span>
                    Entrar no painel
                </span>

                <i
                    class="fa-solid fa-arrow-right"
                ></i>
            `;

        }

    }
);
