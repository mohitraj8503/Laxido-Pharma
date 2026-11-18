
// ==========================================
// LOCATION FORM
// ==========================================

const locationForm = document.getElementById("locationForm");

if (locationForm) {

    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    const pincodeInput = document.getElementById("pincode");
    const message = document.getElementById("locationMessage");

    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
        "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
        "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
        "West Bengal"
    ];

    const unionTerritories = [
        "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
        "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    const stateHindi = {
        "Andhra Pradesh": "आंध्र प्रदेश",
        "Arunachal Pradesh": "अरुणाचल प्रदेश",
        "Assam": "असम",
        "Bihar": "बिहार",
        "Chhattisgarh": "छत्तीसगढ़",
        "Goa": "गोवा",
        "Gujarat": "गुजरात",
        "Haryana": "हरियाणा",
        "Himachal Pradesh": "हिमाचल प्रदेश",
        "Jharkhand": "झारखंड",
        "Karnataka": "कर्नाटक",
        "Kerala": "केरल",
        "Madhya Pradesh": "मध्य प्रदेश",
        "Maharashtra": "महाराष्ट्र",
        "Manipur": "मणिपुर",
        "Meghalaya": "मेघालय",
        "Mizoram": "मिज़ोरम",
        "Nagaland": "नागालैंड",
        "Odisha": "ओडिशा",
        "Punjab": "पंजाब",
        "Rajasthan": "राजस्थान",
        "Sikkim": "सिक्किम",
        "Tamil Nadu": "तमिलनाडु",
        "Telangana": "तेलंगाना",
        "Tripura": "त्रिपुरा",
        "Uttar Pradesh": "उत्तर प्रदेश",
        "Uttarakhand": "उत्तराखंड",
        "West Bengal": "पश्चिम बंगाल",
        "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीपसमूह",
        "Chandigarh": "चंडीगढ़",
        "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली और दमन और दीव",
        "Delhi": "दिल्ली",
        "Jammu and Kashmir": "जम्मू और कश्मीर",
        "Ladakh": "लद्दाख",
        "Lakshadweep": "लक्षद्वीप",
        "Puducherry": "पुडुचेरी",
        "Shimla": "शिमला",
        "Mandi": "मंडी",
        "Solan": "सोलन",
        "Nahan": "नाहन",
        "Sundarnagar": "सुंदरनगर",
        "Palampur": "पालमपुर",
        "Kullu": "कुल्लू"
    };

    let citiesData = [];

    function translateText(text) {
        const language = localStorage.getItem("laxido_language") || "en";
        const translations = window.laxidoTranslations || {};

        if (language !== "hi") return text;

        return stateHindi[text] || translations[text] || text;
    }

    function showMessage(text, color = "") {
        message.dataset.originalText = text;
        message.textContent = text ? translateText(text) : "";
        message.style.color = color;
    }

    function addOptions(items, parent) {
        items.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = translateText(item);
            parent.appendChild(option);
        });
    }

    const stateGroup = document.createElement("optgroup");
    stateGroup.label = "States";
    addOptions(states, stateGroup);

    const territoryGroup = document.createElement("optgroup");
    territoryGroup.label = "Union Territories";
    addOptions(unionTerritories, territoryGroup);

    function createPlaceholder(select, text) {
        select.innerHTML = "";

        const option = document.createElement("option");
        option.value = "";
        option.textContent = translateText(text);

        select.appendChild(option);
    }

    createPlaceholder(stateSelect, "Choose your state");
    stateSelect.appendChild(stateGroup);
    stateSelect.appendChild(territoryGroup);

    createPlaceholder(citySelect, "Choose your city");


    let cityTranslationRequest = 0;

    async function translateCityOptions() {
        if (localStorage.getItem("laxido_language") !== "hi") return;

        const selectedState = stateSelect.value;
        const requestId = ++cityTranslationRequest;

        let cache = {};

        try {
            cache = JSON.parse(
                localStorage.getItem("laxido_city_translations_hi") || "{}"
            );
        } catch (error) {
            cache = {};
        }

        const names = Array.from(citySelect.options)
            .filter(option => option.value)
            .map(option => option.value);

        const pending = names.filter(name =>
            !stateHindi[name] && !cache[name]
        );

        const batches = [];
        let batch = [];
        let length = 0;

        pending.forEach(name => {
            if (batch.length && length + name.length + 5 > 220) {
                batches.push(batch);
                batch = [];
                length = 0;
            }

            batch.push(name);
            length += name.length + 5;
        });

        if (batch.length) batches.push(batch);

        for (const currentBatch of batches) {
            try {
                const params = new URLSearchParams({
                    q: currentBatch.join(" ||| "),
                    langpair: "en|hi"
                });

                const response = await fetch(
                    "https://api.mymemory.translated.net/get?" + params
                );

                if (!response.ok) throw new Error("Translation API failed");

                const data = await response.json();
                const translatedText = data.responseData?.translatedText;

                if (!translatedText) {
                    throw new Error("Translation result unavailable");
                }

                const results = translatedText.split(/\s*\|\|\|\s*/);

                if (results.length !== currentBatch.length) {
                    throw new Error("City translation matching failed");
                }

                currentBatch.forEach((name, index) => {
                    cache[name] = results[index].trim();
                });

                localStorage.setItem(
                    "laxido_city_translations_hi",
                    JSON.stringify(cache)
                );

            } catch (error) {
                console.error("City translation error:", error);
            }
        }

        if (
            requestId !== cityTranslationRequest ||
            stateSelect.value !== selectedState ||
            localStorage.getItem("laxido_language") !== "hi"
        ) return;

        Array.from(citySelect.options).forEach(option => {
            if (!option.value) return;

            option.textContent =
                stateHindi[option.value] ||
                cache[option.value] ||
                option.value;
        });
    }

    function updateLocationLanguage() {
        stateGroup.label = translateText("States");
        territoryGroup.label = translateText("Union Territories");

        Array.from(stateSelect.options).forEach(function (option) {
            if (option.value) {
                option.textContent = translateText(option.value);
            } else {
                option.textContent = translateText("Choose your state");
            }
        });

        Array.from(citySelect.options).forEach(function (option) {
            if (option.value) {
                option.textContent = translateText(option.value);
            } else {
                option.textContent = translateText("Choose your city");
            }
        });

        pincodeInput.placeholder = translateText("Enter 6-digit PIN code");

        if (message.dataset.originalText) {
            message.textContent = translateText(message.dataset.originalText);
        }

        translateCityOptions();
    }

    async function loadCities() {
        try {
            showMessage("Loading cities...");

            const response = await fetch("../data/indian-cities.json");

            if (!response.ok) {
                throw new Error("Cities file not found");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid cities data");
            }

            citiesData = data.filter(city => city.name && city.state);

            stateSelect.disabled = false;
            showMessage("");

            console.log("Cities loaded:", citiesData.length);

        } catch (error) {
            console.error("City loading error:", error);

            showMessage(
                "Unable to load cities. Please refresh the page.",
                "red"
            );
        }
    }

    loadCities();

    stateSelect.addEventListener("change", function () {

        const selectedState = stateSelect.value.trim().toLowerCase();

        createPlaceholder(citySelect, "Choose your city");
        citySelect.disabled = true;

        showMessage("");

        const filteredCities = citiesData
            .filter(city =>
                city.state.trim().toLowerCase() === selectedState
            )
            .sort((a, b) => a.name.localeCompare(b.name));

        if (filteredCities.length === 0) {

            const option = document.createElement("option");
            option.value = "";
            option.textContent = translateText("No cities available in dataset");

            citySelect.appendChild(option);

            showMessage(
                "No cities found for this state in the current dataset.",
                "red"
            );

            return;
        }

        filteredCities.forEach(function (city) {

            const option = document.createElement("option");

            option.value = city.name;
            option.textContent = translateText(city.name);

            citySelect.appendChild(option);
        });

        citySelect.disabled = false;

        translateCityOptions();
    });

    pincodeInput.addEventListener("input", function () {
        pincodeInput.value = pincodeInput.value
            .replace(/\D/g, "")
            .slice(0, 6);
    });

    locationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const selectedLocation = {
            state: stateSelect.value,
            city: citySelect.value,
            pincode: pincodeInput.value
        };

        if (!selectedLocation.state || !selectedLocation.city) {
            showMessage("Please select your state and city.", "red");
            return;
        }

        if (!/^[0-9]{6}$/.test(selectedLocation.pincode)) {
            showMessage("Enter a valid 6-digit PIN code.", "red");
            return;
        }

        localStorage.setItem(
            "laxido_location",
            JSON.stringify(selectedLocation)
        );

        showMessage("Location saved successfully!", "green");
    });

    window.addEventListener("languageChanged", updateLocationLanguage);
}


