// =====================================================
// COMMUNITY LIBRARY MANAGEMENT SYSTEM
// JavaScript + DOM + Local Storage
// =====================================================


// =====================================================
// APPLICATION VARIABLES
// =====================================================

const app = document.getElementById("app");

let books = JSON.parse(localStorage.getItem("library_books")) || [];

let users = JSON.parse(localStorage.getItem("library_users")) || [];

let transactions =
    JSON.parse(localStorage.getItem("library_transactions")) || [];

let currentPage = "dashboard";

let editingBookId = null;

let editingUserId = null;


// =====================================================
// SAVE DATA
// =====================================================

function saveData() {

    localStorage.setItem(
        "library_books",
        JSON.stringify(books)
    );

    localStorage.setItem(
        "library_users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "library_transactions",
        JSON.stringify(transactions)
    );
}


// =====================================================
// CREATE ID
// =====================================================

function createId() {

    return Date.now().toString() +
        Math.random().toString(16).substring(2);
}


// =====================================================
// INITIAL DATA
// =====================================================

function createInitialData() {

    if (users.length === 0) {

        users = [

            {
                id: createId(),
                name: "System Administrator",
                membershipId: "ADMIN001",
                role: "Admin",
                password: "admin123"
            },

            {
                id: createId(),
                name: "Main Librarian",
                membershipId: "LIB001",
                role: "Librarian",
                password: "lib123"
            }

        ];
    }


    if (books.length === 0) {

        books = [

            {
                id: createId(),
                title: "Things Fall Apart",
                author: "Chinua Achebe",
                genre: "Fiction",
                isbn: "9780385474542",
                quantity: 4
            },

            {
                id: createId(),
                title: "The Alchemist",
                author: "Paulo Coelho",
                genre: "Novel",
                isbn: "9780061122415",
                quantity: 1
            }

        ];
    }

    saveData();
}


// =====================================================
// DOM HELPER
// =====================================================

function createElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}


// =====================================================
// LOGIN PAGE
// =====================================================

function renderLogin() {

    app.innerHTML = "";

    const page = createElement("div", "login-page");

    const card = createElement("div", "login-card");

    const title = createElement(
        "h1",
        "",
        "Community Library"
    );

    const subtitle = createElement(
        "p",
        "",
        "Library Management System"
    );

    const form = createElement("form");

    const idGroup = createElement("div", "form-group");

    const idLabel = createElement(
        "label",
        "",
        "Membership ID"
    );

    const idInput = createElement("input");

    idInput.type = "text";
    idInput.placeholder = "Enter membership ID";
    idInput.required = true;

    idGroup.appendChild(idLabel);
    idGroup.appendChild(idInput);


    const passwordGroup =
        createElement("div", "form-group");

    const passwordLabel = createElement(
        "label",
        "",
        "Password"
    );

    const passwordInput =
        createElement("input");

    passwordInput.type = "password";
    passwordInput.placeholder = "Enter password";
    passwordInput.required = true;

    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);


    const loginButton =
        createElement("button", "primary", "Login");

    loginButton.type = "submit";


    const message =
        createElement("div");

    form.appendChild(idGroup);
    form.appendChild(passwordGroup);
    form.appendChild(loginButton);
    form.appendChild(message);

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(form);

    page.appendChild(card);

    app.appendChild(page);


    form.addEventListener("submit", function(event) {

        event.preventDefault();

        login(
            idInput.value.trim(),
            passwordInput.value,
            message
        );

    });
}


// =====================================================
// LOGIN
// =====================================================

function login(membershipId, password, message) {

    const user = users.find(function(user) {

        return user.membershipId === membershipId &&
               user.password === password;

    });


    if (!user) {

        message.textContent =
            "Invalid membership ID or password.";

        message.className = "message";

        return;
    }


    localStorage.setItem(
        "library_logged_in",
        JSON.stringify({
            id: user.id,
            name: user.name,
            role: user.role
        })
    );


    renderApplication();
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem("library_logged_in");

    renderLogin();
}


// =====================================================
// MAIN APPLICATION
// =====================================================

