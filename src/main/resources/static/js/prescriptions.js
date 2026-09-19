let allPrescriptions = [];
let filteredPrescriptions = [];
let currentPage = 0;

const recordsPerPage = 5;


document.addEventListener("DOMContentLoaded", () => {

    applyRoleVisibility();

    loadUserInfo();

    loadPrescriptions();

    loadAppointmentOptions();

    document
        .getElementById("addPrescriptionBtn")
        .addEventListener("click", openAddModal);

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("cancelModalBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("prescriptionForm")
        .addEventListener("submit", savePrescription);


    const searchInput =
        document.getElementById("prescriptionSearchInput");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            currentPage = 0;

            applySearch();
        });
    }


    const prevBtn =
        document.getElementById("prescriptionPrevBtn");

    if (prevBtn) {

        prevBtn.addEventListener("click", function () {

            if (currentPage > 0) {

                currentPage--;

                renderCurrentPage();
            }
        });
    }


    const nextBtn =
        document.getElementById("prescriptionNextBtn");

    if (nextBtn) {

        nextBtn.addEventListener("click", function () {

            const totalPages =
                Math.ceil(filteredPrescriptions.length / recordsPerPage);

            if (currentPage < totalPages - 1) {

                currentPage++;

                renderCurrentPage();
            }
        });
    }
});


// =====================================================
// GET USER ROLE / ROLE-BASED VISIBILITY
// (same pattern as doctors.js / billing.js)
// =====================================================

function getUserRole() {

    const token = localStorage.getItem("token");

    if (!token) {
        return "";
    }

    try {

        const payload = token.split(".")[1];

        const base64 =
            payload.replace(/-/g, "+").replace(/_/g, "/");

        return JSON.parse(atob(base64)).role || "";

    } catch (error) {

        console.error("Unable to read user role:", error);

        return "";
    }
}


function applyRoleVisibility() {

    const role = getUserRole();

    document.querySelectorAll("[data-hide-for]").forEach((el) => {

        const hiddenRoles = el.getAttribute("data-hide-for").split(",");

        if (hiddenRoles.includes(role)) {
            el.style.display = "none";
        }
    });
}


// =====================================================
// MODAL OPEN / CLOSE
// =====================================================

function openAddModal() {

    document.getElementById("prescriptionForm").reset();

    document.getElementById("prescriptionId").value = "";

    document.getElementById("prescriptionModalTitle").textContent =
        "New Prescription";

    const appointmentSelect =
        document.getElementById("appointmentId");

    if (appointmentSelect) {
        appointmentSelect.disabled = false;
    }

    document.getElementById("prescriptionModal").classList.add("active");
}


function closeModal() {

    document.getElementById("prescriptionModal").classList.remove("active");

    document.getElementById("prescriptionForm").reset();

    document.getElementById("prescriptionId").value = "";
}


// =====================================================
// LOAD APPOINTMENT OPTIONS FOR THE DROPDOWN
// (fetches a large page — /api/appointments has no
// "give me everything" mode, so size=1000 approximates it,
// same technique used in dashboard.js)
// =====================================================

async function loadAppointmentOptions() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/appointments?page=0&size=1000",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load appointments");
        }

        const pageData = await response.json();

        const appointments = pageData.content || [];

        const select = document.getElementById("appointmentId");

        if (!select) {
            return;
        }

        select.innerHTML = `<option value="">Select Appointment</option>`;

        appointments.forEach((appointment) => {

            const option = document.createElement("option");

            option.value = appointment.id;

            option.textContent =
                appointment.patientName + " — " +
                appointment.doctorName + " — " +
                appointment.appointmentDate;

            select.appendChild(option);
        });

    } catch (error) {

        console.error("Load appointment options error:", error);
    }
}


// =====================================================
// LOAD PRESCRIPTIONS
// (backend returns a plain list — client-side search +
// pagination below, same pattern as patients.js/doctors.js)
// =====================================================

