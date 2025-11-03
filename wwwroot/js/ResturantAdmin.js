
// Function to fetch all admins and display them in the table
async function loadAdmins() {
    const tableBody = document.querySelector("#adminsTable tbody");
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Loading...</td></tr>`;

    try {
        const role = "RestaurantAdmin"
        const response = await fetch("https://wob-soccer-website.onrender.com/admin/api/v1/get-all-by-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({role})
        });

        if (!response.ok) throw new Error("Failed to fetch admins");
        const admins = await response.json();

        if (admins.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No admins found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        admins.forEach(admin => {
            const row = document.createElement("tr");
            row.innerHTML = `
    <td>${admin.id}</td>
    <td>${admin.fullName}</td>
    <td>${admin.emailAddress}</td>
    <td>${admin.phone}</td>
    <td>${admin.role || "Admin"}</td>
    <td>
        <button class="btn btn-sm btn-danger" onclick="deleteAdmin(${admin.id})">Delete</button>
    </td>
    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading admins:", error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading admins.</td></tr>`;
    }
}

// Function to add a new admin
document.getElementById("adminForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const adminData = {
        fullName: document.getElementById("adminName").value.trim(),
        emailAddress: document.getElementById("adminEmail").value.trim(),
        phone: document.getElementById("adminPhone").value.trim(),
        password: document.getElementById("adminPassword").value.trim(),
        role: "RestaurantAdmin"
    };

    if (!adminData.fullName || !adminData.emailAddress || !adminData.phone || !adminData.password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch("https://wob-soccer-website.onrender.com/admin/api/v1/create-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData)
        });

        if (!response.ok) throw new Error("Failed to add admin");
        alert("Admin added successfully!");

        // Clear form
        document.getElementById("adminForm").reset();

        // Refresh the admin list
        loadAdmins();
    } catch (error) {
        console.error("Error adding admin:", error);
        alert("Error adding admin. Please try again.");
    }
});

// Optional: delete admin function
async function deleteAdmin(id) {
    if (localStorage.getItem("userId") == id) {
        alert("You cannot delete Logged In Admin.");
        return;
    }
    if (!confirm("Are you sure you want to delete this admin?")) return;
    
    try {
        const response = await fetch("https://wob-soccer-website.onrender.com/admin/api/v1/delete-admin-by-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        if (!response.ok) throw new Error("Failed to delete admin");
        alert("Admin deleted successfully.");
        loadAdmins();
    } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Error deleting admin.");
    }
}


   
const baseUrl = "https://wob-soccer-website.onrender.com/food/api/v1";
let allFoods = []; // store all foods for search filtering

// Load all foods on page load
async function loadFoods() {
    const tbody = document.getElementById("foodTableBody");
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Loading...</td></tr>`;

    try {
        const response = await fetch(`${baseUrl}/get-all-items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        if (!response.ok) throw new Error("Failed to fetch foods");
        allFoods = await response.json();

        if (!allFoods || allFoods.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No food items found.</td></tr>`;
            return;
        }

        displayFoods(allFoods);
    } catch (error) {
        console.error("Error loading foods:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading food data.</td></tr>`;
    }
}

// Display foods in the table
function displayFoods(foods) {
    const tbody = document.getElementById("foodTableBody");
    tbody.innerHTML = "";

    foods.forEach((food, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${index + 1}</td>
    <td>${food.name}</td>
    <td>R${food.price.toFixed(2)}</td>
    <td>${food.category}</td>
    <td>${food.description || ""}</td>
    <td>
        ${food.imageUrl
                ? `<img src="${food.imageUrl}" alt="${food.name}" width="60" height="60" class="rounded">`
                : `<span class="text-muted">No image</span>`
            }
    </td>
    <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editFood(${food.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFood(${food.id})">Delete</button>
    </td>
    `;
        tbody.appendChild(row);
    });
}

// Add or update food item
document.getElementById("foodForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const foodData = {
        id: document.getElementById("foodForm").dataset.editId || null,
        name: document.getElementById("name").value.trim(),
        price: parseFloat(document.getElementById("price").value),
        category: document.getElementById("category").value.trim(),
        imageUrl: document.getElementById("imageUrl").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    if (!foodData.name || !foodData.price || !foodData.category) {
        alert("Please fill in all required fields.");
        return;
    }

    const endpoint = foodData.id ? `${baseUrl}/update-item` : `${baseUrl}/create-item`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(foodData)
        });

        if (!response.ok) throw new Error("Failed to save food");

        alert(foodData.id ? "Food item updated successfully!" : "Food item added successfully!");
        document.getElementById("foodForm").reset();
        document.getElementById("foodForm").removeAttribute("data-edit-id");
        loadFoods();
    } catch (error) {
        console.error("Error saving food:", error);
        alert("Error saving food item. Please try again.");
    }
});

// Populate form for editing
async function editFood(id) {
    const food = allFoods.find(f => f.id === id);
    if (!food) return alert("Food not found.");

    document.getElementById("name").value = food.name;
    document.getElementById("price").value = food.price;
    document.getElementById("category").value = food.category;
    document.getElementById("imageUrl").value = food.imageUrl || "";
    document.getElementById("description").value = food.description || "";
    document.getElementById("foodForm").dataset.editId = food.id;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete food item
async function deleteFood(id) {
    if (!confirm("Are you sure you want to delete this food item?")) return;

    try {
        const response = await fetch(`${baseUrl}/delete-item-by-id`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        if (!response.ok) throw new Error("Failed to delete food");
        alert("Food item deleted successfully!");
        loadFoods();
    } catch (error) {
        console.error("Error deleting food:", error);
        alert("Error deleting food item.");
    }
}

// Search filter functionality
document.getElementById("searchFood").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredFoods = allFoods.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
    );
    displayFoods(filteredFoods);
});

document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.getElementById("orderTableBody");
    const apiUrl = "https://wob-soccer-website.onrender.com/orders/api/v1/get-all-orders";

    // 🔹 Load Orders from API
    async function loadOrders() {
        orderTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Loading...</td></tr>`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}) // ✅ POST with empty payload
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const orders = await response.json();

            if (!orders || orders.length === 0) {
                orderTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No orders found</td></tr>`;
                return;
            }

            // Sort orders by newest date first
            orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Clear table before populating
            orderTableBody.innerHTML = "";

            orders.forEach(order => {
                const orderRow = `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.fullName}</td>
                        <td>${order.email}</td>
                        <td>${order.phone}</td>
                        <td>${order.paymentMethod}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>${new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#items${order.id}">
                                View Items
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <div class="collapse mt-2" id="items${order.id}">
                                <ul class="list-group">
                                    ${order.items && order.items.length > 0
                        ? order.items
                            .map(
                                item => `
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                            ${item.name} (x${item.qty})
                                                            <span>R${item.price.toFixed(2)}</span>
                                                        </li>
                                                    `
                            )
                            .join("")
                        : `<li class="list-group-item text-muted text-center">No items</li>`
                    }
                                </ul>
                            </div>
                        </td>
                    </tr>
                `;

                orderTableBody.insertAdjacentHTML("beforeend", orderRow);
            });
        } catch (error) {
            console.error("Error loading orders:", error);
            orderTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Failed to load orders</td></tr>`;
        }
    }

    // 🔹 Auto-load orders on page start
    loadOrders();
});
// Load all foods automatically when the page is ready
document.addEventListener("DOMContentLoaded", loadFoods);
// Load admins automatically when the page is ready
document.addEventListener("DOMContentLoaded", loadAdmins);