function renderApplication() {

    const loggedIn =
        JSON.parse(
            localStorage.getItem("library_logged_in")
        );


    if (!loggedIn) {

        renderLogin();

        return;
    }


    app.innerHTML = "";


    const layout =
        createElement("div", "app-layout");


    // SIDEBAR

    const sidebar =
        createElement("aside", "sidebar");


    const logo =
        createElement("h2", "", "📚 Library");


    sidebar.appendChild(logo);


    const pages = [
        ["dashboard", "Dashboard"],
        ["books", "Book Management"],
        ["transactions", "Transactions"],
        ["users", "User Management"]
    ];


    pages.forEach(function(page) {

        const button =
            createElement(
                "button",
                "nav-btn",
                page[1]
            );

        button.dataset.page = page[0];

        button.addEventListener(
            "click",
            function() {

                currentPage = page[0];

                renderPage();

            }
        );

        sidebar.appendChild(button);

    });


    const logoutButton =
        createElement(
            "button",
            "nav-btn logout",
            "Logout"
        );

    logoutButton.addEventListener(
        "click",
        logout
    );

    sidebar.appendChild(logoutButton);


    // MAIN

    const main =
        createElement("main", "main");


    const topbar =
        createElement("div", "topbar");


    const pageTitle =
        createElement("h1", "", "Dashboard");

    pageTitle.id = "pageTitle";


    const welcome =
        createElement(
            "p",
            "",
            "Welcome, " +
            loggedIn.name +
            " (" +
            loggedIn.role +
            ")"
        );


    topbar.appendChild(pageTitle);
    topbar.appendChild(welcome);


    const content =
        createElement("section");

    content.id = "content";


    main.appendChild(topbar);
    main.appendChild(content);


    layout.appendChild(sidebar);
    layout.appendChild(main);

    app.appendChild(layout);


    renderPage();
}


// =====================================================
// PAGE ROUTING
// =====================================================

function renderPage() {

    const content =
        document.getElementById("content");

    const pageTitle =
        document.getElementById("pageTitle");


    document
        .querySelectorAll(".nav-btn")
        .forEach(function(button) {

            if (
                button.dataset.page ===
                currentPage
            ) {

                button.classList.add("active");

            } else {

                button.classList.remove("active");

            }

        });


    if (currentPage === "dashboard") {

        pageTitle.textContent = "Dashboard";

        renderDashboard(content);

    }


    if (currentPage === "books") {

        pageTitle.textContent = "Book Management";

        renderBooks(content);

    }


    if (currentPage === "transactions") {

        pageTitle.textContent = "Transactions";

        renderTransactions(content);

    }


    if (currentPage === "users") {

        pageTitle.textContent = "User Management";

        renderUsers(content);

    }
}


// =====================================================
// DASHBOARD
// =====================================================

function renderDashboard(content) {

    content.innerHTML = "";


    let totalCopies = 0;

    books.forEach(function(book) {

        totalCopies += Number(book.quantity);

    });


    const lowStock =
        books.filter(function(book) {

            return book.quantity < 2;

        }).length;


    const cards =
        createElement("div", "cards");


    const values = [

        ["Total Titles", books.length],

        ["Total Copies", totalCopies],

        ["Low Stock", lowStock],

        ["Total Users", users.length]

    ];


    values.forEach(function(item) {

        const card =
            createElement("div", "card");

        const label =
            createElement("small", "", item[0]);

        const value =
            createElement(
                "strong",
                "",
                item[1].toString()
            );

        card.appendChild(label);
        card.appendChild(value);

        cards.appendChild(card);

    });


    content.appendChild(cards);


    const panel =
        createElement("div", "panel");


    const heading =
        createElement(
            "h2",
            "",
            "Current Book Availability"
        );


    panel.appendChild(heading);

    panel.appendChild(
        createBookTable(false)
    );


    content.appendChild(panel);
}


// =====================================================
// BOOK TABLE
// =====================================================

