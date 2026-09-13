function openCustomerForm() {
    document.getElementById("customerModal").style.display = "flex";
}

function closeCustomerForm() {
    document.getElementById("customerModal").style.display = "none";
}

function addCustomer() {

    let name = document.getElementById("customerName").value.trim();
    let phone = document.getElementById("customerPhone").value.trim();
    let address = document.getElementById("customerAddress").value.trim();

    if (name === "" || phone === "") {
        alert("Please enter customer name and phone number.");
        return;
    }

    const customerData = {
        name: name,
        phone: phone,
        address: address,
        totalPurchase: 0,
        totalDue: 0
    };

    database.ref("customers").push(customerData)
    .then(() => {

        alert("Customer added successfully!");

        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerAddress").value = "";

        closeCustomerForm();

    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add customer.");
    });
}

function updateCustomerCount() {

    let rows = document
        .getElementById("customerTable")
        .getElementsByTagName("tr");

    document.getElementById("customerCount").innerText =
        rows.length + " Customers";
}

function searchCustomers() {

    let searchValue =
        document.getElementById("searchCustomer")
        .value
        .toLowerCase();

    let rows =
        document.getElementById("customerTable")
        .getElementsByTagName("tr");

    for (let row of rows) {

        let text = row.innerText.toLowerCase();

        if (text.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}



// =========================
// PURCHASE MODULE
// =========================

let purchaseItems = [];
let purchaseTotal = 0;


// Add Product
function addProduct() {

    const productName =
        document.getElementById("productName").value.trim();

    const quantity =
        Number(document.getElementById("quantity").value);

    const price =
        Number(document.getElementById("price").value);

    if (productName === "") {
        alert("Please enter product name.");
        return;
    }

    if (quantity <= 0 || price < 0) {
        alert("Please enter valid quantity and price.");
        return;
    }

    const total = quantity * price;

    purchaseItems.push({
        product: productName,
        quantity: quantity,
        price: price,
        total: total
    });

    displayPurchaseItems();

    document.getElementById("productName").value = "";
    document.getElementById("quantity").value = "1";
    document.getElementById("price").value = "";
}


// Display Products
function displayPurchaseItems() {

    const table =
        document.getElementById("purchaseTable");

    table.innerHTML = "";

    purchaseTotal = 0;

    purchaseItems.forEach(function(item) {

        purchaseTotal += item.total;

        const row = table.insertRow();

        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${item.total}</td>
        `;
    });

    document.getElementById("totalAmount").innerText =
        "₹" + purchaseTotal;

    calculateDue();
}


// Calculate Due
function calculateDue() {

    const paid =
        Number(document.getElementById("amountPaid").value);

    let due = purchaseTotal - paid;

    if (due < 0) {
        due = 0;
    }

    document.getElementById("dueAmount").innerText =
        "₹" + due;
}


// Save Purchase
function savePurchase() {

    const customerId =
        document.getElementById("purchaseCustomer").value;

    const customerText =
        document.getElementById("purchaseCustomer")
            .selectedOptions[0].text;

    const paid =
        Number(document.getElementById("amountPaid").value);

    if (customerId === "") {
        alert("Please select a customer.");
        return;
    }

    if (purchaseItems.length === 0) {
        alert("Please add at least one product.");
        return;
    }

    const due = purchaseTotal - paid;
    const customerRef = database.ref("customers/" + customerId);

customerRef.once("value").then((snapshot) => {

    const customerData = snapshot.val() || {};

    const oldPurchase = Number(customerData.totalPurchase || 0);
    const oldDue = Number(customerData.totalDue || 0);

    const newPurchase = oldPurchase + purchaseTotal;
    const newDue = oldDue + due;

    return customerRef.update({
        totalPurchase: newPurchase,
        totalDue: newDue
    });

}).then(() => {

    return database.ref("purchases").push(purchaseData);

}).then(() => {

    alert("Purchase saved successfully!");

    purchaseItems = [];
    purchaseTotal = 0;

    document.getElementById("purchaseTable").innerHTML = "";
    document.getElementById("totalAmount").innerText = "₹0";
    document.getElementById("dueAmount").innerText = "₹0";
    document.getElementById("amountPaid").value = "0";
    document.getElementById("purchaseCustomer").value = "";

}).catch((error) => {

    console.error("Purchase Error:", error);
    alert("Failed to save purchase.");

});

    const purchaseData = {
        customerId: customerId,
        customer: customerText,
        items: purchaseItems,
        totalAmount: purchaseTotal,
        amountPaid: paid,
        dueAmount: due,
        date: new Date().toISOString()
    };

    database.ref("purchases").push(purchaseData)
        .then(() => {

            alert("Purchase saved successfully!");

            purchaseItems = [];
            purchaseTotal = 0;

            document.getElementById("purchaseTable").innerHTML = "";
            document.getElementById("totalAmount").innerText = "₹0";
            document.getElementById("dueAmount").innerText = "₹0";
            document.getElementById("amountPaid").value = "0";
            document.getElementById("purchaseCustomer").value = "";

        })
        .catch((error) => {

            console.error("Purchase Error:", error);
            alert("Failed to save purchase.");

        });
}
// =========================
// CREDIT BOOK MODULE
// =========================

function searchCreditCustomers() {

    const searchValue =
        document.getElementById("creditSearch")
        .value
        .toLowerCase();

    const rows =
        document.getElementById("creditTable")
        .getElementsByTagName("tr");

    for (let row of rows) {

        const text = row.innerText.toLowerCase();

        if (text.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}


function sendReminder(name, amount) {

    alert(
        "Payment Reminder\n\n" +
        "Customer: " + name +
        "\nPending Amount: ₹" + amount +
        "\n\nReminder sent successfully!"
    );
}


function viewCustomer(name) {

    alert(
        "Customer Details\n\n" +
        "Customer: " + name +
        "\n\nPayment Status: Paid"
    );
}

// =========================
// FIREBASE CONFIGURATION
// =========================

const firebaseConfig = {
     apiKey: "AIzaSyB5IvTn3vtZrqtKQWIPs3kpjL_b55ViV9M",
    authDomain: "smartcreditbook.firebaseapp.com",
    projectId: "smartcreditbook",
    storageBucket: "smartcreditbook.firebasestorage.app",
    messagingSenderId: "34184790606",
    appId: "1:34184790606:web:5fff8bdcdc743dc29ff91f",
    measurementId: "G-ZZB0G93C7F",
    databaseURL: "https://smartcreditbook-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

console.log("Firebase connected successfully!");

function loadCustomers() {

    const customerTable = document.getElementById("customerTable");

    // Customer table illa na function stop aagum
    if (!customerTable) {
        return;
    }

    database.ref("customers").on("value", (snapshot) => {

        customerTable.innerHTML = "";

        snapshot.forEach((child) => {

            const customer = child.val();

            const row = `
    <tr>
        <td>${customer.name || ""}</td>
        <td>${customer.phone || ""}</td>
        <td>${customer.totalPurchase || 0}</td>
        <td>₹${customer.totalDue || 0}</td>
        <td>
            <span class="${customer.totalDue > 0 ? "pending" : "paid"}">
                ${customer.totalDue > 0 ? "Pending" : "Paid"}
            </span>
        </td>
        <td>
            <button class="delete-btn"
                onclick="deleteCustomer('${child.key}', '${customer.name || ""}')">
                🗑️ Delete
            </button>
        </td>
    </tr>
`;

            customerTable.innerHTML += row;
        });

    });
    }

window.addEventListener("load", loadCustomers);


function loadPurchaseCustomers() {

    const dropdown = document.getElementById("purchaseCustomer");

    if (!dropdown) {
        return;
    }

    database.ref("customers").on("value", (snapshot) => {

        dropdown.innerHTML = '<option value="">Select Customer</option>';

        snapshot.forEach((child) => {

            const customer = child.val();

            const option = document.createElement("option");

            option.value = child.key;
            option.textContent = customer.name + " - " + customer.phone;

            dropdown.appendChild(option);
        });

    });
}
window.addEventListener("load", loadPurchaseCustomers);

function loadCreditBook() {

    const creditTable = document.getElementById("creditTable");

    if (!creditTable) {
        return;
    }

    let activeCustomers = {};
    let purchasesData = null;


    // Load customers
    database.ref("customers").on("value", (customerSnapshot) => {

        activeCustomers = {};

        customerSnapshot.forEach((child) => {

            activeCustomers[child.key] = true;

        });

        displayCreditBook();

    });


    // Load purchases
    database.ref("purchases").on("value", (purchaseSnapshot) => {

        purchasesData = purchaseSnapshot;

        displayCreditBook();

    });


    function displayCreditBook() {

        if (!purchasesData) {
            return;
        }

        creditTable.innerHTML = "";

        const customers = {};


        purchasesData.forEach((child) => {

            const purchase = child.val();

            const customerId = purchase.customerId || "";

            // Deleted customer-na skip pannidu
            if (!activeCustomers[customerId]) {
                return;
            }


            const customerText =
                purchase.customer || "Unknown";

            const parts =
                customerText.split(" - ");

            const customerName =
                parts[0] || "Unknown";

            const phone =
                parts[1] || "";


            const total =
                Number(purchase.totalAmount || 0);

            const paid =
                Number(purchase.amountPaid || 0);

            const due =
                Number(purchase.dueAmount || 0);


            // Unique customer key
            const key =
                customerId || customerName + "-" + phone;


            // First purchase
            if (!customers[key]) {

                customers[key] = {

                    customerId: customerId,

                    name: customerName,

                    phone: phone,

                    total: 0,

                    paid: 0,

                    due: 0

                };

            }


            // Add purchase amounts
            customers[key].total += total;

            customers[key].paid += paid;

            customers[key].due += due;

        });


        // Display customers
        Object.values(customers).forEach((customer) => {

            const row = `
                <tr>

                    <td>${customer.name}</td>

                    <td>${customer.phone}</td>

                    <td>₹${customer.total}</td>

                    <td>₹${customer.paid}</td>

                    <td>₹${customer.due}</td>

                    <td>

                        <span class="${customer.due > 0 ? "pending" : "paid"}">

                            ${customer.due > 0 ? "Pending" : "Paid"}

                        </span>

                    </td>

                    <td>

                        ${customer.due > 0 ? `

                            <button
                                class="reminder-btn"
                                onclick="collectPayment(
                                    '${customer.customerId}',
                                    '${customer.name}',
                                    ${customer.due}
                                )">

                                💰 Collect Payment

                            </button>

                        ` : `

                            <button
                                class="view-btn"
                                onclick="viewCustomer('${customer.name}')">

                                👁 View

                            </button>

                        `}

                    </td>

                </tr>
            `;

            creditTable.innerHTML += row;

        });

    }

}

window.addEventListener("load", loadCreditBook);
function loadPaymentReminders() {

    const reminderList = document.getElementById("reminderList");

    if (!reminderList) {
        return;
    }

    let activeCustomers = {};
    let purchasesData = null;


    // Get currently existing customers
    database.ref("customers").on("value", (customerSnapshot) => {

        activeCustomers = {};

        customerSnapshot.forEach((child) => {
            activeCustomers[child.key] = true;
        });

        displayReminders();

    });


    // Get purchases
    database.ref("purchases").on("value", (purchaseSnapshot) => {

        purchasesData = purchaseSnapshot;

        displayReminders();

    });


    function displayReminders() {

        if (!purchasesData) {
            return;
        }

        reminderList.innerHTML = "";

        const customers = {};


        purchasesData.forEach((child) => {

            const purchase = child.val();

            const due = Number(purchase.dueAmount || 0);

            if (due <= 0) {
                return;
            }


            const customerId = purchase.customerId || "";

            // Deleted customer-na reminder show panna vendam
            if (!activeCustomers[customerId]) {
                return;
            }


            const customerText =
                purchase.customer || "Customer";

            const customerName =
                customerText.split(" - ")[0];


            if (customers[customerId]) {

                customers[customerId].due += due;

            } else {

                customers[customerId] = {
                    name: customerName,
                    due: due,
                    id: customerId
                };

            }

        });


        const customerList =
            Object.values(customers);


        if (customerList.length === 0) {

            reminderList.innerHTML =
                "<p>No pending payments.</p>";

            return;

        }


        customerList.forEach((customer) => {

            reminderList.innerHTML += `
                <div class="reminder-item">

                    <div>

                        <strong>${customer.name}</strong>

                        <p>
                            ₹${customer.due} payment is pending
                        </p>

                    </div>

                    <button
                        class="reminder-btn"
                        onclick="collectPayment(
                            '${customer.id}',
                            '${customer.name}',
                            ${customer.due}
                        )">

                        🔔 Send Reminder

                    </button>

                </div>
            `;

        });

    }

}

window.addEventListener("load", loadPaymentReminders);
function loadCreditSummary() {

    const totalCredit = document.getElementById("totalCredit");
    const pendingCustomers = document.getElementById("pendingCustomers");
    const collectedAmount = document.getElementById("collectedAmount");
    const reminderCount = document.getElementById("reminderCount");

    if (!totalCredit) {
        return;
    }

    let activeCustomers = {};
    let purchasesData = null;


    // Get currently active customers
    database.ref("customers").on("value", (customerSnapshot) => {

        activeCustomers = {};

        customerSnapshot.forEach((child) => {
            activeCustomers[child.key] = true;
        });

        updateCreditSummary();

    });


    // Get purchases
    database.ref("purchases").on("value", (purchaseSnapshot) => {

        purchasesData = purchaseSnapshot;

        updateCreditSummary();

    });


    function updateCreditSummary() {

        if (!purchasesData) {
            return;
        }

        let totalDue = 0;
        let totalPaid = 0;

        const pendingCustomerIds = {};


        purchasesData.forEach((child) => {

            const purchase = child.val();

            const customerId =
                purchase.customerId || "";

            // Deleted customer-na skip pannidu
            if (!activeCustomers[customerId]) {
                return;
            }


            const paid =
                Number(purchase.amountPaid || 0);

            const due =
                Number(purchase.dueAmount || 0);


            totalPaid += paid;
            totalDue += due;


            // Count each pending customer only once
            if (due > 0) {
                pendingCustomerIds[customerId] = true;
            }

        });


        const pendingCount =
            Object.keys(pendingCustomerIds).length;


        totalCredit.innerText =
            "₹" + totalDue;

        pendingCustomers.innerText =
            pendingCount;

        collectedAmount.innerText =
            "₹" + totalPaid;

        reminderCount.innerText =
            pendingCount;

    }

}

window.addEventListener("load", loadCreditSummary);

function loadDashboard() {

    const customersEl =
        document.getElementById("dashboardCustomers");

    if (!customersEl) {
        return;
    }


    // Get active customers
    database.ref("customers").on("value", (customerSnapshot) => {

        const activeCustomers = {};

        customerSnapshot.forEach((child) => {
            activeCustomers[child.key] = true;
        });


        const customerCount =
            customerSnapshot.numChildren();

        document.getElementById("dashboardCustomers").innerText =
            customerCount;


        // Get purchases
        database.ref("purchases").on("value", (snapshot) => {

            let totalDue = 0;
            let totalSales = 0;
            let totalPaid = 0;


            snapshot.forEach((child) => {

                const purchase = child.val();

                const customerId =
                    purchase.customerId || "";


                // Deleted customer-na skip pannidu
                if (!activeCustomers[customerId]) {
                    return;
                }


                totalSales +=
                    Number(purchase.totalAmount || 0);

                totalPaid +=
                    Number(purchase.amountPaid || 0);

                totalDue +=
                    Number(purchase.dueAmount || 0);

            });


            document.getElementById("dashboardDue").innerText =
                "₹" + totalDue;

            document.getElementById("dashboardSales").innerText =
                "₹" + totalSales;


            let collectionRate = 0;

            if (totalSales > 0) {

                collectionRate =
                    Math.round(
                        (totalPaid / totalSales) * 100
                    );

            }


            document.getElementById("dashboardRate").innerText =
                collectionRate + "%";

        });

    });

}

window.addEventListener("load", loadDashboard);

function collectPayment(customerId, customerName, currentDue) {
    console.log("COLLECT PAYMENT STARTED");
    console.log("Customer:", customerName);
    console.log("Current Due:", currentDue);

    const payment = prompt(
        customerName + " - Due: ₹" + currentDue +
        "\n\nEnter payment amount:"
    );

    if (payment === null) {
        return;
    }

    const amount = Number(payment);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    if (amount > currentDue) {
        alert("Payment cannot be greater than due amount.");
        return;
    }

    database.ref("purchases").once("value").then((snapshot) => {

        console.log("Purchases loaded");

        let remainingPayment = amount;
        const updates = {};

        snapshot.forEach((child) => {

            const purchase = child.val();

            console.log("Purchase:", purchase);
            console.log("Looking for:", customerName);

            if (
    remainingPayment > 0 &&
    purchase.customerId === customerId
) {

                const due = Number(purchase.dueAmount || 0);

                if (due > 0) {

                    const paymentForPurchase =
                        Math.min(remainingPayment, due);

                    updates[child.key + "/amountPaid"] =
                        Number(purchase.amountPaid || 0) +
                        paymentForPurchase;

                    updates[child.key + "/dueAmount"] =
                        due - paymentForPurchase;

                    remainingPayment -= paymentForPurchase;
                }
            }
        });

        console.log("Updates:", updates);

        if (Object.keys(updates).length === 0) {
            throw new Error("No matching purchase found.");
        }

        return database.ref("purchases").update(updates);

    }).then(() => {

        return database.ref("customers").once("value");

    }).then((snapshot) => {

        let customerKey = null;
        let customerData = null;

        snapshot.forEach((child) => {

            const customer = child.val();

            if (customer.name === customerName) {
                customerKey = child.key;
                customerData = customer;
            }
        });

        if (!customerKey) {
            throw new Error("Customer not found.");
        }

        const oldDue = Number(customerData.totalDue || 0);

        return database.ref(
            "customers/" + customerKey
        ).update({
            totalDue: Math.max(0, oldDue - amount)
        });

    }).then(() => {

        alert("Payment collected successfully! 💰");

        location.reload();

    }).catch((error) => {

        console.error("Payment Error:", error);

        alert("Payment failed: " + error.message);

    });
}
console.log("Collect Payment function loaded");

function loadAISuggestions() {

    const aiBox = document.getElementById("aiSuggestions");

    if (!aiBox) {
        return;
    }

    let activeCustomers = {};
    let purchaseSnapshot = null;

    // Get only current/active customers
    database.ref("customers").on("value", (customerSnapshot) => {

        activeCustomers = {};

        customerSnapshot.forEach((child) => {
            activeCustomers[child.key] = true;
        });

        updateAISuggestions();
    });

    // Get purchases
    database.ref("purchases").on("value", (snapshot) => {

        purchaseSnapshot = snapshot;

        updateAISuggestions();
    });


    function updateAISuggestions() {

        if (!purchaseSnapshot) {
            return;
        }

        aiBox.innerHTML = "";

        const customers = {};

        purchaseSnapshot.forEach((child) => {

            const purchase = child.val();

            const customerId = purchase.customerId || "";

            // Deleted customers are completely ignored
            if (!activeCustomers[customerId]) {
                return;
            }

            const customerText =
                purchase.customer || "Customer";

            const customerName =
                customerText.split(" - ")[0];

            const due =
                Number(purchase.dueAmount || 0);

            if (!customers[customerId]) {

                customers[customerId] = {
                    name: customerName,
                    due: 0
                };

            }

            customers[customerId].due += due;
        });


        let hasSuggestion = false;


        Object.values(customers).forEach((customer) => {

            if (customer.due >= 5000) {

                hasSuggestion = true;

                aiBox.innerHTML += `
                    <div class="alert">

                        <strong>
                            ⚠️ High Due Customer
                        </strong>

                        <p>
                            ${customer.name} has ₹${customer.due}
                            pending amount.
                        </p>

                    </div>
                `;

            }

            else if (customer.due > 0) {

                hasSuggestion = true;

                aiBox.innerHTML += `
                    <div class="alert">

                        <strong>
                            🔔 Reminder Required
                        </strong>

                        <p>
                            ${customer.name} has ₹${customer.due}
                            pending amount.
                        </p>

                    </div>
                `;
            }

        });


        if (!hasSuggestion) {

            aiBox.innerHTML = `
                <div class="alert">

                    <strong>
                        ✅ All Payments Clear
                    </strong>

                    <p>
                        No pending customer payments found.
                    </p>

                </div>
            `;

        }

    }

}


window.addEventListener("load", loadAISuggestions);

       
function loadReports() {
    const reportTable = document.getElementById("reportTable");

    if (!reportTable) {
        return;
    }

    database.ref("customers").once("value").then((customerSnapshot) => {

        const activeCustomerIds = {};

        customerSnapshot.forEach((child) => {
            activeCustomerIds[child.key] = true;
        });

        database.ref("purchases").on("value", (snapshot) => {

            let totalSales = 0;
            let totalPaid = 0;
            let totalDue = 0;

            reportTable.innerHTML = "";

            snapshot.forEach((child) => {

                const purchase = child.val();
                const customerId = purchase.customerId || "";

                // Deleted customers' purchases are ignored
                if (!activeCustomerIds[customerId]) {
                    return;
                }

                const customer = purchase.customer || "Unknown";
                const sales = Number(purchase.totalAmount || 0);
                const paid = Number(purchase.amountPaid || 0);
                const due = Number(purchase.dueAmount || 0);

                totalSales += sales;
                totalPaid += paid;
                totalDue += due;

                reportTable.innerHTML += `
                    <tr>
                        <td>${customer}</td>
                        <td>₹${sales}</td>
                        <td>₹${paid}</td>
                        <td>₹${due}</td>
                        <td>
                            <span class="${due > 0 ? "pending" : "paid"}">
                                ${due > 0 ? "Pending" : "Paid"}
                            </span>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("reportSales").innerText =
                "₹" + totalSales;

            document.getElementById("reportPaid").innerText =
                "₹" + totalPaid;

            document.getElementById("reportDue").innerText =
                "₹" + totalDue;

            let collectionRate = 0;

            if (totalSales > 0) {
                collectionRate = Math.round(
                    (totalPaid / totalSales) * 100
                );
            }

            document.getElementById("reportRate").innerText =
                collectionRate + "%";
        });
    });
}