// ==========================================
// DISPLAY SAVED LOCATION ON HOMEPAGE
// ==========================================

const savedLocation = localStorage.getItem("laxido_location");

if (savedLocation) {

    try {
        const location = JSON.parse(savedLocation);

        const locationTitle = document.querySelector(
            ".location-menu-short-title"
        );

        const locationText = document.querySelector(
            ".text-block-5"
        );

        if (locationTitle && locationText) {
            locationTitle.textContent = "Your Location";

            locationText.textContent =
                location.city + ", " + location.state;
        }

    } catch (error) {
        console.error("Unable to display saved location:", error);
    }
}


// ==========================================
// ENGLISH AND HINDI LANGUAGE SWITCHER
// ==========================================

(function () {

    const host =
        document.querySelector(".nav-right-content") ||
        document.querySelector(".location-card");

    if (!host) return;

    let switcher = host.querySelector(".language-switch");

    if (!switcher) {

        switcher = document.createElement("div");
        switcher.className = "language-switch";

        switcher.innerHTML = `
            <button type="button" data-language="en">EN</button>
            <button type="button" data-language="hi">हिंदी</button>
        `;

        host.append(switcher);
    }

    let hindi = {};

    const translationURL = window.location.pathname.includes("/pages/")
        ? "../data/translations.json"
        : "data/translations.json";

    // Load translation JSON
    fetch(translationURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Translation file load nahi hui");
            }

            return response.json();
        })
        .then(data => {

            hindi = data;
            window.laxidoTranslations = data;

            applyLanguage(
                localStorage.getItem("laxido_language") || "en"
            );

        })
        .catch(error => {
            console.error("Translation Error:", error);
        });

    // Store original text
    const originalNodes = [];

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;

    while ((node = walker.nextNode())) {

        const parent = node.parentElement;

        if (!parent) continue;

        if (parent.closest("script, style, noscript, .language-switch")) {
            continue;
        }

        if (!node.nodeValue.trim()) continue;

        originalNodes.push({
            node: node,
            original: node.nodeValue
        });
    }

    // Apply selected language
    function applyLanguage(language) {

        const isHindi = language === "hi";

        document.documentElement.lang = language;

        originalNodes.forEach(function (item) {

            const original = item.original;
            const cleanText = original.trim().replace(/\s+/g, " ");

            const leading = original.match(/^\s*/)[0];
            const trailing = original.match(/\s*$/)[0];

            const translated = isHindi
                ? (hindi[cleanText] || cleanText)
                : cleanText;

            item.node.nodeValue =
                leading + translated + trailing;
        });

        const searchInput = document.querySelector("#search-input");

        if (searchInput) {
            searchInput.placeholder = isHindi
                ? "दवाइयाँ और स्वास्थ्य उत्पाद खोजें"
                : "Medicine and healthcare items";
        }

        const searchButton = document.querySelector("#tippy");

        if (searchButton) {
            searchButton.dataset.tippyContent =
                isHindi ? "खोजें" : "Search";
        }

        localStorage.setItem("laxido_language", language);

        switcher.querySelectorAll("button").forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.language === language
            );

        });

        window.dispatchEvent(
            new CustomEvent("languageChanged", {
                detail: { language: language }
            })
        );
    }

    // Language button events
    switcher.querySelectorAll("button").forEach(function (button) {

        button.addEventListener("click", function () {
            applyLanguage(button.dataset.language);
        });

    });

})();