function createBookTable(showActions) {

    const wrapper =
        createElement("div", "table-wrap");


    const table =
        createElement("table");


    const header =
        createElement("thead");


    const row =
        createElement("tr");


    [
        "Title",
        "Author",
        "Genre",
        "ISBN",
        "Quantity"
    ].forEach(function(text) {

        row.appendChild(
            createElement("th", "", text)
        );

    });


    if (showActions) {

        row.appendChild(
            createElement(
                "th",
                "",
                "Actions"
            )
        );

    }


    header.appendChild(row);


    const body =
        createElement("tbody");


    books.forEach(function(book) {

        const bookRow =
            createElement("tr");


        if (book.quantity < 2) {

            bookRow.classList.add("low-stock");

        }


        [
            book.title,
            book.author,
            book.genre,
            book.isbn
        ].forEach(function(value) {

            bookRow.appendChild(
                createElement("td", "", value)
            );

        });


        const quantityCell =
            createElement("td");


        const badge =
            createElement(
                "span",
                "badge",
                book.quantity.toString()
            );


        quantityCell.appendChild(badge);

        bookRow.appendChild(quantityCell);


        if (showActions) {

            const actionCell =
                createElement(
                    "td",
                    "actions"
                );


            const updateButton =
                createElement(
                    "button",
                    "warning",
                    "Update"
                );


            updateButton.addEventListener(
                "click",
                function() {

                    editingBookId = book.id;

                    renderPage();

                }
            );


            const deleteButton =
                createElement(
                    "button",
                    "danger",
                    "Delete"
                );


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteBook(book.id);

                }
            );


            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);

            bookRow.appendChild(actionCell);

        }


        body.appendChild(bookRow);

    });


    table.appendChild(header);
    table.appendChild(body);

    wrapper.appendChild(table);

    return wrapper;
}


// =====================================================
// BOOK MANAGEMENT
// =====================================================

function renderBooks(content) {

    content.innerHTML = "";


    const editingBook =
        books.find(function(book) {

            return book.id === editingBookId;

        });


    const panel =
        createElement("div", "panel");


    const heading =
        createElement(
            "h2",
            "",
            editingBook
                ? "Update Book"
                : "Add New Book"
        );


    const form =
        createElement("form");


    const grid =
        createElement("div", "form-grid");


    const titleInput =
        createInput(
            "Title",
            editingBook
                ? editingBook.title
                : ""
        );


    const authorInput =
        createInput(
            "Author",
            editingBook
                ? editingBook.author
                : ""
        );


    const genreInput =
        createInput(
            "Genre",
            editingBook
                ? editingBook.genre
                : ""
        );


    const isbnInput =
        createInput(
            "ISBN",
            editingBook
                ? editingBook.isbn
                : ""
        );


    const quantityInput =
        createInput(
            "Initial Quantity",
            editingBook
                ? editingBook.quantity
                : 1
        );

    quantityInput.input.type = "number";
    quantityInput.input.min = "0";


    [
        titleInput,
        authorInput,
        genreInput,
        isbnInput,
        quantityInput
    ].forEach(function(item) {

        grid.appendChild(item.group);

    });


    const actions =
        createElement("div", "actions");


    const saveButton =
        createElement(
            "button",
            "primary",
            editingBook
                ? "Update Book"
                : "Add Book"
        );

    saveButton.type = "submit";


    actions.appendChild(saveButton);


    if (editingBook) {

        const cancelButton =
            createElement(
                "button",
                "secondary",
                "Cancel"
            );

        cancelButton.type = "button";

        cancelButton.addEventListener(
            "click",
            function() {

                editingBookId = null;

                renderPage();

            }
        );

        actions.appendChild(cancelButton);
    }


    form.appendChild(grid);
    form.appendChild(actions);

    panel.appendChild(heading);
    panel.appendChild(form);

    content.appendChild(panel);


    const listPanel =
        createElement("div", "panel");


    listPanel.appendChild(
        createElement(
            "h2",
            "",
            "Book List"
        )
    );


    listPanel.appendChild(
        createBookTable(true)
    );


    content.appendChild(listPanel);


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            saveBook(
                titleInput.input.value,
                authorInput.input.value,
                genreInput.input.value,
                isbnInput.input.value,
                quantityInput.input.value
            );

        }
    );
}


