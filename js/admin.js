import {
    auth,
    db
} from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


/* ELEMENTOS */

const logoutButton =
    document.getElementById("logoutButton");

const adminEmail =
    document.getElementById("adminEmail");

const settingsEmail =
    document.getElementById("settingsEmail");

const sidebar =
    document.getElementById("sidebar");

const sidebarButton =
    document.getElementById("sidebarButton");

const pageTitle =
    document.getElementById("pageTitle");

const menuItems =
    document.querySelectorAll(".menu-item");

const sections =
    document.querySelectorAll(".admin-section");


/* PROTEGER PAINEL */

onAuthStateChanged(auth, user => {

    if (!user) {

        window.location.href =
            "admin-login.html";

        return;

    }


    if (adminEmail) {
        adminEmail.textContent =
            user.email || "Administrador";
    }

    if (settingsEmail) {
        settingsEmail.textContent =
            user.email || "Administrador";
    }


    carregarFilhotes();
    carregarInteressados();

});


/* LOGOUT */

logoutButton?.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        window.location.href =
            "admin-login.html";

    }
);


/* MENU */

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const sectionId =
            item.dataset.section;


        menuItems.forEach(button =>
            button.classList.remove("active")
        );


        sections.forEach(section =>
            section.classList.remove("active")
        );


        item.classList.add("active");


        const target =
            document.getElementById(sectionId);

        if (target) {
            target.classList.add("active");
        }


        pageTitle.textContent =
            item.innerText.trim();


        sidebar.classList.remove("active");

    });

});


/* MENU MOBILE */

sidebarButton?.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle("active");

    }
);


/* =============================
   FILHOTES
============================= */

const newPuppyButton =
    document.getElementById("newPuppyButton");

const puppyModal =
    document.getElementById("puppyModal");

const closePuppyModal =
    document.getElementById("closePuppyModal");

const puppyForm =
    document.getElementById("puppyForm");

const puppiesAdminGrid =
    document.getElementById("puppiesAdminGrid");

const puppyMessage =
    document.getElementById("puppyMessage");


newPuppyButton?.addEventListener(
    "click",
    () => {

        puppyModal.classList.add("active");

    }
);


closePuppyModal?.addEventListener(
    "click",
    () => {

        puppyModal.classList.remove("active");

    }
);


puppyModal?.addEventListener(
    "click",
    event => {

        if (event.target === puppyModal) {

            puppyModal.classList.remove(
                "active"
            );

        }

    }
);


/* SALVAR FILHOTE */

puppyForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const nome =
            document
                .getElementById("puppyName")
                .value
                .trim();

        const sexo =
            document
                .getElementById("puppyGender")
                .value;

        const status =
            document
                .getElementById("puppyStatus")
                .value;

        const descricao =
            document
                .getElementById("puppyDescription")
                .value
                .trim();


        try {

            await addDoc(
                collection(db, "filhotes"),
                {

                    nome,
                    sexo,
                    status,
                    descricao,

                    criadoEm:
                        serverTimestamp()

                }
            );


            puppyMessage.className =
                "form-message success";

            puppyMessage.textContent =
                "Filhote cadastrado com sucesso!";


            puppyForm.reset();


            await carregarFilhotes();


            setTimeout(() => {

                puppyModal.classList.remove(
                    "active"
                );

                puppyMessage.textContent = "";

            }, 800);

        }

        catch (error) {

            console.error(error);

            puppyMessage.className =
                "form-message error";

            puppyMessage.textContent =
                "Não foi possível cadastrar.";

        }

    }
);


/* CARREGAR FILHOTES */

