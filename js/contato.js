import { db } from "./firebase.js";

import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const form = document.getElementById("interestForm");
const button = document.getElementById("sendInterestButton");
const status = document.getElementById("interestMessageStatus");

form.addEventListener("submit", async event => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const valor = id => document.getElementById(id).value.trim();

  button.disabled = true;
  status.textContent = "Enviando...";

  try {
    await addDoc(collection(db, "interessados"), {
      nome: valor("interestName"),
      telefone: valor("interestPhone"),
      email: valor("interestEmail"),
      interesse: valor("interestType"),
      mensagem: valor("interestMessage"),
      status: "novo",
      criadoEm: serverTimestamp()
    });

    form.reset();

    status.textContent = "Mensagem enviada com sucesso! ♡";
    status.style.color = "#357451";

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);

    status.textContent =
      "Não foi possível enviar. Verifique as regras do Firestore.";

    status.style.color = "#b43b52";

  } finally {
    button.disabled = false;
  }
});