// =====================================================
// CREATE INPUT
// =====================================================

function createInput(labelText, value) {

    const group =
        createElement("div", "form-group");


    const label =
        createElement(
            "label",
            "",
            labelText
        );


    const input =
        createElement("input");


    input.value = value;

    input.required = true;


    group.appendChild(label);
    group.appendChild(input);


    return {
        group: group,
        input: input
    };
}


// =====================================================
// SAVE BOOK
// =====================================================

function saveBook(
    title,
    author,
    genre,
    isbn,
    quantity
) {

    if (editingBookId) {

        const book =
            books.find(function(book) {

                return book.id === editingBookId;

            });


        book.title = title.trim();
        book.author = author.trim();
        book.genre = genre.trim();
        book.isbn = isbn.trim();
        book.quantity = Number(quantity);


        editingBookId = null;

    } else {

        books.push({

            id: createId(),

            title: title.trim(),

            author: author.trim(),

            genre: genre.trim(),

            isbn: isbn.trim(),

            quantity: Number(quantity)

        });

    }


    saveData();

    renderPage();
}


// =====================================================
// DELETE BOOK
// =====================================================

function deleteBook(id) {

    const book =
        books.find(function(book) {

            return book.id === id;

        });


    if (!book) return;


    if (
        confirm(
            "Delete " +
            book.title +
            "?"
        )
    ) {

        books =
            books.filter(function(book) {

                return book.id !== id;

            });


        saveData();

        renderPage();

    }
}


// =====================================================
// TRANSACTIONS
// =====================================================

function renderTransactions(content) {

    content.innerHTML = "";


    const panel =
        createElement("div", "panel");


    panel.appendChild(
        createElement(
            "h2",
            "",
            "Stock Transaction"
        )
    );


    const form =
        createElement("form");


    const grid =
        createElement("div", "form-grid");


    // BOOK SELECT

    const bookGroup =
        createElement("div", "form-group");


    const bookLabel =
        createElement(
            "label",
            "",
            "Book"
        );


    const bookSelect =
        createElement("select");


    bookSelect.required = true;


    const defaultOption =
        createElement(
            "option",
            "",
            "Select a book"
        );

    defaultOption.value = "";


    bookSelect.appendChild(defaultOption);


    books.forEach(function(book) {

        const option =
            createElement(
                "option",
                "",
                book.title +
                " - Stock: " +
                book.quantity
            );

        option.value = book.id;

        bookSelect.appendChild(option);

    });


    bookGroup.appendChild(bookLabel);
    bookGroup.appendChild(bookSelect);


    // TRANSACTION TYPE

    const typeGroup =
        createElement("div", "form-group");


    const typeLabel =
        createElement(
            "label",
            "",
            "Transaction Type"
        );


    const typeSelect =
        createElement("select");


    const addOption =
        createElement(
            "option",
            "",
            "Add Stock"
        );

    addOption.value = "add";


    const borrowOption =
        createElement(
            "option",
            "",
            "Deduct Stock / Borrow"
        );

    borrowOption.value = "borrow";


    typeSelect.appendChild(addOption);
    typeSelect.appendChild(borrowOption);


    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(typeSelect);


    // QUANTITY

    const quantityGroup =
        createElement("div", "form-group");


    const quantityLabel =
        createElement(
            "label",
            "",
            "Quantity"
        );


    const quantityInput =
        createElement("input");

    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = "1";
    quantityInput.required = true;


    quantityGroup.appendChild(quantityLabel);
    quantityGroup.appendChild(quantityInput);


    grid.appendChild(bookGroup);
    grid.appendChild(typeGroup);
    grid.appendChild(quantityGroup);


    const button =
        createElement(
            "button",
            "primary",
            "Record Transaction"
        );

    button.type = "submit";


    const message =
        createElement("div");


    form.appendChild(grid);
    form.appendChild(button);
    form.appendChild(message);


    panel.appendChild(form);

    content.appendChild(panel);


    const historyPanel =
        createElement("div", "panel");


    historyPanel.appendChild(
        createElement(
            "h2",
            "",
            "Transaction History"
        )
    );


    historyPanel.appendChild(
        createTransactionTable()
    );


    content.appendChild(historyPanel);


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            saveTransaction(
                bookSelect.value,
                typeSelect.value,
                Number(quantityInput.value),
                message
            );

        }
    );
}


