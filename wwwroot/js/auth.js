document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
    const adminLink = document.querySelector(".admin-link");

    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    // === 1. Restrict navigation if not logged in ===
    const isLoginPage = window.location.pathname.toLowerCase().includes("/account/login");
    const isRegisterPage = window.location.pathname.toLowerCase().includes("/account/register");
    const isAdminLoginPage = window.location.pathname.toLowerCase().includes("/account/adminlogin");

    if (!userId && !(isLoginPage || isRegisterPage || isAdminLoginPage)) {
        window.location.href = "/Account/Login";
        return;
    }

    // === 2. Hide "Admin" if role is "User" ===
    if (role === "User" && adminLink) {
        adminLink.style.display = "none";
    }

    // === 3. Show logout button if logged in ===
    if (userId && logoutBtn) {
        logoutBtn.classList.remove("d-none");
    }

    // === 4. Logout clears session ===
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            window.location.href = "/Account/Login";
        });
    }
});
