const apiBaseUrl = "https://wob-soccer-website.onrender.com/user/api/v1/get-all-users"; // Change this to your actual backend URL

    // --- Fetch all customers and populate table ---
  async function fetchCustomers() {
  try {
      const response = await fetch(apiBaseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}) // Empty payload
      });
    if (!response.ok) throw new Error("Failed to fetch customers");
    const customers = await response.json();

    const tableBody = document.querySelector("#customersTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    customers.forEach(customer => {
      const row = `
    <tr>
        <td>${customer.id}</td>
        <td>${customer.fullName}</td>
        <td>${customer.emailAddress}</td>
        <td>${customer.phone}</td>
        <td>${customer.role || "Customer"}</td>
        <td>
            <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.id})">Delete</button>
        </td>
    </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
        console.error("Error fetching customers:", error);
    alert("Error loading customers.");
  }
}

// --- Fetch all Admins and populate table ---
async function fetchAdmins() {
    try {
        const response = await fetch("https://wob-soccer-website.onrender.com/admin/api/v1/get-all-admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}) // Empty payload
        });
        if (!response.ok) throw new Error("Failed to fetch customers");
        const admins = await response.json();

        const tableBody = document.querySelector("#adminsTable tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        admins.forEach(admin => {
            const row = `
    <tr>
        <td>${admin.id}</td>
        <td>${admin.fullName}</td>
        <td>${admin.emailAddress}</td>
        <td>${admin.phone}</td>
        <td>${admin.role || "Admin"}</td>
        <td>
            <button class="btn btn-sm btn-danger" onclick="deleteAdmin(${admin.id})">Delete</button>
        </td>
    </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    } catch (error) {
        console.error("Error fetching admins:", error);
        alert("Error loading admins.");
    }
}

// --- Add new customer ---
document.querySelector("#customerForm").addEventListener("submit", async (e) => {
        e.preventDefault();

    const customerData = {
        fullName: document.querySelector("#customerName").value.trim(),
        emailAddress: document.querySelector("#customerEmail").value.trim(),
        phone: document.querySelector("#customerPhone").value.trim(),
        password: document.querySelector("#customerPassword").value.trim()
  };

    try {
        const response = await fetch("https://wob-soccer-website.onrender.com/auth/api/v1/register", {
        method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(customerData)
    });

    if (!response.ok) throw new Error("Failed to add customer");
    alert("Customer added successfully!");

    document.querySelector("#customerForm").reset();
    fetchCustomers(); // Refresh table
  } catch (error) {
        console.error("Error adding customer:", error);
    alert("Error adding customer.");
  }
});

// --- Add new customer ---
document.querySelector("#adminForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const adminData = {
        fullName: document.querySelector("#adminName").value.trim(),
        emailAddress: document.querySelector("#adminEmail").value.trim(),
        phone: document.querySelector("#adminPhone").value.trim(),
        password: document.querySelector("#adminPassword").value.trim()
    };

    try {
        const response = await fetch("https://wob-soccer-website.onrender.com/admin/api/v1/create-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData)
        });

        if (!response.ok) throw new Error("Failed to add admin");
        alert("Admin added successfully!");

        document.querySelector("#adminForm").reset();
        fetchAdmins(); // Refresh table
    } catch (error) {
        console.error("Error adding admin:", error);
        alert("Error adding admin.");
    }
});

  //Delete customer ---
  async function deleteCustomer(id) {
  if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
        const response = await fetch("https://wob-soccer-website.onrender.com/user/api/v1/delete-user-by-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
    if (!response.ok) throw new Error("Failed to delete customer");
    alert("Customer deleted successfully!");
    fetchCustomers();
  } catch (error) {
        console.error("Error deleting customer:", error);
    alert("Error deleting customer.");
  }
}

//Delete admin ---
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
        alert("Admin deleted successfully!");
        fetchAdmins();
    } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Error deleting admin.");
    }
}

// --- Load all customers on page load ---
document.addEventListener("DOMContentLoaded", fetchCustomers);
document.addEventListener("DOMContentLoaded", fetchAdmins);