// =====================================================
// SAVE TRANSACTION
// =====================================================

function saveTransaction(
    bookId,
    type,
    quantity,
    message
) {

    const book =
        books.find(function(book) {

            return book.id === bookId;

        });


    if (!book) {

        message.textContent =
            "Please select a book.";

        message.className = "message";

        return;
    }


    if (
        type === "borrow" &&
        book.quantity < quantity
    ) {

        message.textContent =
            "Not enough stock available.";

        message.className = "message";

        return;
    }


    if (type === "add") {

        book.quantity += quantity;

    } else {

        book.quantity -= quantity;

    }


    transactions.unshift({

        id: createId(),

        bookId: bookId,

        bookTitle: book.title,

        type: type,

        quantity: quantity,

        date: new Date().toLocaleString()

    });


    saveData();

    renderPage();
}


// =====================================================
// TRANSACTION TABLE
// =====================================================

function createTransactionTable() {

    const wrapper =
        createElement("div", "table-wrap");


    const table =
        createElement("table");


    const header =
        createElement("thead");


    const row =
        createElement("tr");


    [
        "Date",
        "Book",
        "Type",
        "Quantity"
    ].forEach(function(text) {

        row.appendChild(
            createElement("th", "", text)
        );

    });


    header.appendChild(row);


    const body =
        createElement("tbody");


    transactions.forEach(function(transaction) {

        const tr =
            createElement("tr");


        tr.appendChild(
            createElement(
                "td",
                "",
                transaction.date
            )
        );


        tr.appendChild(
            createElement(
                "td",
                "",
                transaction.bookTitle
            )
        );


        tr.appendChild(
            createElement(
                "td",
                "",
                transaction.type === "add"
                    ? "Add Stock"
                    : "Borrow / Deduct"
            )
        );


        tr.appendChild(
            createElement(
                "td",
                "",
                transaction.quantity.toString()
            )
        );


        body.appendChild(tr);

    });


    table.appendChild(header);
    table.appendChild(body);

    wrapper.appendChild(table);


    return wrapper;
}


// =====================================================
// USER MANAGEMENT
// =====================================================

function renderUsers(content) {

    content.innerHTML = "";


    const editingUser =
        users.find(function(user) {

            return user.id === editingUserId;

        });


    const panel =
        createElement("div", "panel");


    panel.appendChild(
        createElement(
            "h2",
            "",
            editingUser
                ? "Update User"
                : "Add New User"
        )
    );


    const form =
        createElement("form");


    const grid =
        createElement("div", "form-grid");


    const name =
        createInput(
            "Name",
            editingUser
                ? editingUser.name
                : ""
        );


    const membership =
        createInput(
            "Membership ID",
            editingUser
                ? editingUser.membershipId
                : ""
        );


    // ROLE

    const roleGroup =
        createElement("div", "form-group");


    const roleLabel =
        createElement(
            "label",
            "",
            "Role"
        );


    const roleSelect =
        createElement("select");


    [
        "Member",
        "Librarian",
        "Admin"
    ].forEach(function(role) {

        const option =
            createElement(
                "option",
                "",
                role
            );

        option.value = role;


        if (
            editingUser &&
            editingUser.role === role
        ) {

            option.selected = true;

        }


        roleSelect.appendChild(option);

    });


    roleGroup.appendChild(roleLabel);
    roleGroup.appendChild(roleSelect);


    // PASSWORD

    const password =
        createInput(
            "Password",
            ""
        );

    password.input.type = "password";

    if (!editingUser) {

        password.input.required = true;

    }


    grid.appendChild(name.group);
    grid.appendChild(membership.group);
    grid.appendChild(roleGroup);
    grid.appendChild(password.group);


    const actions =
        createElement("div", "actions");


    const saveButton =
        createElement(
            "button",
            "primary",
            editingUser
                ? "Update User"
                : "Add User"
        );

    saveButton.type = "submit";


    actions.appendChild(saveButton);


    if (editingUser) {

        const cancel =
            createElement(
                "button",
                "secondary",
                "Cancel"
            );

        cancel.type = "button";


        cancel.addEventListener(
            "click",
            function() {

                editingUserId = null;

                renderPage();

            }
        );


        actions.appendChild(cancel);

    }


    form.appendChild(grid);
    form.appendChild(actions);


    panel.appendChild(form);

    content.appendChild(panel);


    const userPanel =
        createElement("div", "panel");


    userPanel.appendChild(
        createElement(
            "h2",
            "",
            "User List"
        )
    );


    userPanel.appendChild(
        createUserTable()
    );


    content.appendChild(userPanel);


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            saveUser(
                name.input.value,
                membership.input.value,
                roleSelect.value,
                password.input.value
            );

        }
    );
}


