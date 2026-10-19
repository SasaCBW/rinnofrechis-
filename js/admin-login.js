import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const form = document.getElementById("login-form");
const status = document.getElementById("login-status");

async function isAdmin(user) {
  const snap = await getDoc(doc(db, "admins", user.uid));
  return snap.exists() && snap.data().ativo === true;
}

onAuthStateChanged(auth, async user => {
  if (!user) return;
  try {
    if (await isAdmin(user)) location.replace("admin.html");
  } catch (error) {
    console.error(error);
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  status.textContent = "Verificando acesso...";

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );

    if (!(await isAdmin(result.user))) {
      await signOut(auth);
      status.textContent = "Esta conta não possui autorização administrativa.";
      return;
    }

    location.replace("admin.html");
  } catch (error) {
    console.error(error);
    status.textContent = "Não foi possível entrar. Confira seus dados e permissões.";
  }
});
