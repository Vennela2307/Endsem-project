// ==================================================
// SPEEDYFOODIE - JAVASCRIPT
// ==================================================


// =========================
// LOGIN
// =========================

// Protect pages from being opened before login

const currentPage = window.location.pathname;

const publicPages = [
    "login.html",
    "register.html"
];

const isPublicPage =
    publicPages.some(page => currentPage.endsWith(page));

if (
    !localStorage.getItem("loggedIn") &&
    !isPublicPage
) {
    window.location.href = "login.html";
}


// =========================
// LOGIN FORM
// =========================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const emailElement =
            document.getElementById("email");

        const passwordElement =
            document.getElementById("password");

        const email =
            emailElement ? emailElement.value.trim() : "";

        const password =
            passwordElement ? passwordElement.value.trim() : "";

        if (email === "" || password === "") {

            alert("Please enter your email and password.");
            return;

        }

        // Save login status
        localStorage.setItem("loggedIn", "true");

        alert("Login successful! 🎉");

        window.location.href = "index.html";

    });

}


// =========================
// CART
// =========================

// Get existing cart

let cart =
    JSON.parse(localStorage.getItem("speedyFoodieCart")) || [];


// =========================
// ADD TO CART
// =========================

function addToCart(name, price) {

    const existingItem =
        cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }

    saveCart();

    alert(name + " added to cart! 🛒");

}


// =========================
// SAVE CART
// =========================

function saveCart() {

    localStorage.setItem(
        "speedyFoodieCart",
        JSON.stringify(cart)
    );

}


// =========================
// DISPLAY CART
// =========================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p>Your cart is empty 🛒</p>
        `;

        updateCartTotal();

        return;
    }


    cart.forEach((item, index) => {

        const itemTotal =
            Number(item.price) * Number(item.quantity);

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price} × ${item.quantity}
                </p>

            </div>


            <div>

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

                <strong>
                    ₹${itemTotal}
                </strong>

                <button onclick="removeFromCart(${index})">
                    🗑️
                </button>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });

    updateCartTotal();

}


// =========================
// INCREASE QUANTITY
// =========================

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity++;

    saveCart();

    displayCart();

}


// =========================
// DECREASE QUANTITY
// =========================

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();

}


// =========================
// REMOVE FROM CART
// =========================

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    displayCart();

}


// =========================
// UPDATE TOTAL
// =========================

function updateCartTotal() {

    const subtotalElement =
        document.getElementById("subtotal");

    const totalElement =
        document.getElementById("total");

    if (!subtotalElement || !totalElement) {
        return;
    }


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            Number(item.price) * Number(item.quantity);

    });


    const deliveryFee =
        cart.length > 0 ? 40 : 0;

    const total =
        subtotal + deliveryFee;


    subtotalElement.textContent =
        "₹" + subtotal;

    totalElement.textContent =
        "₹" + total;

}


// =========================
// LOAD CART WHEN PAGE OPENS
// =========================

displayCart();


// ==================================================
// CHECKOUT
// ==================================================


// Get checkout form only once

const checkoutForm =
    document.getElementById("checkoutForm");


function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    // Make sure we are on checkout page

    if (
        !checkoutItems ||
        !checkoutSubtotal ||
        !checkoutTotal
    ) {

        return;

    }


    // Empty cart

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty 🛒</p>
        `;

        checkoutSubtotal.textContent = "₹0";
        checkoutTotal.textContent = "₹0";

        return;

    }


    // Clear previous items

    checkoutItems.innerHTML = "";


    // Calculate subtotal

    let subtotal = 0;


    cart.forEach(item => {

        const itemTotal =
            Number(item.price) * Number(item.quantity);

        subtotal += itemTotal;


        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";


        itemElement.innerHTML = `

            <div>

                <strong>${item.name}</strong>

                <p>
                    ₹${item.price} × ${item.quantity}
                </p>

            </div>

            <strong>
                ₹${itemTotal}
            </strong>

        `;


        checkoutItems.appendChild(itemElement);

    });


    // Delivery fee

    const deliveryFee = 40;

    const total =
        subtotal + deliveryFee;


    // Display totals

    checkoutSubtotal.textContent =
        "₹" + subtotal;

    checkoutTotal.textContent =
        "₹" + total;

}


// Run checkout display

displayCheckout();


// ==================================================
// SCHEDULE YOUR MEAL
// ==================================================

const deliveryOptions =
    document.querySelectorAll(
        'input[name="deliveryTime"]'
    );

