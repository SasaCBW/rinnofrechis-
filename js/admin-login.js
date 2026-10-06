import {
    auth
} from "./firebase.js";


import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const ADMIN_UID =
    "NlyCmP4wDwd5nEI6Wb0n2d8bMsK2";


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


/* =====================================================
   SE JÁ ESTIVER LOGADO
===================================================== */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {
            return;
        }


        if (user.uid === ADMIN_UID) {

            window.location.replace(
                "./admin.html"
            );

            return;
        }


        await signOut(auth);

    }
);


/* =====================================================
   MOSTRAR SENHA
===================================================== */

togglePassword?.addEventListener(
    "click",
    () => {

        if (!passwordInput) {
            return;
        }


        const visible =
            passwordInput.type === "text";


        passwordInput.type =
            visible
                ? "password"
                : "text";


        const icon =
            togglePassword.querySelector(
                "i"
            );


        if (icon) {

            icon.className =
                visible
                    ? "fa-regular fa-eye"
                    : "fa-regular fa-eye-slash";

        }

    }
);


/* =====================================================
   LOGIN
===================================================== */

loginForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        if (!email || !password) {

            showMessage(
                "Informe o e-mail e a senha."
            );

            return;
        }


        try {

            setLoading(true);


            showMessage(
                "Verificando acesso...",
                true
            );


            const credential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            if (
                credential.user.uid !==
                ADMIN_UID
            ) {

                await signOut(auth);


                showMessage(
                    "Esta conta não possui acesso administrativo."
                );


                return;
            }


            showMessage(
                "Acesso autorizado.",
                true
            );


            window.location.replace(
                "./admin.html"
            );

        }

        catch (error) {

            console.error(
                "Erro no login:",
                error
            );


            let message =
                "Não foi possível entrar. Verifique seus dados.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "E-mail ou senha incorretos.";

            }


            if (
                error.code ===
                "auth/too-many-requests"
            ) {

                message =
                    "Muitas tentativas. Aguarde um pouco e tente novamente.";

            }


            if (
                error.code ===
                "auth/network-request-failed"
            ) {

                message =
                    "Falha de conexão. Verifique sua internet.";

            }


            showMessage(message);

        }

        finally {

            setLoading(false);

        }

    }
);


/* =====================================================
   FUNÇÕES
===================================================== */

function showMessage(
    message,
    success = false
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;


    loginMessage.style.color =
        success
            ? "#315a43"
            : "#a84747";
}


function setLoading(loading) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        loading;


    loginButton.innerHTML =
        loading
            ? `
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                ENTRANDO...
              `
            : `
                <span>
                    ENTRAR NO PAINEL
                </span>

                <i class="fa-solid fa-arrow-right"></i>
              `;
}
