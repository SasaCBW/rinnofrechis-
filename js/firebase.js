// ==========================================
// FIREBASE - RINNO FRENCHIES
// ==========================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// CONFIGURAÇÃO DO FIREBASE

const firebaseConfig = {

    apiKey: "AIzaSyB291UGL0-ITISE69Uxns9pPHqvlr7opxI",

    authDomain: "rinnofrenchies.firebaseapp.com",

    databaseURL:
        "https://rinnofrenchies-default-rtdb.firebaseio.com",

    projectId: "rinnofrenchies",

    storageBucket:
        "rinnofrenchies.firebasestorage.app",

    messagingSenderId:
        "797068872401",

    appId:
        "1:797068872401:web:0b7f644edcbf73263e13f0",

    measurementId:
        "G-9C84CF1LL7"
};


// INICIALIZA O FIREBASE

const app = initializeApp(firebaseConfig);


// AUTENTICAÇÃO

const auth = getAuth(app);


// FIRESTORE

const db = getFirestore(app);


// EXPORTA PARA OS OUTROS ARQUIVOS

export {
    app,
    auth,
    db
};