const scheduleFields =
    document.getElementById("scheduleFields");

const scheduleDate =
    document.getElementById("scheduleDate");

const scheduleTime =
    document.getElementById("scheduleTime");


// Show / hide schedule fields

deliveryOptions.forEach(option => {

    option.addEventListener("change", function() {

        if (
            this.value === "later" &&
            scheduleFields &&
            scheduleDate &&
            scheduleTime
        ) {

            scheduleFields.style.display = "block";


            // Set minimum date as today

            const today = new Date();

            const year =
                today.getFullYear();

            const month =
                String(today.getMonth() + 1)
                    .padStart(2, "0");

            const day =
                String(today.getDate())
                    .padStart(2, "0");


            scheduleDate.min =
                `${year}-${month}-${day}`;

        } else if (
            scheduleFields &&
            scheduleDate &&
            scheduleTime
        ) {

            scheduleFields.style.display = "none";

            scheduleDate.value = "";
            scheduleTime.value = "";

        }

    });

});


// ==================================================
// PLACE ORDER
// ==================================================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Check cart

            if (cart.length === 0) {

                alert(
                    "Your cart is empty! Please add some food first. 🛒"
                );

                return;

            }


            // Get customer details

            const nameElement =
                document.getElementById("fullName");

            const phoneElement =
                document.getElementById("phone");

            const addressElement =
                document.getElementById("address");


            const name =
                nameElement ?
                nameElement.value.trim() :
                "";

            const phone =
                phoneElement ?
                phoneElement.value.trim() :
                "";

            const address =
                addressElement ?
                addressElement.value.trim() :
                "";


            if (
                name === "" ||
                phone === "" ||
                address === ""
            ) {

                alert(
                    "Please fill in all delivery details."
                );

                return;

            }


            // Check scheduled delivery

            const selectedDelivery =
                document.querySelector(
                    'input[name="deliveryTime"]:checked'
                );


            if (
                selectedDelivery &&
                selectedDelivery.value === "later"
            ) {

                if (
                    !scheduleDate ||
                    !scheduleTime ||
                    !scheduleDate.value ||
                    !scheduleTime.value
                ) {

                    alert(
                        "Please select a delivery date and time."
                    );

                    return;

                }


                const selectedDateTime =
                    new Date(
                        `${scheduleDate.value}T${scheduleTime.value}`
                    );

                const currentDateTime =
                    new Date();


                if (
                    selectedDateTime <= currentDateTime
                ) {

                    alert(
                        "Please select a future date and time."
                    );

                    return;

                }

            }


            // Save previous order information
            // for smart food suggestions

            const lastOrderedItem =
                cart[cart.length - 1];


            if (lastOrderedItem) {

                let previousOrders =
                    JSON.parse(
                        localStorage.getItem("previousOrders")
                    ) || [];


                previousOrders.push({
                    category:
                        getFoodCategory(lastOrderedItem.name),

                    item:
                        lastOrderedItem.name,

                    date:
                        new Date().toISOString()
                });


                localStorage.setItem(
                    "previousOrders",
                    JSON.stringify(previousOrders)
                );

            }


            // Order placed

            alert(
                "Order placed successfully! 🎉\n\n" +
                "Thank you, " + name + "!"
            );


            // Clear cart

            cart = [];

            saveCart();


            // Go to home page

            window.location.href =
                "index.html";

        }
    );

}


// ==================================================
// RESTAURANT SEARCH
// ==================================================

function searchRestaurants() {

    const searchInput =
        document.getElementById("restaurantSearch");

    const restaurantCards =
        document.querySelectorAll(".restaurant-card");


    if (!searchInput) {
        return;
    }


    // Get search text

    const searchText =
        searchInput.value.toLowerCase().trim();


    // Check every restaurant

    restaurantCards.forEach(function(card) {

        const nameElement =
            card.querySelector("h2");

        const typeElement =
            card.querySelector(".restaurant-type");

        const descriptionElement =
            card.querySelector(
                ".restaurant-info > p:not(.restaurant-type)"
            );


        const restaurantName =
            nameElement ?
            nameElement.textContent.toLowerCase() :
            "";

        const restaurantType =
            typeElement ?
            typeElement.textContent.toLowerCase() :
            "";

        const restaurantDescription =
            descriptionElement ?
            descriptionElement.textContent.toLowerCase() :
            "";


        // Search name, type or description

        if (
            restaurantName.includes(searchText) ||
            restaurantType.includes(searchText) ||
            restaurantDescription.includes(searchText)
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

}


// ==================================================
// HOME PAGE CATEGORY NAVIGATION
// ==================================================

function openCategory(category) {

    localStorage.setItem(
        "selectedCategory",
        category
    );

    window.location.href =
        "menu.html";

}


// ==================================================
// MENU CATEGORY FILTER
// ==================================================

const filterButtons =
    document.querySelectorAll(".filter-button");

const menuCards =
    document.querySelectorAll(".menu-card");


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class from all buttons

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Make clicked button active

        this.classList.add("active");


        // Get category from data-category

        const selectedCategory =
            this.getAttribute("data-category");


        // Filter menu cards

        menuCards.forEach(function(card) {

            const cardCategory =
                card.getAttribute("data-category");


            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {

                card.style.display = "flex";

            } else {

                card.style.display = "none";

            }

        });

    });

});


