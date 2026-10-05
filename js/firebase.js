import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth
} from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    getFirestore
} from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


/*
=============================================
CONFIGURAÇÃO DO FIREBASE
=============================================

SUBSTITUA pelos dados do Firebase deste site.

Firebase Console
→ Configurações do projeto
→ Seus aplicativos
→ Aplicativo Web
→ firebaseConfig
*/

const firebaseConfig = {

    apiKey: "COLOQUE_AQUI",

    authDomain: "COLOQUE_AQUI.firebaseapp.com",

    projectId: "COLOQUE_AQUI",

    storageBucket: "COLOQUE_AQUI.firebasestorage.app",

    messagingSenderId: "COLOQUE_AQUI",

    appId: "COLOQUE_AQUI"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
    app,
    auth,
    db
};