async function loadPrescriptions() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("/api/prescriptions", {

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        if (response.status === 401) {
            alert("Please login again.");
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load prescriptions");
        }

        allPrescriptions = await response.json();

        filteredPrescriptions = allPrescriptions;

        renderCurrentPage();

    } catch (error) {

        console.error("Load Prescription Error:", error);

        const tableBody =
            document.getElementById("prescriptionTableBody");

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:24px;">
                        Failed to load prescriptions
                    </td>
                </tr>
            `;
        }
    }
}


// =====================================================
// SEARCH (client-side — matches patient, doctor, diagnosis)
// =====================================================

function applySearch() {

    const searchInput =
        document.getElementById("prescriptionSearchInput");

    const query =
        searchInput ? searchInput.value.trim().toLowerCase() : "";

    if (!query) {

        filteredPrescriptions = allPrescriptions;

    } else {

        filteredPrescriptions = allPrescriptions.filter((p) => {

            const patient = (p.patientName || "").toLowerCase();
            const doctor = (p.doctorName || "").toLowerCase();
            const diagnosis = (p.diagnosis || "").toLowerCase();

            return (
                patient.includes(query) ||
                doctor.includes(query) ||
                diagnosis.includes(query)
            );
        });
    }

    renderCurrentPage();
}


// =====================================================
// PAGINATION (client-side)
// =====================================================

function renderCurrentPage() {

    const totalRecords = filteredPrescriptions.length;

    const totalPages =
        Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

    if (currentPage > totalPages - 1) currentPage = totalPages - 1;
    if (currentPage < 0) currentPage = 0;

    const start = currentPage * recordsPerPage;
    const end = start + recordsPerPage;
    const pageItems = filteredPrescriptions.slice(start, end);

    displayPrescriptions(pageItems);
    updatePagination(totalRecords, totalPages);
}


function updatePagination(totalRecords, totalPages) {

    const paginationInfo =
        document.getElementById("prescriptionPaginationInfo");

    const prevBtn = document.getElementById("prescriptionPrevBtn");
    const nextBtn = document.getElementById("prescriptionNextBtn");

    if (totalRecords === 0) {
        if (paginationInfo) paginationInfo.textContent = "Showing 0 prescriptions";
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
    }

    const start = currentPage * recordsPerPage + 1;
    const end = Math.min(start + recordsPerPage - 1, totalRecords);

    if (paginationInfo) {
        paginationInfo.textContent =
            "Showing " + start + "-" + end + " of " + totalRecords + " prescriptions";
    }

    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}


// =====================================================
// DISPLAY PRESCRIPTIONS
// =====================================================

function displayPrescriptions(prescriptions) {

    const tableBody =
        document.getElementById("prescriptionTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!prescriptions || prescriptions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:24px;">
                    No prescriptions found
                </td>
            </tr>
        `;

        return;
    }

    prescriptions.forEach((p) => {

        const patientSub =
            (p.patientAge != null ? p.patientAge + " yrs" : "") +
            (p.patientGender ? ", " + p.patientGender : "");

        const notesText = p.notes || "—";

        const canEdit = getUserRole() !== "RECEPTIONIST";

        const actionsCell = `
            <div class="action-buttons">

                <button
                    class="btn btn-primary btn-sm"
                    onclick="printPrescription(${p.id})">
                    Print Rx
                </button>

                ${
                    canEdit
                    ? `
                        <button
                            class="icon-btn edit-icon"
                            title="Edit"
                            onclick="editPrescription(${p.id})">
                            ✎
                        </button>

                        <button
                            class="icon-btn delete-icon"
                            title="Delete"
                            onclick="deletePrescription(${p.id})">
                            ✕
                        </button>
                      `
                    : ""
                }

            </div>
        `;

        tableBody.innerHTML += `
            <tr>

                <td>${formatDate(p.prescriptionDate)}</td>

                <td>
                    <strong>${p.patientName || ""}</strong>
                    <span class="cell-subtext">${patientSub}</span>
                </td>

                <td>
                    <strong>${p.doctorName || ""}</strong>
                    <span class="cell-subtext">${p.doctorSpecialization || ""}</span>
                </td>

                <td>
                    <span class="diagnosis-text">${p.diagnosis || ""}</span>
                </td>

                <td>${notesText}</td>

                <td>${actionsCell}</td>

            </tr>
        `;
    });
}


// =====================================================
// ADD / EDIT SAVE
// =====================================================

async function savePrescription(event) {

    event.preventDefault();

    const id =
        document.getElementById("prescriptionId").value;

    const appointmentId =
        Number(document.getElementById("appointmentId").value);

    if (!Number.isInteger(appointmentId) || appointmentId < 1) {
        alert("Please select an appointment.");
        return;
    }

    const diagnosis =
        document.getElementById("diagnosis").value.trim();

    const medicines =
        document.getElementById("medicines").value.trim();

    const notes =
        document.getElementById("notes").value.trim();

    if (!diagnosis) {
        alert("Please enter Clinical Diagnosis");
        return;
    }

    if (!medicines) {
        alert("Please enter Medicines");
        return;
    }

    const prescription = {
        appointmentId: appointmentId,
        diagnosis: diagnosis,
        medicines: medicines,
        notes: notes
    };

    try {

        const token = localStorage.getItem("token");

        let url = "/api/prescriptions";
        let method = "POST";

        if (id) {
            url = `/api/prescriptions/${id}`;
            method = "PUT";
        }

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(prescription)
        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Backend Error:", errorText);

            throw new Error(errorText || "Failed to save prescription");
        }

        closeModal();

        await loadPrescriptions();

        alert("Prescription Saved Successfully");

    } catch (error) {

        console.error("Save Prescription Error:", error);

        alert("Error Saving Prescription: " + error.message);
    }
}