async function carregarFilhotes() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "filhotes")
            );


        let html = "";

        let total = 0;

        let disponiveis = 0;


        snapshot.forEach(documento => {

            total++;

            const dados =
                documento.data();


            if (
                dados.status === "Disponível"
            ) {

                disponiveis++;

            }


            html += `

                <article class="admin-puppy">

                    <div class="admin-puppy-content">

                        <h3>
                            ${escapeHTML(dados.nome)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                dados.sexo || ""
                            )}
                        </p>

                        <span class="puppy-admin-status">
                            ${escapeHTML(
                                dados.status || ""
                            )}
                        </span>

                        <p style="margin-top:12px;">
                            ${escapeHTML(
                                dados.descricao || ""
                            )}
                        </p>

                        <button
                            class="delete-puppy"
                            data-id="${documento.id}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Excluir
                        </button>

                    </div>

                </article>

            `;

        });


        document
            .getElementById("totalFilhotes")
            .textContent = total;


        document
            .getElementById("totalDisponiveis")
            .textContent = disponiveis;


        if (!html) {

            html = `

                <div class="empty-state big">

                    <i class="fa-solid fa-dog"></i>

                    <h3>
                        Nenhum filhote cadastrado
                    </h3>

                    <p>
                        Clique em "Novo filhote"
                        para começar.
                    </p>

                </div>

            `;

        }


        puppiesAdminGrid.innerHTML =
            html;


        document
            .querySelectorAll(".delete-puppy")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;

                        const confirmar =
                            confirm(
                                "Deseja excluir este filhote?"
                            );

                        if (!confirmar) return;


                        await deleteDoc(
                            doc(
                                db,
                                "filhotes",
                                id
                            )
                        );


                        carregarFilhotes();

                    }
                );

            });

    }

    catch (error) {

        console.error(
            "Erro ao carregar filhotes:",
            error
        );

    }

}


/* =============================
   INTERESSADOS
============================= */

async function carregarInteressados() {

    const interestedTable =
        document.getElementById(
            "interestedTable"
        );

    const recentInterested =
        document.getElementById(
            "recentInterested"
        );


    try {

        const interessadosRef =
            collection(
                db,
                "interessados"
            );


        let snapshot;

        try {

            const consulta =
                query(
                    interessadosRef,
                    orderBy(
                        "criadoEm",
                        "desc"
                    )
                );

            snapshot =
                await getDocs(consulta);

        }

        catch {

            snapshot =
                await getDocs(
                    interessadosRef
                );

        }


        let tableHTML = "";

        let recentHTML = "";

        let total = 0;


        snapshot.forEach(documento => {

            total++;

            const dados =
                documento.data();


            let data = "-";


            if (dados.criadoEm?.toDate) {

                data =
                    dados
                        .criadoEm
                        .toDate()
                        .toLocaleDateString(
                            "pt-BR"
                        );

            }


            tableHTML += `

                <tr>

                    <td>
                        ${escapeHTML(
                            dados.nome || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            dados.telefone ||
                            dados.email ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            dados.interesse ||
                            "Informações"
                        )}
                    </td>

                    <td>
                        ${data}
                    </td>

                    <td>
                        Novo
                    </td>

                </tr>

            `;


            if (total <= 5) {

                recentHTML += `

                    <div
                        style="
                            padding:15px 0;
                            border-bottom:
                            1px solid #e5e9e5;
                        "
                    >

                        <strong>
                            ${escapeHTML(
                                dados.nome || "Contato"
                            )}
                        </strong>

                        <p
                            style="
                                color:#78817b;
                                font-size:12px;
                                margin-top:4px;
                            "
                        >
                            ${escapeHTML(
                                dados.interesse ||
                                "Solicitou informações"
                            )}
                        </p>

                    </div>

                `;

            }

        });


        document
            .getElementById(
                "totalInteressados"
            )
            .textContent = total;


        interestedTable.innerHTML =
            tableHTML ||
            `

            <tr>

                <td colspan="5">

                    <div class="empty-state">
                        Nenhum contato recebido.
                    </div>

                </td>

            </tr>

            `;


        recentInterested.innerHTML =
            recentHTML ||
            `

            <div class="empty-state">

                <i class="fa-regular fa-envelope"></i>

                <p>
                    Nenhum contato recebido ainda.
                </p>

            </div>

            `;

    }

    catch (error) {

        console.error(
            "Erro ao carregar interessados:",
            error
        );

    }

}


/* SEGURANÇA PARA TEXTOS */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;

}
