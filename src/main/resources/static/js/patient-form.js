const patientForm = document.getElementById("patientForm");
const message = document.getElementById("message");


// Check whether we are editing a patient
const urlParts = window.location.pathname.split("/");
const editId = urlParts[urlParts.length - 1];

const isEditMode =
    window.location.pathname.startsWith("/patients/edit/") &&
    !isNaN(editId);


// Change page text when editing
if (isEditMode) {

    document.querySelector("h1").textContent = "Edit Patient";

    const submitButton =
        patientForm.querySelector("button[type='submit']");

    submitButton.textContent = "Update Patient";

    loadPatient(editId);
}


// Load existing patient data
async function loadPatient(id) {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch("/api/patients/" + id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load patient");
        }

        const patient = await response.json();

        document.getElementById("name").value = patient.name;
        document.getElementById("age").value = patient.age;
        document.getElementById("gender").value = patient.gender;
        document.getElementById("phone").value = patient.phone;
        document.getElementById("address").value = patient.address || "";

    } catch (error) {

        console.error("Error:", error);

        message.textContent =
            "Failed to load patient.";
    }
}


// Submit form
patientForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const token = localStorage.getItem("token");

    const patientData = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value
    };


    // Decide POST or PUT
    const url = isEditMode
        ? "/api/patients/" + editId
        : "/api/patients";

    const method = isEditMode
        ? "PUT"
        : "POST";


    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(patientData)
        });


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                data.message ||
                "Failed to save patient";

            return;
        }


        if (isEditMode) {

            message.textContent =
                "Patient updated successfully!";

        } else {

            message.textContent =
                "Patient added successfully!";
        }


        patientForm.reset();


        setTimeout(() => {

            window.location.href = "/patients";

        }, 1000);


    } catch (error) {

        console.error("Error:", error);

        message.textContent =
            "Something went wrong. Please try again.";
    }

});