// =====================================================
// EDIT
// =====================================================

async function editPrescription(id) {

    try {

        const token = localStorage.getItem("token");

        const response =
            await fetch(`/api/prescriptions/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        if (!response.ok) {
            throw new Error("Failed to load prescription");
        }

        const p = await response.json();

        document.getElementById("prescriptionId").value = p.id;

        const appointmentSelect =
            document.getElementById("appointmentId");

        // The backend's updatePrescription() only changes diagnosis /
        // medicines / notes — it never reassigns the appointment — so
        // the dropdown is shown but locked while editing.
        appointmentSelect.value = p.appointmentId;
        appointmentSelect.disabled = true;

        document.getElementById("diagnosis").value = p.diagnosis;

        document.getElementById("medicines").value = p.medicines;

        document.getElementById("notes").value = p.notes || "";

        document.getElementById("prescriptionModalTitle").textContent =
            "Edit Prescription";

        document.getElementById("prescriptionModal").classList.add("active");

    } catch (error) {

        console.error("Edit Prescription Error:", error);

        alert("Error Loading Prescription");
    }
}


// =====================================================
// DELETE
// =====================================================

async function deletePrescription(id) {

    if (!confirm("Delete this prescription?")) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response =
            await fetch(`/api/prescriptions/${id}`, {

                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Delete Error:", errorText);

            throw new Error(errorText || "Delete Failed");
        }

        await loadPrescriptions();

        alert("Prescription Deleted Successfully");

    } catch (error) {

        console.error("Delete Prescription Error:", error);

        alert("Error Deleting Prescription");
    }
}


// =====================================================
// PRINT RX (uses the already-loaded record — same
// window.open + print technique as billing.js's invoice)
// =====================================================

function printPrescription(id) {

    const p = allPrescriptions.find((item) => item.id === id);

    if (!p) {
        return;
    }

    const printWindow =
        window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Prescription</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #111827;
                }
                .rx {
                    max-width: 800px;
                    margin: auto;
                }
                .rx-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 25px;
                }
                .rx-details {
                    display: flex;
                    justify-content: space-between;
                    margin: 25px 0;
                }
                .rx-section {
                    margin-top: 25px;
                }
                .rx-section h4 {
                    margin-bottom: 8px;
                }
                .rx-section p {
                    white-space: pre-wrap;
                }
                hr {
                    border: none;
                    border-top: 1px solid #ddd;
                }
                .rx-footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 13px;
                }
            </style>
        </head>
        <body>
            <div class="rx">

                <div class="rx-header">
                    <div>
                        <h2>Hospital Management</h2>
                        <p>Medical Prescription</p>
                    </div>
                    <div>
                        <strong>Date: ${p.prescriptionDate}</strong>
                    </div>
                </div>

                <hr>

                <div class="rx-details">
                    <div>
                        <strong>Patient</strong>
                        <p>${p.patientName || ""}</p>
                        <p>${p.patientAge != null ? p.patientAge + " yrs" : ""}${p.patientGender ? ", " + p.patientGender : ""}</p>
                    </div>
                    <div>
                        <strong>Doctor</strong>
                        <p>${p.doctorName || ""}</p>
                        <p>${p.doctorSpecialization || ""}</p>
                    </div>
                </div>

                <div class="rx-section">
                    <h4>Clinical Diagnosis</h4>
                    <p>${p.diagnosis || ""}</p>
                </div>

                <div class="rx-section">
                    <h4>Medicines</h4>
                    <p>${p.medicines || ""}</p>
                </div>

                <div class="rx-section">
                    <h4>Doctor Notes</h4>
                    <p>${p.notes || "—"}</p>
                </div>

                <div class="rx-footer">
                    <p>Generated by Hospital Management System</p>
                </div>

            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// =====================================================
// SIDEBAR USER INFO (same technique as the other pages)
// =====================================================

function loadUserInfo() {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

        const payload = token.split(".")[1];

        const base64 =
            payload.replace(/-/g, "+").replace(/_/g, "/");

        const decoded = JSON.parse(atob(base64));

        const role = decoded.role || "";

        const name = decoded.name || decoded.sub || "User";

        const nameEl = document.getElementById("sidebarUserName");
        const roleEl = document.getElementById("sidebarUserRole");
        const avatarEl = document.getElementById("sidebarAvatar");

        if (nameEl) nameEl.textContent = name;
        if (roleEl) roleEl.textContent = role;

        if (avatarEl) {

            const initials =
                name
                    .split(" ")
                    .map((part) => part[0])
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