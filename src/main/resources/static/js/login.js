const loginForm = document.getElementById("loginForm");

const errorMessage = document.getElementById("errorMessage");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });


        const data = await response.json();


        if (!response.ok) {

            errorMessage.textContent =
                data.message || "Login failed";

            return;
        }


        // Save JWT token
        localStorage.setItem("token", data.token);


        // Save user role
        localStorage.setItem("role", data.role);


        // Go to dashboard
        window.location.href = "/dashboard";

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Something went wrong. Please try again.";
    }

});