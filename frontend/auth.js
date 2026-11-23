
(function () {
    const API_URL = "http://localhost:3000";

    // SIGNUP
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_URL}/api/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Signup failed.");
                    return;
                }

                alert("Account created successfully! Please login.");
                window.location.href = "login.html";

            } catch (error) {
                alert("Unable to connect to the server.");
                console.error(error);
            }
        });
    }

    // LOGIN
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Login failed.");
                    return;
                }

                localStorage.setItem("fittrackToken", data.token);
                localStorage.setItem("fittrackUser", JSON.stringify(data.user));

                alert("Login successful!");
                window.location.href = "index.html";

            } catch (error) {
                alert("Unable to connect to the server.");
                console.error(error);
            }
        });
    }

    // Dashboard is now publicly accessible.
    // Login and signup pages are still available separately.

})();