// Diagnostics Booking Functionality
(function () {
    const bookingForm = document.getElementById("diagnosticBookingForm");

    if (!bookingForm) return;

    const testInput = document.getElementById("bookingTest");
    const bookingMessage = document.getElementById("diagnosticBookingMessage");

    // Select test and open booking form
    document.querySelectorAll(".diagnostic-test-card .diagnostic-book-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".diagnostic-test-card");

            if (card) {
                testInput.value = card.querySelector("h3").textContent.trim();
            } else {
                testInput.value = "";
            }

            document.getElementById("book-diagnostic-test").scrollIntoView({
                behavior: "smooth"
            });

            bookingMessage.textContent = "";
            document.getElementById("bookingName").focus();
        });
    });

    // Save booking request
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const booking = {
            id: Date.now(),
            test: testInput.value.trim(),
            name: document.getElementById("bookingName").value.trim(),
            phone: document.getElementById("bookingPhone").value.trim(),
            date: document.getElementById("bookingDate").value,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        if (!booking.test) {
            bookingMessage.textContent = "Please select a diagnostic test first.";
            return;
        }

        const bookings = JSON.parse(
            localStorage.getItem("laxido_diagnostic_bookings") || "[]"
        );

        bookings.push(booking);

        localStorage.setItem(
            "laxido_diagnostic_bookings",
            JSON.stringify(bookings)
        );

        bookingMessage.textContent =
            "Your booking request has been saved successfully!";

        bookingMessage.style.color = "#16804a";

        bookingForm.reset();
        testInput.value = "";
    });
})();