// ==================================================
// OPEN MENU WITH SELECTED CATEGORY
// ==================================================

const savedCategory =
    localStorage.getItem("selectedCategory");


if (
    savedCategory &&
    filterButtons.length > 0
) {

    filterButtons.forEach(function(button) {

        const category =
            button.getAttribute("data-category");


        if (category === savedCategory) {

            button.click();

        }

    });


    localStorage.removeItem(
        "selectedCategory"
    );

}


// ==================================================
// THEME
// ==================================================

const themeSelector =
    document.getElementById("themeSelector");


function applyTheme(theme) {

    document.body.classList.remove(
        "dark-theme",
        "purple-theme"
    );


    if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }


    if (theme === "purple") {

        document.body.classList.add(
            "purple-theme"
        );

    }

}


// Load saved theme

const savedTheme =
    localStorage.getItem("theme") || "light";


applyTheme(savedTheme);


if (themeSelector) {

    themeSelector.value =
        savedTheme;


    themeSelector.addEventListener(
        "change",
        function() {

            const theme =
                this.value;


            localStorage.setItem(
                "theme",
                theme
            );


            applyTheme(theme);

        }
    );

}


// ==================================================
// LANGUAGE
// ==================================================

const languageSelector =
    document.getElementById("languageSelector");


const translations = {

    en: {

        loginTitle: "Welcome !",

        loginSubtitle:
            "Login to continue your food journey",

        emailLabel:
            "Email Address",

        emailPlaceholder:
            "Enter your email",

        passwordLabel:
            "Password",

        passwordPlaceholder:
            "Enter your password",

        remember:
            "Remember me",

        forgot:
            "Forgot Password?",

        login:
            "Login",

        newAccount:
            "Don't have an account?",

        createAccount:
            "Create Account",


        registerTitle:
            "Create Account",

        registerSubtitle:
            "Join SpeedyFoodie today!",

        name:
            "Full Name",

        namePlaceholder:
            "Enter your name",

        confirm:
            "Confirm Password",

        confirmPlaceholder:
            "Confirm your password",

        create:
            "Create Account",

        already:
            "Already have an account?"

    },


    te: {

        loginTitle:
            "స్వాగతం!",

        loginSubtitle:
            "మీ ఫుడ్ జర్నీని కొనసాగించడానికి లాగిన్ చేయండి",

        emailLabel:
            "ఈమెయిల్ చిరునామా",

        emailPlaceholder:
            "మీ ఈమెయిల్ నమోదు చేయండి",

        passwordLabel:
            "పాస్‌వర్డ్",

        passwordPlaceholder:
            "మీ పాస్‌వర్డ్ నమోదు చేయండి",

        remember:
            "నన్ను గుర్తుంచుకోండి",

        forgot:
            "పాస్‌వర్డ్ మర్చిపోయారా?",

        login:
            "లాగిన్",

        newAccount:
            "ఖాతా లేదా?",

        createAccount:
            "ఖాతాను సృష్టించండి",


        registerTitle:
            "ఖాతాను సృష్టించండి",

        registerSubtitle:
            "ఈరోజే SpeedyFoodie లో చేరండి!",

        name:
            "పూర్తి పేరు",

        namePlaceholder:
            "మీ పేరు నమోదు చేయండి",

        confirm:
            "పాస్‌వర్డ్ నిర్ధారించండి",

        confirmPlaceholder:
            "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",

        create:
            "ఖాతాను సృష్టించండి",

        already:
            "ఇప్పటికే ఖాతా ఉందా?"

    },


    hi: {

        loginTitle:
            "स्वागत है!",

        loginSubtitle:
            "अपनी फूड जर्नी जारी रखने के लिए लॉगिन करें",

        emailLabel:
            "ईमेल पता",

        emailPlaceholder:
            "अपना ईमेल दर्ज करें",

        passwordLabel:
            "पासवर्ड",

        passwordPlaceholder:
            "अपना पासवर्ड दर्ज करें",

        remember:
            "मुझे याद रखें",

        forgot:
            "पासवर्ड भूल गए?",

        login:
            "लॉगिन",

        newAccount:
            "क्या आपका खाता नहीं है?",

        createAccount:
            "खाता बनाएँ",


        registerTitle:
            "खाता बनाएँ",

        registerSubtitle:
            "आज ही SpeedyFoodie से जुड़ें!",

        name:
            "पूरा नाम",

        namePlaceholder:
            "अपना नाम दर्ज करें",

        confirm:
            "पासवर्ड की पुष्टि करें",

        confirmPlaceholder:
            "पासवर्ड फिर से दर्ज करें",

        create:
            "खाता बनाएँ",

        already:
            "क्या आपका पहले से खाता है?"

    }

};