// =====================================================
// SAVE USER
// =====================================================

function saveUser(
    name,
    membershipId,
    role,
    password
) {

    const duplicate =
        users.some(function(user) {

            return (
                user.membershipId ===
                membershipId.trim()
                &&
                user.id !== editingUserId
            );

        });


    if (duplicate) {

        alert(
            "Membership ID already exists."
        );

        return;
    }


    if (editingUserId) {

        const user =
            users.find(function(user) {

                return user.id === editingUserId;

            });


        user.name = name.trim();

        user.membershipId =
            membershipId.trim();

        user.role = role;


        if (password) {

            user.password = password;

        }


        editingUserId = null;

    } else {

        users.push({

            id: createId(),

            name: name.trim(),

            membershipId:
                membershipId.trim(),

            role: role,

            password: password

        });

    }


    saveData();

    renderPage();
}


// =====================================================
// USER TABLE
// =====================================================

function createUserTable() {

    const wrapper =
        createElement("div", "table-wrap");


    const table =
        createElement("table");


    const header =
        createElement("thead");


    const row =
        createElement("tr");


    [
        "Name",
        "Membership ID",
        "Role",
        "Actions"
    ].forEach(function(text) {

        row.appendChild(
            createElement("th", "", text)
        );

    });


    header.appendChild(row);


    const body =
        createElement("tbody");


    users.forEach(function(user) {

        const tr =
            createElement("tr");


        tr.appendChild(
            createElement(
                "td",
                "",
                user.name
            )
        );


        tr.appendChild(
            createElement(
                "td",
                "",
                user.membershipId
            )
        );


        tr.appendChild(
            createElement(
                "td",
                "",
                user.role
            )
        );


        const actions =
            createElement(
                "td",
                "actions"
            );


        const update =
            createElement(
                "button",
                "warning",
                "Update"
            );


        update.addEventListener(
            "click",
            function() {

                editingUserId = user.id;

                renderPage();

            }
        );


        const deleteButton =
            createElement(
                "button",
                "danger",
                "Delete"
            );


        deleteButton.addEventListener(
            "click",
            function() {

                deleteUser(user.id);

            }
        );


        actions.appendChild(update);
        actions.appendChild(deleteButton);


        tr.appendChild(actions);

        body.appendChild(tr);

    });


    table.appendChild(header);
    table.appendChild(body);

    wrapper.appendChild(table);


    return wrapper;
}


// =====================================================
// DELETE USER
// =====================================================

function deleteUser(userId) {

    const loggedIn =
        JSON.parse(
            localStorage.getItem(
                "library_logged_in"
            )
        );


    if (
        loggedIn &&
        loggedIn.id === userId
    ) {

        alert(
            "You cannot delete the currently logged-in account."
        );

        return;
    }


    if (confirm("Delete this user?")) {

        users =
            users.filter(function(user) {

                return user.id !== userId;

            });


        saveData();

        renderPage();

    }
}


// =====================================================
// START APPLICATION
// =====================================================

createInitialData();

renderApplication();