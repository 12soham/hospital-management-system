let allPatients = [];
let filteredPatients = [];
let currentPage = 0;

const recordsPerPage = 5;


document.addEventListener("DOMContentLoaded", function () {

    loadUserInfo();

    loadPatients();


    const searchInput =
        document.getElementById("patientSearchInput");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            currentPage = 0;

            applySearch();
        });
    }


    const prevBtn =
        document.getElementById("patientPrevBtn");

    if (prevBtn) {

        prevBtn.addEventListener("click", function () {

            if (currentPage > 0) {

                currentPage--;

                renderCurrentPage();
            }
        });
    }


    const nextBtn =
        document.getElementById("patientNextBtn");

    if (nextBtn) {

        nextBtn.addEventListener("click", function () {

            const totalPages =
                Math.ceil(filteredPatients.length / recordsPerPage);

            if (currentPage < totalPages - 1) {

                currentPage++;

                renderCurrentPage();
            }
        });
    }


    const addPatientForm =
        document.getElementById("addPatientForm");

    if (addPatientForm) {

        addPatientForm.addEventListener("submit", function (event) {

            event.preventDefault();

            saveNewPatient();
        });
    }


    const editPatientForm =
        document.getElementById("editPatientForm");

    if (editPatientForm) {

        editPatientForm.addEventListener("submit", function (event) {

            event.preventDefault();

            saveEditedPatient();
        });
    }
});


// =====================================================
// LOAD PATIENTS
// (backend returns a plain list — no server-side search
// or pagination — so both are done client-side below)
// =====================================================