// =========================
// CHANGE LANGUAGE
// =========================

function changeLanguage(language) {

    const text =
        translations[language] || translations.en;


    // LOGIN PAGE

    const loginTitle =
        document.getElementById("loginTitle");

    if (loginTitle)
        loginTitle.textContent =
            text.loginTitle;


    const loginSubtitle =
        document.getElementById("loginSubtitle");

    if (loginSubtitle)
        loginSubtitle.textContent =
            text.loginSubtitle;


    const emailLabel =
        document.getElementById("loginEmailLabel");

    if (emailLabel)
        emailLabel.textContent =
            text.emailLabel;


    const email =
        document.getElementById("email");

    if (email)
        email.placeholder =
            text.emailPlaceholder;


    const passwordLabel =
        document.getElementById(
            "loginPasswordLabel"
        );

    if (passwordLabel)
        passwordLabel.textContent =
            text.passwordLabel;


    const password =
        document.getElementById("password");

    if (password)
        password.placeholder =
            text.passwordPlaceholder;


    const remember =
        document.getElementById(
            "rememberText"
        );

    if (remember)
        remember.textContent =
            text.remember;


    const forgot =
        document.getElementById(
            "forgotText"
        );

    if (forgot)
        forgot.textContent =
            text.forgot;


    const loginButton =
        document.getElementById(
            "loginButton"
        );

    if (loginButton)
        loginButton.textContent =
            text.login;


    const newAccount =
        document.getElementById(
            "newAccountText"
        );

    if (newAccount)
        newAccount.textContent =
            text.newAccount;


    const createAccount =
        document.getElementById(
            "createAccountLink"
        );

    if (createAccount)
        createAccount.textContent =
            text.createAccount;


    // REGISTER PAGE

    const registerTitle =
        document.getElementById(
            "registerTitle"
        );

    if (registerTitle)
        registerTitle.textContent =
            text.registerTitle;


    const registerSubtitle =
        document.getElementById(
            "registerSubtitle"
        );

    if (registerSubtitle)
        registerSubtitle.textContent =
            text.registerSubtitle;


    const nameLabel =
        document.getElementById(
            "nameLabel"
        );

    if (nameLabel)
        nameLabel.textContent =
            text.name;


    const nameInput =
        document.getElementById("name");

    if (nameInput)
        nameInput.placeholder =
            text.namePlaceholder;


    const registerEmailLabel =
        document.getElementById(
            "emailLabel"
        );

    if (registerEmailLabel)
        registerEmailLabel.textContent =
            text.emailLabel;


    const registerEmail =
        document.getElementById(
            "registerEmail"
        );

    if (registerEmail)
        registerEmail.placeholder =
            text.emailPlaceholder;


    const registerPasswordLabel =
        document.getElementById(
            "passwordLabel"
        );

    if (registerPasswordLabel)
        registerPasswordLabel.textContent =
            text.passwordLabel;


    const registerPassword =
        document.getElementById(
            "registerPassword"
        );

    if (registerPassword)
        registerPassword.placeholder =
            text.passwordPlaceholder;


    const confirmLabel =
        document.getElementById(
            "confirmLabel"
        );

    if (confirmLabel)
        confirmLabel.textContent =
            text.confirm;


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );

    if (confirmPassword)
        confirmPassword.placeholder =
            text.confirmPlaceholder;


    const createButton =
        document.getElementById(
            "createButton"
        );

    if (createButton)
        createButton.textContent =
            text.create;


    const alreadyText =
        document.getElementById(
            "alreadyText"
        );

    if (alreadyText)
        alreadyText.textContent =
            text.already;


    const loginLink =
        document.getElementById(
            "loginLink"
        );

    if (loginLink)
        loginLink.textContent =
            text.login;

}


