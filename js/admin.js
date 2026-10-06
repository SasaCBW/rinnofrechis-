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


/* =========================================
   ELEMENTOS
========================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const adminEmail =
    document.getElementById(
        "adminEmail"
    );

const settingsEmail =
    document.getElementById(
        "settingsEmail"
    );

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

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );

const sections =
    document.querySelectorAll(
        ".admin-section"
    );


/* =========================================
   PROTEGER PAINEL
========================================= */

onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            window.location.href =
                "admin-login.html";

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


        carregarFilhotes();

        carregarInteressados();

    }
);


/* =========================================
   SAIR
========================================= */

logoutButton?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "admin-login.html";

        }

        catch (error) {

            console.error(
                "Erro ao sair:",
                error
            );

        }

    }
);


/* =========================================
   MENU
========================================= */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const sectionId =
                item.dataset.section;


            menuItems.forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            sections.forEach(
                section => {

                    section.classList.remove(
                        "active"
                    );

                }
            );


            item.classList.add(
                "active"
            );


            const target =
                document.getElementById(
                    sectionId
                );


            if (target) {

                target.classList.add(
                    "active"
                );

            }


            if (pageTitle) {

                pageTitle.textContent =
                    item.innerText.trim();

            }


            sidebar?.classList.remove(
                "active"
            );

        }
    );

});


/* =========================================
   MENU MOBILE
========================================= */

sidebarButton?.addEventListener(
    "click",
    () => {

        sidebar?.classList.toggle(
            "active"
        );

    }
);


/* =========================================
   MODAL FILHOTE
========================================= */

const newPuppyButton =
    document.getElementById(
        "newPuppyButton"
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

const puppiesAdminGrid =
    document.getElementById(
        "puppiesAdminGrid"
    );

const puppyMessage =
    document.getElementById(
        "puppyMessage"
    );


newPuppyButton?.addEventListener(
    "click",
    () => {

        puppyModal?.classList.add(
            "active"
        );

    }
);


closePuppyModal?.addEventListener(
    "click",
    () => {

        puppyModal?.classList.remove(
            "active"
        );

    }
);


puppyModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            puppyModal
        ) {

            puppyModal.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================
   CADASTRAR FILHOTE
========================================= */

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

            puppyMessage.className =
                "form-message error";

            puppyMessage.textContent =
                "Preencha todos os campos obrigatórios.";

            return;
        }


        try {

            puppyMessage.className =
                "form-message";

            puppyMessage.textContent =
                "Salvando...";


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


            puppyMessage.className =
                "form-message success";

            puppyMessage.textContent =
                "Filhote cadastrado com sucesso!";


            puppyForm.reset();


            await carregarFilhotes();


            setTimeout(
                () => {

                    puppyModal
                        ?.classList
                        .remove(
                            "active"
                        );

                    puppyMessage.textContent =
                        "";

                },
                900
            );

        }

        catch (error) {

            console.error(
                "Erro ao cadastrar:",
                error
            );


            puppyMessage.className =
                "form-message error";

            puppyMessage.textContent =
                "Não foi possível cadastrar o filhote.";

        }

    }
);


/* =========================================
   CARREGAR FILHOTES
========================================= */