window.addEventListener("load", loadReports);
function saveSettings() {

    const shopName =
        document.getElementById("shopName").value.trim();

    const ownerName =
        document.getElementById("ownerName").value.trim();

    const shopPhone =
        document.getElementById("shopPhone").value.trim();

    const reminderDays =
        Number(document.getElementById("reminderDays").value);

    const currency =
        document.getElementById("currency").value;


    if (shopName === "") {
        alert("Please enter shop name.");
        return;
    }

    const settingsData = {

        shopName: shopName,
        ownerName: ownerName,
        shopPhone: shopPhone,
        reminderDays: reminderDays,
        currency: currency

    };


    database.ref("settings").set(settingsData)

        .then(() => {

            alert("Settings saved successfully! ✅");

        })

        .catch((error) => {

            console.error("Settings Error:", error);

            alert("Failed to save settings.");

        });
}

function loadSettings() {

    const shopName = document.getElementById("shopName");

    // Settings page illa na stop
    if (!shopName) return;

    database.ref("settings").once("value")
        .then((snapshot) => {

            const settings = snapshot.val();

            if (!settings) return;

            document.getElementById("shopName").value =
                settings.shopName || "";

            document.getElementById("ownerName").value =
                settings.ownerName || "";

            document.getElementById("shopPhone").value =
                settings.shopPhone || "";

            document.getElementById("reminderDays").value =
                settings.reminderDays || 7;

            document.getElementById("currency").value =
                settings.currency || "₹";

        })
        .catch((error) => {
            console.error("Load Settings Error:", error);
        });
}

window.addEventListener("load", loadSettings);


function deleteCustomer(customerId, customerName) {

    const confirmDelete = confirm(
        "Are you sure you want to delete " + customerName + "?"
    );

    if (!confirmDelete) {
        return;
    }

    database.ref("customers/" + customerId).remove()
        .then(() => {
            alert("Customer deleted successfully! ✅");
        })
        .catch((error) => {
            console.error("Delete Customer Error:", error);
            alert("Failed to delete customer.");
        });
}