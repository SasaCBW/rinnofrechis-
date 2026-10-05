import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");

const loginButton =
    document.getElementById("loginButton");

const togglePassword =
    document.getElementById("togglePassword");


/* MOSTRAR SENHA */

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        const showing =
            passwordInput.type === "text";

        passwordInput.type =
            showing ? "password" : "text";

        togglePassword.innerHTML =
            showing
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';

    });

}


/* VERIFICAR LOGIN */

onAuthStateChanged(auth, user => {

    if (user) {
        window.location.href = "admin.html";
    }

});


/* LOGIN */

loginForm.addEventListener("submit", async event => {

    event.preventDefault();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    loginMessage.textContent = "";

    loginButton.disabled = true;

    loginButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.className =
            "login-message success";

        loginMessage.textContent =
            "Login realizado!";


        window.location.href =
            "admin.html";

    }

    catch (error) {

        console.error(error);

        loginMessage.className =
            "login-message error";

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {

            loginMessage.textContent =
                "E-mail ou senha incorretos.";

        }

        else if (
            error.code === "auth/too-many-requests"
        ) {

            loginMessage.textContent =
                "Muitas tentativas. Tente novamente mais tarde.";

        }

        else {

            loginMessage.textContent =
                "Não foi possível entrar. Verifique a configuração do Firebase.";

        }

    }

    finally {

        loginButton.disabled = false;

        loginButton.innerHTML =
            '<span>Entrar no painel</span><i class="fa-solid fa-arrow-right"></i>';

    }

});