// =========================
// LOAD SAVED LANGUAGE
// =========================

const savedLanguage =
    localStorage.getItem("language") || "en";


changeLanguage(savedLanguage);


if (languageSelector) {

    languageSelector.value =
        savedLanguage;


    languageSelector.addEventListener(
        "change",
        function() {

            const language =
                this.value;


            localStorage.setItem(
                "language",
                language
            );


            changeLanguage(language);

        }
    );

}


// ==================================================
// SMART FOOD SUGGESTIONS
// ==================================================

const smartFoodItems = [

    {
        name: "Chicken Biryani",
        price: 180,
        category: "Indian",
        image: "images/biryani.jpg"
    },

    {
        name: "Chicken Burger",
        price: 150,
        category: "Burger",
        image: "images/burger.jpg"
    },

    {
        name: "Margherita Pizza",
        price: 200,
        category: "Pizza",
        image: "images/pizza.jpg"
    },

    {
        name: "Chicken Fried Rice",
        price: 160,
        category: "Chinese",
        image: "images/fried-rice.jpg"
    }

];


// Get food category

function getFoodCategory(foodName) {

    const food =
        smartFoodItems.find(
            item => item.name === foodName
        );

    if (food) {
        return food.category;
    }

    return "Indian";

}


// =========================
// SHOW SMART SUGGESTIONS
// =========================

function showSmartSuggestions() {

    const container =
        document.getElementById(
            "suggestionContainer"
        );

    if (!container) {
        return;
    }


    const previousOrders =
        JSON.parse(
            localStorage.getItem("previousOrders")
        ) || [];


    let suggestions = [];


    // Check previous orders

    if (previousOrders.length > 0) {

        const lastOrder =
            previousOrders[
                previousOrders.length - 1
            ];


        suggestions =
            smartFoodItems.filter(
                item =>
                    item.category ===
                    lastOrder.category
            );

    }


    // If there are no previous orders,
    // show some food suggestions

    if (suggestions.length === 0) {

        suggestions =
            smartFoodItems.slice(0, 3);

    }


    container.innerHTML = "";


    suggestions.forEach(item => {

        const card =
            document.createElement("div");

        card.className =
            "suggestion-card";


        card.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <h3>
                ${item.name}
            </h3>

            <p>
                ₹${item.price}
            </p>

            <button>
                Add to Cart
            </button>

        `;


        const button =
            card.querySelector("button");


        button.addEventListener(
            "click",
            function() {

                addSuggestedFood(
                    item.name
                );

            }
        );


        container.appendChild(card);

    });

}


// =========================
// ADD SUGGESTED FOOD
// =========================

function addSuggestedFood(foodName) {

    const food =
        smartFoodItems.find(
            item =>
                item.name === foodName
        );


    if (!food) {
        return;
    }


    addToCart(
        food.name,
        food.price
    );

}


// Show suggestions when homepage loads

showSmartSuggestions();


// ==================================================
// REGISTER PAGE
// ==================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nameElement =
                document.getElementById("name");

            const emailElement =
                document.getElementById("registerEmail");

            const passwordElement =
                document.getElementById("registerPassword");

            const confirmElement =
                document.getElementById("confirmPassword");


            const name =
                nameElement ?
                nameElement.value.trim() :
                "";

            const email =
                emailElement ?
                emailElement.value.trim() :
                "";

            const password =
                passwordElement ?
                passwordElement.value.trim() :
                "";

            const confirmPassword =
                confirmElement ?
                confirmElement.value.trim() :
                "";


            if (
                name === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                alert(
                    "Please fill in all the fields."
                );

                return;

            }


            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            localStorage.setItem(
                "registeredName",
                name
            );

            localStorage.setItem(
                "registeredEmail",
                email
            );


            alert(
                "Account created successfully! 🎉"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ==================================================
// LOGOUT
// ==================================================

function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href =
        "login.html";

}


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCart();
        displayCheckout();
        showSmartSuggestions();

    }
);