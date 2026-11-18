const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const authMessage = document.getElementById("authMessage");

// Switch to Login
loginTab.addEventListener("click", function () {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    authMessage.textContent = "";
});

// Switch to Register
registerTab.addEventListener("click", function () {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    authMessage.textContent = "";
});

// Register new user
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;

    const users = JSON.parse(localStorage.getItem("laxido_users") || "[]");

    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        authMessage.textContent = "This email is already registered.";
        return;
    }

    users.push({ name, email, phone, password });

    localStorage.setItem("laxido_users", JSON.stringify(users));

    authMessage.textContent = "Registration successful! Please login.";
    registerForm.reset();

    loginTab.click();
});

// Login existing user
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("laxido_users") || "[]");

    const user = users.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        authMessage.textContent = "Invalid email or password.";
        return;
    }

    localStorage.setItem("laxido_loggedInUser", JSON.stringify({
        name: user.name,
        email: user.email
    }));

    authMessage.textContent = "Login successful! Welcome, " + user.name;

    loginForm.reset();
});
