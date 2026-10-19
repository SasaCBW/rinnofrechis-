
import "./script.js";
import { db } from "./firebase.js";
import {
  addDoc, collection, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const button = document.getElementById("send-btn");
const whatsapp = document.getElementById("whatsapp-link");

const number = String(window.RINNO?.whatsapp || "").replace(/\D/g, "");
if (/^\d{12,13}$/.test(number)) {
  whatsapp.href = `https://wa.me/${number}`;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener noreferrer";
} else {
  whatsapp.textContent = "WhatsApp ainda não configurado";
  whatsapp.removeAttribute("href");
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  button.disabled = true;
  status.textContent = "Enviando sua mensagem...";

  try {
    await addDoc(collection(db, "contatos"), {
      nome: String(data.get("nome")).trim(),
      email: String(data.get("email")).trim(),
      telefone: String(data.get("telefone")).trim(),
      assunto: String(data.get("assunto")).trim(),
      mensagem: String(data.get("mensagem")).trim(),
      status: "novo",
      criadoEm: serverTimestamp()
    });

    status.textContent = "Mensagem registrada com sucesso!";
    form.reset();
  } catch (error) {
    console.error(error);
    status.textContent = "Não foi possível enviar. Verifique a conexão ou tente novamente.";
  } finally {
    button.disabled = false;
  }
});