async function carregarFilhotes() {

    if (!puppiesAdminGrid) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "filhotes"
                )
            );


        let html = "";

        let total = 0;

        let disponiveis = 0;


        snapshot.forEach(
            documento => {

                total++;


                const dados =
                    documento.data();


                if (
                    dados.status ===
                    "Disponível"
                ) {

                    disponiveis++;

                }


                const nome =
                    escapeHTML(
                        dados.nome ||
                        "Filhote"
                    );


                const sexo =
                    escapeHTML(
                        dados.sexo ||
                        ""
                    );


                const status =
                    escapeHTML(
                        dados.status ||
                        ""
                    );


                const descricao =
                    escapeHTML(
                        dados.descricao ||
                        ""
                    );


                const foto =
                    escapeHTML(
                        dados.foto ||
                        "imagens/cachorro-01.jpeg"
                    );


                html += `

                    <article
                        class="admin-puppy"
                    >

                        <img
                            src="${foto}"
                            alt="${nome}"
                            style="
                                width:100%;
                                height:210px;
                                object-fit:cover;
                            "
                        >

                        <div
                            class="admin-puppy-content"
                        >

                            <h3>
                                ${nome}
                            </h3>

                            <p>
                                ${sexo}
                            </p>

                            <span
                                class="puppy-admin-status"
                            >
                                ${status}
                            </span>

                            <p
                                style="
                                    margin-top:12px;
                                "
                            >
                                ${descricao}
                            </p>


                            <button
                                class="delete-puppy"
                                data-id="${documento.id}"
                            >

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                                Excluir

                            </button>

                        </div>

                    </article>

                `;

            }
        );


        const totalElement =
            document.getElementById(
                "totalFilhotes"
            );


        const availableElement =
            document.getElementById(
                "totalDisponiveis"
            );


        if (totalElement) {

            totalElement.textContent =
                total;

        }


        if (availableElement) {

            availableElement.textContent =
                disponiveis;

        }


        if (!html) {

            html = `

                <div
                    class="empty-state big"
                >

                    <i
                        class="fa-solid fa-dog"
                    ></i>

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


        configurarExclusaoFilhotes();

    }

    catch (error) {

        console.error(
            "Erro ao carregar filhotes:",
            error
        );


        puppiesAdminGrid.innerHTML = `

            <div
                class="empty-state big"
            >

                <i
                    class="fa-solid fa-triangle-exclamation"
                ></i>

                <h3>
                    Não foi possível carregar
                </h3>

                <p>
                    Verifique o Firebase
                    e as regras do Firestore.
                </p>

            </div>

        `;

    }

}


/* =========================================
   EXCLUIR FILHOTE
========================================= */

function configurarExclusaoFilhotes() {

    const buttons =
        document.querySelectorAll(
            ".delete-puppy"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.dataset.id;


                    const confirmar =
                        confirm(
                            "Deseja realmente excluir este filhote?"
                        );


                    if (!confirmar) {
                        return;
                    }


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


                        alert(
                            "Não foi possível excluir o filhote."
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   INTERESSADOS
========================================= */

async function carregarInteressados() {

    const interestedTable =
        document.getElementById(
            "interestedTable"
        );


    const recentInterested =
        document.getElementById(
            "recentInterested"
        );


    if (
        !interestedTable ||
        !recentInterested
    ) {

        return;
    }


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
                await getDocs(
                    consulta
                );

        }

        catch (queryError) {

            console.warn(
                "Ordenação indisponível:",
                queryError
            );


            snapshot =
                await getDocs(
                    interessadosRef
                );

        }


        let tableHTML = "";

        let recentHTML = "";

        let total = 0;


        snapshot.forEach(
            documento => {

                total++;


                const dados =
                    documento.data();


                const nome =
                    escapeHTML(
                        dados.nome ||
                        "Contato"
                    );


                const contato =
                    escapeHTML(
                        dados.telefone ||
                        dados.email ||
                        "-"
                    );


                const interesse =
                    escapeHTML(
                        dados.interesse ||
                        "Informações"
                    );


                const status =
                    escapeHTML(
                        dados.status ||
                        "novo"
                    );


                let data = "-";


                if (
                    dados.criadoEm?.toDate
                ) {

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
                            ${nome}
                        </td>

                        <td>
                            ${contato}
                        </td>

                        <td>
                            ${interesse}
                        </td>

                        <td>
                            ${data}
                        </td>

                        <td>
                            ${status}
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
                                ${nome}
                            </strong>

                            <p
                                style="
                                    color:#78817b;
                                    font-size:12px;
                                    margin-top:4px;
                                "
                            >
                                ${interesse}
                            </p>

                        </div>

                    `;

                }

            }
        );


        const totalInterested =
            document.getElementById(
                "totalInteressados"
            );


        if (totalInterested) {

            totalInterested.textContent =
                total;

        }


        interestedTable.innerHTML =
            tableHTML ||
            `

                <tr>

                    <td colspan="5">

                        <div
                            class="empty-state"
                        >
                            Nenhum contato recebido.
                        </div>

                    </td>

                </tr>

            `;


        recentInterested.innerHTML =
            recentHTML ||
            `

                <div
                    class="empty-state"
                >

                    <i
                        class="fa-regular fa-envelope"
                    ></i>

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


/* =========================================
   SEGURANÇA DE TEXTO
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ?? ""
        );


    return div.innerHTML;
}
