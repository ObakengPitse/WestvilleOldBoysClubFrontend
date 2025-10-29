document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent full page reload

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        messageBox.textContent = "Logging in...";
        messageBox.style.color = "gray";

        try {
            const response = await fetch("https://wob-soccer-website.onrender.com/auth/api/v1/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailAddress: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error("Invalid response from server.");
            }

            const data = await response.json();

            // Assuming API returns { token: "..." }
            if (data.userId) {
                // Save token in localStorage or sessionStorage
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("fullName", data.fullName);
                localStorage.setItem("role", data.role || "User");

                messageBox.textContent = "Login successful! Redirecting...";
                messageBox.style.color = "green";

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = "/Home/Index";
                }, 1500);
            } else {
                messageBox.textContent = "Login failed. Please check your credentials.";
                messageBox.style.color = "red";
            }
        } catch (err) {
            console.error("Error:", err);
            messageBox.textContent = "Login failed. Server unavailable or invalid credentials.";
            messageBox.style.color = "red";
        }
    });
});