// ==========================================
// LOGIN / LOGOUT NAVBAR
// ==========================================

(function () {
    const loginLink = document.querySelector('a[href="pages/login.html"]');

    if (!loginLink) return;

    const loginLabel = loginLink.querySelector("div:last-child");

    let loggedInUser = null;

    try {
        loggedInUser = JSON.parse(
            localStorage.getItem("laxido_loggedInUser") || "null"
        );
    } catch (error) {
        loggedInUser = null;
    }

    if (loggedInUser && loggedInUser.name) {
        loginLabel.replaceChildren();

        const welcomeText = document.createElement("span");
        welcomeText.className = "welcome-user";
        welcomeText.textContent = "Welcome, " + loggedInUser.name;

        const logoutText = document.createElement("span");
        logoutText.className = "logout-user";
        logoutText.textContent = "Logout";

        loginLabel.append(welcomeText, logoutText);
        loginLink.href = "#";
        loginLink.title = "Logged in as " + loggedInUser.name;

        loginLink.addEventListener("click", function (event) {
            event.preventDefault();

            localStorage.removeItem("laxido_loggedInUser");

            window.location.reload();
        });
    }
})();

// ==========================================
// LIVE CART COUNTER
// ==========================================

(function () {
    function updateCartCounter() {
        const cartLinks = document.querySelectorAll(
            'a[href="pages/cart.html"], a[href="cart.html"]'
        );

        const cart = JSON.parse(localStorage.getItem("laxido_cart") || "[]");
        const count = cart.reduce(
            (total, item) => total + (Number(item.quantity) || 1), 0
        );

        cartLinks.forEach(function (link) {
            let badge = link.querySelector(".cart-count");

            if (!badge) {
                badge = document.createElement("span");
                badge.className = "cart-count";
                link.appendChild(badge);
            }

            badge.textContent = count;
            badge.style.display = count > 0 ? "inline-flex" : "none";
        });
    }

    document.addEventListener("DOMContentLoaded", updateCartCounter);
    window.addEventListener("storage", updateCartCounter);
    window.addEventListener("laxido:cart-updated", updateCartCounter);
    updateCartCounter();
})();
