import {
    auth,
    db
} from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


/* =====================================================
   ADMIN AUTORIZADO
===================================================== */

const ADMIN_UID =
    "NlyCmP4wDwd5nEI6Wb0n2d8bMsK2";


/* =====================================================
   ELEMENTOS
===================================================== */

const sidebar =
    document.getElementById(
        "sidebar"
    );


const sidebarButton =
    document.getElementById(
        "sidebarButton"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


const adminEmail =
    document.getElementById(
        "adminEmail"
    );


const settingsEmail =
    document.getElementById(
        "settingsEmail"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const newPuppyButton =
    document.getElementById(
        "newPuppyButton"
    );


const dashboardNewPuppy =
    document.getElementById(
        "dashboardNewPuppy"
    );


const puppyModal =
    document.getElementById(
        "puppyModal"
    );


const closePuppyModal =
    document.getElementById(
        "closePuppyModal"
    );


const puppyForm =
    document.getElementById(
        "puppyForm"
    );


const puppyMessage =
    document.getElementById(
        "puppyMessage"
    );


const savePuppyButton =
    document.getElementById(
        "savePuppyButton"
    );


const puppiesAdminGrid =
    document.getElementById(
        "puppiesAdminGrid"
    );


const interestedTable =
    document.getElementById(
        "interestedTable"
    );


const recentInterested =
    document.getElementById(
        "recentInterested"
    );


const totalFilhotes =
    document.getElementById(
        "totalFilhotes"
    );


const totalDisponiveis =
    document.getElementById(
        "totalDisponiveis"
    );


const totalInteressados =
    document.getElementById(
        "totalInteressados"
    );


/* =====================================================
   AUTENTICAÇÃO
===================================================== */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.replace(
                "./admin-login.html"
            );

            return;
        }


        if (user.uid !== ADMIN_UID) {

            await signOut(auth);


            window.location.replace(
                "./admin-login.html"
            );

            return;
        }


        if (adminEmail) {

            adminEmail.textContent =
                user.email ||
                "Administrador";

        }


        if (settingsEmail) {

            settingsEmail.textContent =
                user.email ||
                "Administrador";

        }


        await carregarPainel();

    }
);


/* =====================================================
   LOGOUT
===================================================== */

logoutButton?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        }

        finally {

            window.location.replace(
                "./admin-login.html"
            );

        }

    }
);


/* =====================================================
   NAVEGAÇÃO
===================================================== */

const titles = {

    dashboard:
        "Visão geral",

    filhotes:
        "Frenchies",

    interessados:
        "Interessados",

    galeria:
        "Galeria",

    configuracoes:
        "Configurações"
};


function abrirSecao(sectionId) {

    document
        .querySelectorAll(
            ".admin-section"
        )
        .forEach(section => {

            section.classList.remove(
                "active"
            );

        });


    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const section =
        document.getElementById(
            sectionId
        );


    section?.classList.add(
        "active"
    );


    const menuButton =
        document.querySelector(
            `[data-section="${sectionId}"]`
        );


    menuButton?.classList.add(
        "active"
    );


    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionId] ||
            "Painel";

    }


    sidebar?.classList.remove(
        "active"
    );

}


document
    .querySelectorAll(
        ".menu-item"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                abrirSecao(
                    button.dataset.section
                );

            }
        );

    });


document
    .querySelectorAll(
        "[data-open-section]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                abrirSecao(
                    button.dataset.openSection
                );

            }
        );

    });


sidebarButton?.addEventListener(
    "click",
    () => {

        sidebar?.classList.toggle(
            "active"
        );

    }
);


/* =====================================================
   MODAL
===================================================== */

function abrirModal() {

    if (!puppyModal) {
        return;
    }


    puppyModal.classList.add(
        "active"
    );


    puppyModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    puppyMessage.textContent =
        "";

}


function fecharModal() {

    if (!puppyModal) {
        return;
    }


    puppyModal.classList.remove(
        "active"
    );


    puppyModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


newPuppyButton?.addEventListener(
    "click",
    abrirModal
);


dashboardNewPuppy?.addEventListener(
    "click",
    abrirModal
);


closePuppyModal?.addEventListener(
    "click",
    fecharModal
);


puppyModal
    ?.querySelector(
        ".modal-backdrop"
    )
    ?.addEventListener(
        "click",
        fecharModal
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            puppyModal?.classList.contains(
                "active"
            )
        ) {

            fecharModal();

        }

    }
);


/* =====================================================
   CADASTRAR FRENCHIE
===================================================== */

puppyForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const nome =
            document
                .getElementById(
                    "puppyName"
                )
                .value
                .trim();


        const sexo =
            document
                .getElementById(
                    "puppyGender"
                )
                .value;


        const status =
            document
                .getElementById(
                    "puppyStatus"
                )
                .value;


        const foto =
            document
                .getElementById(
                    "puppyPhoto"
                )
                .value;


        const descricao =
            document
                .getElementById(
                    "puppyDescription"
                )
                .value
                .trim();


        if (
            !nome ||
            !sexo ||
            !status ||
            !foto
        ) {

            mostrarMensagemFilhote(
                "Preencha os campos obrigatórios."
            );

            return;
        }


        if (!fotoSegura(foto)) {

            mostrarMensagemFilhote(
                "A imagem selecionada não é válida."
            );

            return;
        }


        try {

            setSaving(true);


            await addDoc(
                collection(
                    db,
                    "filhotes"
                ),
                {
                    nome,
                    sexo,
                    status,
                    foto,
                    descricao,

                    criadoEm:
                        serverTimestamp()
                }
            );


            mostrarMensagemFilhote(
                "Frenchie cadastrado com sucesso.",
                true
            );


            puppyForm.reset();


            await carregarFilhotes();


            setTimeout(
                fecharModal,
                700
            );

        }

        catch (error) {

            console.error(
                "Erro ao cadastrar:",
                error
            );


            mostrarMensagemFilhote(
                "Não foi possível cadastrar. Verifique as permissões do Firebase."
            );

        }

        finally {

            setSaving(false);

        }

    }
);


/* =====================================================
   CARREGAR TUDO
===================================================== */

async function carregarPainel() {

    await Promise.all([
        carregarFilhotes(),
        carregarInteressados()
    ]);

}


/* =====================================================
   FILHOTES
===================================================== */

async function carregarFilhotes() {

    if (!puppiesAdminGrid) {
        return;
    }


    puppiesAdminGrid.innerHTML = `
        <div class="admin-loading">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            Carregando...
        </div>
    `;


    try {

        let snapshot;


        try {

            const q =
                query(
                    collection(
                        db,
                        "filhotes"
                    ),
                    orderBy(
                        "criadoEm",
                        "desc"
                    )
                );


            snapshot =
                await getDocs(q);

        }

        catch {

            snapshot =
                await getDocs(
                    collection(
                        db,
                        "filhotes"
                    )
                );

        }


        const items = [];


        snapshot.forEach(document => {

            items.push({
                id: document.id,
                ...document.data()
            });

        });


        if (totalFilhotes) {

            totalFilhotes.textContent =
                items.length;

        }


        if (totalDisponiveis) {

            totalDisponiveis.textContent =
                items.filter(
                    item =>
                        String(
                            item.status
                        ).toLowerCase() ===
                        "disponível"
                ).length;

        }


        if (items.length === 0) {

            puppiesAdminGrid.innerHTML = `
                <div class="admin-empty">
                    Nenhum Frenchie cadastrado ainda.
                </div>
            `;

            return;
        }


        puppiesAdminGrid.innerHTML =
            items
                .map(
                    createAdminPuppyCard
                )
                .join("");


        document
            .querySelectorAll(
                "[data-delete-puppy]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.deletePuppy;


                        const confirmed =
                            window.confirm(
                                "Deseja realmente excluir este Frenchie?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        await excluirFilhote(
                            id
                        );

                    }
                );

            });

    }

    catch (error) {

        console.error(
            "Erro ao carregar Frenchies:",
            error
        );


        puppiesAdminGrid.innerHTML = `
            <div class="admin-empty">
                Não foi possível carregar os Frenchies.
            </div>
        `;

    }

}


function createAdminPuppyCard(item) {

    const nome =
        escapeHTML(
            item.nome ||
            "Frenchie"
        );


    const sexo =
        escapeHTML(
            item.sexo ||
            ""
        );


    const status =
        escapeHTML(
            item.status ||
            ""
        );


    const descricao =
        escapeHTML(
            item.descricao ||
            "Sem descrição."
        );


    const foto =
        fotoSegura(
            item.foto
        )
            ? item.foto
            : "imagens/cachorro-01.jpeg";


    return `
        <article class="admin-puppy-card">

            <div class="admin-puppy-photo">

                <img
                    src="./${foto}"
                    alt="${nome}"
                >

                <span>
                    ${status}
                </span>

            </div>


            <div class="admin-puppy-content">

                <small>
                    ${sexo}
                </small>

                <h3>
                    ${nome}
                </h3>

                <p>
                    ${descricao}
                </p>


                <div class="admin-puppy-actions">

                    <button
                        type="button"
                        class="delete-button"
                        data-delete-puppy="${item.id}"
                    >
                        <i class="fa-regular fa-trash-can"></i>

                        Excluir
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =====================================================
   EXCLUIR FILHOTE
===================================================== */

async function excluirFilhote(id) {

    try {

        await deleteDoc(
            doc(
                db,
                "filhotes",
                id
            )
        );


        await carregarFilhotes();

    }

    catch (error) {

        console.error(
            "Erro ao excluir:",
            error
        );


        window.alert(
            "Não foi possível excluir."
        );

    }

}


/* =====================================================
   INTERESSADOS
===================================================== */

async function carregarInteressados() {

    try {

        let snapshot;


        try {

            const q =
                query(
                    collection(
                        db,
                        "interessados"
                    ),
                    orderBy(
                        "criadoEm",
                        "desc"
                    )
                );


            snapshot =
                await getDocs(q);

        }

        catch {

            snapshot =
                await getDocs(
                    collection(
                        db,
                        "interessados"
                    )
                );

        }


        const items = [];


        snapshot.forEach(document => {

            items.push({
                id: document.id,
                ...document.data()
            });

        });


        if (totalInteressados) {

            totalInteressados.textContent =
                items.length;

        }


        renderInterestedTable(
            items
        );


        renderRecentInterested(
            items.slice(0,5)
        );

    }

    catch (error) {

        console.error(
            "Erro ao carregar interessados:",
            error
        );


        if (interestedTable) {

            interestedTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        Não foi possível carregar os contatos.
                    </td>
                </tr>
            `;

        }


        if (recentInterested) {

            recentInterested.innerHTML = `
                <div class="admin-empty">
                    Não foi possível carregar os contatos.
                </div>
            `;

        }

    }

}


