import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  deleteDoc, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $ = id => document.getElementById(id);
let dogs = [];

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("admin-login.html");
    return;
  }
  try {
    const admin = await getDoc(doc(db, "admins", user.uid));
    if (!admin.exists() || admin.data().ativo !== true) {
      await signOut(auth);
      location.replace("admin-login.html");
      return;
    }
    $("auth-loading").hidden = true;
    $("admin-app").hidden = false;
    await Promise.all([loadDogs(), loadMessages()]);
  } catch (error) {
    console.error(error);
    $("auth-loading").textContent = "Não foi possível verificar as permissões administrativas.";
  }
});

$("logout").onclick = async () => {
  await signOut(auth);
  location.replace("admin-login.html");
};

function resetForm() {
  $("dog-form").reset();
  $("dog-id").value = "";
  $("dog-published").checked = true;
  $("dog-status").textContent = "";
}

$("cancel-edit").onclick = resetForm;

$("dog-form").addEventListener("submit", async event => {
  event.preventDefault();

  const id = $("dog-id").value;
  const data = {
    nome: $("dog-name").value.trim(),
    descricao: $("dog-description").value.trim(),
    foto: $("dog-photo").value.trim(),
    publicado: $("dog-published").checked,
    atualizadoEm: serverTimestamp()
  };

  if (!data.nome || !data.descricao || !data.foto) return;

  $("dog-status").textContent = "Salvando...";

  try {
    if (id) {
      await updateDoc(doc(db, "frenchies", id), data);
    } else {
      await addDoc(collection(db, "frenchies"), {
        ...data,
        criadoEm: serverTimestamp()
      });
    }
    resetForm();
    $("dog-status").textContent = "Frenchie salvo com sucesso!";
    await loadDogs();
  } catch (error) {
    console.error(error);
    $("dog-status").textContent = "Erro ao salvar. Verifique suas permissões.";
  }
});

async function loadDogs() {
  const area = $("admin-dogs");
  area.textContent = "Carregando...";
  try {
    const snap = await getDocs(query(collection(db, "frenchies"), orderBy("nome")));
    dogs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    $("count-dogs").textContent = dogs.length;
    area.replaceChildren();

    if (!dogs.length) area.textContent = "Nenhum Frenchie cadastrado.";

    dogs.forEach(dog => {
      const row = document.createElement("article");
      row.className = "admin-entry";

      const img = document.createElement("img");
      img.src = dog.foto || "";
      img.alt = dog.nome || "Frenchie";

      const content = document.createElement("div");
      content.className = "admin-entry-content";

      const title = document.createElement("h3");
      title.textContent = dog.nome;
      const desc = document.createElement("p");
      desc.textContent = dog.descricao;
      const visibility = document.createElement("p");
      visibility.textContent = dog.publicado ? "Publicado" : "Oculto";
      content.append(title, desc, visibility);

      const actions = document.createElement("div");
      actions.className = "entry-buttons";

      const edit = document.createElement("button");
      edit.textContent = "Editar";
      edit.onclick = () => {
        $("dog-id").value = dog.id;
        $("dog-name").value = dog.nome || "";
        $("dog-description").value = dog.descricao || "";
        $("dog-photo").value = dog.foto || "";
        $("dog-published").checked = dog.publicado === true;
        location.hash = "cadastro";
      };

      const remove = document.createElement("button");
      remove.textContent = "Excluir";
      remove.className = "danger";
      remove.onclick = async () => {
        if (!confirm(`Excluir ${dog.nome}?`)) return;
        try {
          await deleteDoc(doc(db, "frenchies", dog.id));
          await loadDogs();
        } catch (error) {
          alert("Não foi possível excluir o registro.");
          console.error(error);
        }
      };

      actions.append(edit, remove);
      row.append(img, content, actions);
      area.append(row);
    });
  } catch (error) {
    console.error(error);
    area.textContent = "Erro ao carregar os Frenchies.";
  }
}

async function loadMessages() {
  const area = $("admin-messages");
  area.textContent = "Carregando...";
  try {
    const snap = await getDocs(query(collection(db, "contatos"), orderBy("criadoEm", "desc")));
    $("count-messages").textContent = snap.size;
    area.replaceChildren();

    if (snap.empty) area.textContent = "Nenhuma mensagem recebida.";

    snap.forEach(record => {
      const data = record.data();
      const row = document.createElement("article");
      row.className = "admin-entry";

      const content = document.createElement("div");
      content.className = "admin-entry-content";

      const title = document.createElement("h3");
      title.textContent = data.nome || "Contato";

      const details = document.createElement("p");
      details.textContent = `${data.email || ""} · ${data.telefone || ""} · ${data.assunto || ""}`;

      const message = document.createElement("p");
      message.textContent = data.mensagem || "";

      content.append(title, details, message);
      row.append(content);
      area.append(row);
    });
  } catch (error) {
    console.error(error);
    area.textContent = "Erro ao carregar as mensagens.";
  }
}