async function loadPatients() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch("/api/patients", {

            method: "GET",

            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });


        if (response.status === 401) {

            alert("Please login again.");

            window.location.href = "/login";

            return;
        }


        if (!response.ok) {

            throw new Error("Failed to load patients");
        }


        allPatients = await response.json();

        filteredPatients = allPatients;


        renderCurrentPage();


    } catch (error) {

        console.error("Patient error:", error);


        const tableBody =
            document.getElementById("patientTableBody");

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;padding:24px;">
                        Failed to load patients
                    </td>
                </tr>
            `;
        }
    }
}


// =====================================================
// SEARCH (client-side — matches name or phone)
// =====================================================

function applySearch() {

    const searchInput =
        document.getElementById("patientSearchInput");

    const query =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    if (!query) {

        filteredPatients = allPatients;

    } else {

        filteredPatients = allPatients.filter(function (patient) {

            const name = (patient.name || "").toLowerCase();

            const phone = (patient.phone || "").toLowerCase();

            return (
                name.includes(query) ||
                phone.includes(query)
            );
        });
    }


    renderCurrentPage();
}


// =====================================================
// PAGINATION (client-side)
// =====================================================

function renderCurrentPage() {

    const totalRecords = filteredPatients.length;

    const totalPages =
        Math.max(Math.ceil(totalRecords / recordsPerPage), 1);


    if (currentPage > totalPages - 1) {
        currentPage = totalPages - 1;
    }

    if (currentPage < 0) {
        currentPage = 0;
    }


    const start = currentPage * recordsPerPage;

    const end = start + recordsPerPage;

    const pageItems = filteredPatients.slice(start, end);


    displayPatients(pageItems);

    updatePagination(totalRecords, totalPages);
}


function updatePagination(totalRecords, totalPages) {

    const paginationInfo =
        document.getElementById("patientPaginationInfo");

    const prevBtn =
        document.getElementById("patientPrevBtn");

    const nextBtn =
        document.getElementById("patientNextBtn");


    if (totalRecords === 0) {

        if (paginationInfo) {
            paginationInfo.textContent = "Showing 0 patients";
        }

        if (prevBtn) prevBtn.disabled = true;

        if (nextBtn) nextBtn.disabled = true;

        return;
    }


    const start = currentPage * recordsPerPage + 1;

    const end = Math.min(start + recordsPerPage - 1, totalRecords);


    if (paginationInfo) {

        paginationInfo.textContent =
            "Showing " + start + "-" + end +
            " of " + totalRecords + " patients";
    }


    if (prevBtn) prevBtn.disabled = currentPage === 0;

    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}


// =====================================================
// DISPLAY PATIENTS
// =====================================================

function displayPatients(patients) {

    const tableBody =
        document.getElementById("patientTableBody");

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (!patients || patients.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:24px;">
                    No patients found
                </td>
            </tr>
        `;

        return;
    }


    patients.forEach(function (patient) {

        const row = document.createElement("tr");

        const ageGender =
            (patient.age != null ? patient.age + " yrs" : "—") +
            (patient.gender ? " / " + patient.gender : "");

        row.innerHTML = `

            <td><strong>${patient.name || ""}</strong></td>

            <td>${ageGender}</td>

            <td>${patient.phone || ""}</td>

            <td>${patient.address || "—"}</td>

            <td>
                <div class="action-buttons">

                    <button
                        class="icon-btn view-icon"
                        title="View"
                        onclick="viewPatient(${patient.id})"
                    >
                        ⊙
                    </button>

                    <button
                        class="icon-btn edit-icon"
                        title="Edit"
                        onclick="editPatient(${patient.id})"
                    >
                        ✎
                    </button>

                    <button
                        class="icon-btn delete-icon"
                        title="Delete"
                        onclick="deletePatient(${patient.id})"
                    >
                        ✕
                    </button>

                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// =====================================================
// ADD PATIENT MODAL
// =====================================================

function openAddPatientModal() {

    const modal =
        document.getElementById("addPatientModal");

    const form =
        document.getElementById("addPatientForm");

    if (form) {
        form.reset();
    }

    if (modal) {
        modal.classList.add("active");
    }
}


function closeAddPatientModal() {

    const modal =
        document.getElementById("addPatientModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


async function saveNewPatient() {

    const token = localStorage.getItem("token");

    const name =
        document.getElementById("newPatientName").value.trim();

    const phone =
        document.getElementById("newPatientPhone").value.trim();

    const age =
        document.getElementById("newPatientAge").value;

    const gender =
        document.getElementById("newPatientGender").value;

    const email =
        document.getElementById("newPatientEmail").value.trim();

    const address =
        document.getElementById("newPatientAddress").value.trim();


    if (!name || !phone || !age || !gender || !address) {

        alert("Please fill all required fields.");

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Phone number must contain exactly 10 digits.");

        return;
    }


    const patientData = {

        name: name,
        age: Number(age),
        gender: gender,
        phone: phone,
        address: address,

        // optional — sent as null instead of an empty string
        // when left blank
        email: email ? email : null
    };


    try {

        const response = await fetch("/api/patients", {

            method: "POST",

            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(patientData)
        });


        if (response.status === 403) {

            alert("You do not have permission to add patients.");

            return;
        }


        if (!response.ok) {

            const errorText = await response.text();

            console.error("Add patient error:", errorText);

            throw new Error("Failed to add patient");
        }


        alert("Patient added successfully!");

        closeAddPatientModal();

        loadPatients();


    } catch (error) {

        console.error("Save patient error:", error);

        alert("Failed to add patient.");
    }
}


// =====================================================
// VIEW PATIENT (read-only modal, no API call needed —
// reuses the already-loaded list)
// =====================================================

function viewPatient(id) {

    const patient =
        allPatients.find(function (p) { return p.id === id; });

    if (!patient) {
        return;
    }


    const body =
        document.getElementById("viewPatientBody");

    if (body) {

        body.innerHTML = `
            <p><strong>Name:</strong> ${patient.name || "—"}</p>
            <p><strong>Age:</strong> ${patient.age != null ? patient.age : "—"}</p>
            <p><strong>Gender:</strong> ${patient.gender || "—"}</p>
            <p><strong>Phone:</strong> ${patient.phone || "—"}</p>
            <p><strong>Email:</strong> ${patient.email || "—"}</p>
            <p><strong>Address:</strong> ${patient.address || "—"}</p>
        `;
    }


    const modal =
        document.getElementById("viewPatientModal");

    if (modal) {
        modal.classList.add("active");
    }
}


function closeViewPatientModal() {

    const modal =
        document.getElementById("viewPatientModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// =====================================================
// EDIT / DELETE
// =====================================================

// =====================================================
// EDIT PATIENT (modal — pre-filled from already-loaded
// data, no extra GET call needed)
// =====================================================

function editPatient(id) {

    const patient =
        allPatients.find(function (p) { return p.id === id; });

    if (!patient) {
        return;
    }

    document.getElementById("editPatientId").value = patient.id;

    document.getElementById("editPatientName").value = patient.name || "";

    document.getElementById("editPatientPhone").value = patient.phone || "";

    document.getElementById("editPatientAge").value =
        patient.age != null ? patient.age : "";

    document.getElementById("editPatientGender").value = patient.gender || "";

    document.getElementById("editPatientEmail").value = patient.email || "";

    document.getElementById("editPatientAddress").value = patient.address || "";


    const modal =
        document.getElementById("editPatientModal");

    if (modal) {
        modal.classList.add("active");
    }
}


function closeEditPatientModal() {

    const modal =
        document.getElementById("editPatientModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


async function saveEditedPatient() {

    const token = localStorage.getItem("token");

    const id =
        document.getElementById("editPatientId").value;

    const name =
        document.getElementById("editPatientName").value.trim();

    const phone =
        document.getElementById("editPatientPhone").value.trim();

    const age =
        document.getElementById("editPatientAge").value;

    const gender =
        document.getElementById("editPatientGender").value;

    const email =
        document.getElementById("editPatientEmail").value.trim();

    const address =
        document.getElementById("editPatientAddress").value.trim();


    if (!name || !phone || !age || !gender || !address) {

        alert("Please fill all required fields.");

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Phone number must contain exactly 10 digits.");

        return;
    }


    const patientData = {

        name: name,
        age: Number(age),
        gender: gender,
        phone: phone,
        address: address,
        email: email ? email : null
    };


    try {

        const response = await fetch("/api/patients/" + id, {

            method: "PUT",

            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(patientData)
        });


        if (response.status === 403) {

            alert("You do not have permission to edit patients.");

            return;
        }


        if (!response.ok) {

            const errorText = await response.text();

            console.error("Edit patient error:", errorText);

            throw new Error("Failed to update patient");
        }


        alert("Patient updated successfully!");

        closeEditPatientModal();

        loadPatients();


    } catch (error) {

        console.error("Save edited patient error:", error);

        alert("Failed to update patient.");
    }
}


async function deletePatient(id) {

    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this patient?")) {
        return;
    }

    try {

        const response = await fetch("/api/patients/" + id, {

            method: "DELETE",

            headers: {
                "Authorization": "Bearer " + token
            }
        });


        if (!response.ok) {

            throw new Error("Failed to delete patient");
        }


        alert("Patient deleted successfully!");

        loadPatients();


    } catch (error) {

        console.error("Delete error:", error);

        alert("Failed to delete patient.");
    }
}


// =====================================================
// SIDEBAR USER INFO (decoded from the JWT — same
// technique appointments.js already uses for role)
// =====================================================

function loadUserInfo() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const payload = token.split(".")[1];

        const base64 =
            payload
                .replace(/-/g, "+")
                .replace(/_/g, "/");

        const decoded = JSON.parse(atob(base64));

        const role = decoded.role || "";

        // NOTE: assumes a "name" claim on the token, falling
        // back to "sub" (commonly the login email/username).
        // If this shows the wrong thing, tell me the real
        // claim name in your token payload.
        const name = decoded.name || decoded.sub || "User";


        const nameEl =
            document.getElementById("sidebarUserName");

        const roleEl =
            document.getElementById("sidebarUserRole");

        const avatarEl =
            document.getElementById("sidebarAvatar");


        if (nameEl) nameEl.textContent = name;

        if (roleEl) roleEl.textContent = role;

        if (avatarEl) {

            const initials =
                name
                    .split(" ")
                    .map(function (part) { return part[0]; })
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

            avatarEl.textContent = initials || "U";
        }


    } catch (error) {

        console.error("Unable to read user info:", error);
    }
}


// =====================================================
// LOGOUT
// =====================================================

function handleLogout() {

    localStorage.removeItem("token");

    window.location.href = "/login";
}