/* =====================================================
   TABELA
===================================================== */

function renderInterestedTable(items) {

    if (!interestedTable) {
        return;
    }


    if (items.length === 0) {

        interestedTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhum contato recebido ainda.
                </td>
            </tr>
        `;

        return;
    }


    interestedTable.innerHTML =
        items
            .map(item => {

                const nome =
                    escapeHTML(
                        item.nome ||
                        "Sem nome"
                    );


                const telefone =
                    escapeHTML(
                        item.telefone ||
                        ""
                    );


                const email =
                    escapeHTML(
                        item.email ||
                        ""
                    );


                const interesse =
                    escapeHTML(
                        item.interesse ||
                        ""
                    );


                const mensagem =
                    escapeHTML(
                        item.mensagem ||
                        "Sem mensagem"
                    );


                const data =
                    formatarData(
                        item.criadoEm
                    );


                return `
                    <tr>

                        <td>
                            <strong>
                                ${nome}
                            </strong>
                        </td>

                        <td>
                            ${telefone || "-"}
                            ${email
                                ? `<br>${email}`
                                : ""
                            }
                        </td>

                        <td>
                            ${interesse || "-"}
                        </td>

                        <td>
                            <span
                                class="table-message"
                                title="${mensagem}"
                            >
                                ${mensagem}
                            </span>
                        </td>

                        <td>
                            ${data}
                        </td>

                        <td>
                            <button
                                type="button"
                                class="table-delete"
                                data-delete-interest="${item.id}"
                                aria-label="Excluir contato"
                            >
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </td>

                    </tr>
                `;

            })
            .join("");


    document
        .querySelectorAll(
            "[data-delete-interest]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const confirmed =
                        window.confirm(
                            "Deseja excluir este contato?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    try {

                        await deleteDoc(
                            doc(
                                db,
                                "interessados",
                                button.dataset.deleteInterest
                            )
                        );


                        await carregarInteressados();

                    }

                    catch (error) {

                        console.error(
                            error
                        );


                        window.alert(
                            "Não foi possível excluir o contato."
                        );

                    }

                }
            );

        });

}


/* =====================================================
   CONTATOS RECENTES
===================================================== */

function renderRecentInterested(items) {

    if (!recentInterested) {
        return;
    }


    if (items.length === 0) {

        recentInterested.innerHTML = `
            <div class="admin-empty">
                Nenhum contato recebido ainda.
            </div>
        `;

        return;
    }


    recentInterested.innerHTML =
        items
            .map(item => {

                const nome =
                    escapeHTML(
                        item.nome ||
                        "Interessado"
                    );


                const interesse =
                    escapeHTML(
                        item.interesse ||
                        "Contato pelo site"
                    );


                return `
                    <div class="recent-item">

                        <span class="recent-avatar">
                            <i class="fa-solid fa-user"></i>
                        </span>

                        <div class="recent-info">

                            <strong>
                                ${nome}
                            </strong>

                            <small>
                                ${interesse}
                            </small>

                        </div>

                    </div>
                `;

            })
            .join("");

}


/* =====================================================
   HELPERS
===================================================== */

function fotoSegura(value = "") {

    return /^imagens\/cachorro-(0[1-9]|1[0-4])\.jpeg$/
        .test(
            String(value)
        );

}


function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function formatarData(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !==
        "function"
    ) {

        return "-";

    }


    try {

        return timestamp
            .toDate()
            .toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

    }

    catch {

        return "-";

    }

}


function mostrarMensagemFilhote(
    message,
    success = false
) {

    if (!puppyMessage) {
        return;
    }


    puppyMessage.textContent =
        message;


    puppyMessage.style.color =
        success
            ? "#315a43"
            : "#a84747";

}


function setSaving(saving) {

    if (!savePuppyButton) {
        return;
    }


    savePuppyButton.disabled =
        saving;


    savePuppyButton.innerHTML =
        saving
            ? `
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                SALVANDO...
              `
            : `
                <i class="fa-solid fa-check"></i>
                SALVAR FRENCHIE
              `;

}
