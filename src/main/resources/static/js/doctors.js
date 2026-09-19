let allDoctors = [];
let filteredDoctors = [];
let currentPage = 0;

const recordsPerPage = 5;


document.addEventListener("DOMContentLoaded", function () {

    applyRoleVisibility();

    loadUserInfo();

    loadDoctors();

    // Search
    const searchInput = document.getElementById("doctorSearch");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            currentPage = 0;
            filterDoctors();
        });
    }

    // Specialization filter
    const specializationFilter =
        document.getElementById("doctorSpecFilter");

    if (specializationFilter) {
        specializationFilter.addEventListener("change", function () {
            currentPage = 0;
            filterDoctors();
        });
    }

    // Doctor form submit
    const doctorForm = document.getElementById("doctorForm");

    if (doctorForm) {
        doctorForm.addEventListener("submit", function (event) {
            event.preventDefault();
            saveDoctor();
        });
    }

    // Close modal buttons
    document.querySelectorAll("[data-modal-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            closeDoctorModal();
        });
    });

    // Pagination
    const prevBtn = document.getElementById("doctorPrevBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            if (currentPage > 0) {
                currentPage--;
                renderCurrentPage();
            }
        });
    }

    const nextBtn = document.getElementById("doctorNextBtn");

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            const totalPages =
                Math.ceil(filteredDoctors.length / recordsPerPage);
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderCurrentPage();
            }
        });
    }
});


// ==========================================
// GET USER ROLE (same technique as appointments.js)
// ==========================================

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


// ==========================================
// ROLE-BASED VISIBILITY
// (same client-side pattern as dashboard.js —
// hides elements tagged data-hide-for="ROLE,ROLE")
// ==========================================

function applyRoleVisibility() {

    const role = getUserRole();

    document.querySelectorAll("[data-hide-for]").forEach(function (el) {

        const hiddenRoles = el.getAttribute("data-hide-for").split(",");

        if (hiddenRoles.includes(role)) {
            el.style.display = "none";
        }
    });
}


// ==========================================
// LOAD ALL DOCTORS
// ==========================================

async function loadDoctors() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch("/api/doctors", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {

            if (response.status === 401) {
                alert("Please login again.");
                window.location.href = "/login";
                return;
            }

            if (response.status === 403) {
                alert("You do not have permission to view doctors.");
                return;
            }

            throw new Error("Failed to load doctors");
        }

        allDoctors = await response.json();
        filteredDoctors = allDoctors;

        populateSpecializations();

        renderCurrentPage();

    } catch (error) {

        console.error("Doctor error:", error);

        const tableBody = document.getElementById("doctorTableBody");

        if (tableBody) {
            const columnCount = getUserRole() !== "DOCTOR" ? 6 : 5;
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${columnCount}" style="text-align:center;padding:24px;">
                        Failed to load doctors
                    </td>
                </tr>
            `;
        }
    }
}


// ==========================================
// PAGINATION (client-side — same pattern as
// patients.js, since /api/doctors returns a
// plain list with no server-side paging)
// ==========================================

function renderCurrentPage() {

    const totalRecords = filteredDoctors.length;

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
    const pageItems = filteredDoctors.slice(start, end);

    displayDoctors(pageItems);
    updatePagination(totalRecords, totalPages);
}


function updatePagination(totalRecords, totalPages) {

    const paginationInfo = document.getElementById("doctorPaginationInfo");
    const prevBtn = document.getElementById("doctorPrevBtn");
    const nextBtn = document.getElementById("doctorNextBtn");

    if (totalRecords === 0) {
        if (paginationInfo) paginationInfo.textContent = "Showing 0 doctors";
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
    }

    const start = currentPage * recordsPerPage + 1;
    const end = Math.min(start + recordsPerPage - 1, totalRecords);

    if (paginationInfo) {
        paginationInfo.textContent =
            "Showing " + start + "-" + end + " of " + totalRecords + " doctors";
    }

    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}


// ==========================================
// DISPLAY DOCTORS
// ==========================================

function displayDoctors(doctors) {

    const tableBody =
        document.getElementById("doctorTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    const canSeeFee = getUserRole() !== "DOCTOR";

    const columnCount = canSeeFee ? 6 : 5;

    if (doctors.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="${columnCount}"
                    style="text-align:center; padding:24px;">
                    No doctors found
                </td>
            </tr>
        `;

        return;
    }

    doctors.forEach(function (doctor) {

        const row = document.createElement("tr");

        const fee =
            doctor.consultationFee != null
                ? "₹" + Number(doctor.consultationFee).toFixed(2)
                : "—";

        const experience =
            doctor.experienceYears != null
                ? doctor.experienceYears + " Years"
                : "—";

        const canManageDoctors = getUserRole() === "ADMIN";

        const actionsCell =
            canManageDoctors
                ? `
                    <div class="action-buttons">

                        <button
                            class="icon-btn edit-icon"
                            title="Edit"
                            onclick="editDoctor(${doctor.id})"
                        >
                            ✎
                        </button>

                        <button
                            class="icon-btn delete-icon"
                            title="Delete"
                            onclick="deleteDoctor(${doctor.id})"
                        >
                            ✕
                        </button>

                    </div>
                `
                : `<span class="cell-subtext">View Only</span>`;

        row.innerHTML = `
            <td>
                <strong>${doctor.name || ""}</strong>
                <span class="cell-subtext">${doctor.department || ""}</span>
            </td>

            <td>
                <span class="spec-badge">${doctor.specialization || ""}</span>
            </td>

            <td>${experience}</td>

            <td>
                ${doctor.phone || ""}
                <span class="cell-subtext">${doctor.email || ""}</span>
            </td>

            ${canSeeFee ? `<td><strong>${fee}</strong></td>` : ""}

            <td>${actionsCell}</td>
        `;

        tableBody.appendChild(row);
    });
}


// ==========================================
// SPECIALIZATION FILTER
// ==========================================

function populateSpecializations() {

    const filter =
        document.getElementById("doctorSpecFilter");

    if (!filter) {
        return;
    }

    filter.innerHTML = `
        <option value="">All Specializations</option>
    `;

    const specializations = [
        ...new Set(
            allDoctors.map(function (doctor) {
                return doctor.specialization;
            })
        )
    ];

    specializations.sort();

    specializations.forEach(function (specialization) {

        const option = document.createElement("option");

        option.value = specialization;
        option.textContent = specialization;

        filter.appendChild(option);
    });
}


// ==========================================
// SEARCH + FILTER
// ==========================================

function filterDoctors() {

    const searchInput =
        document.getElementById("doctorSearch");

    const specializationFilter =
        document.getElementById("doctorSpecFilter");

    const searchText =
        searchInput ? searchInput.value.toLowerCase() : "";

    const selectedSpecialization =
        specializationFilter
            ? specializationFilter.value
            : "";

    filteredDoctors = allDoctors.filter(function (doctor) {

        const matchesSearch =
            (doctor.name || "").toLowerCase().includes(searchText) ||
            (doctor.department || "").toLowerCase().includes(searchText) ||
            (doctor.specialization || "").toLowerCase().includes(searchText);

        const matchesSpecialization =
            selectedSpecialization === "" ||
            doctor.specialization === selectedSpecialization;

        return matchesSearch && matchesSpecialization;
    });

    renderCurrentPage();
}


// ==========================================
// OPEN ADD DOCTOR MODAL
// ==========================================

function openAddDoctorModal() {

    const modal =
        document.getElementById("doctorModal");

    const form =
        document.getElementById("doctorForm");

    const title =
        document.getElementById("doctorModalTitle");

    const doctorId =
        document.getElementById("doctorId");

    if (!modal || !form) {
        return;
    }

    form.reset();

    if (doctorId) {
        doctorId.value = "";
    }

    if (title) {
        title.textContent = "Add New Doctor";
    }

    modal.classList.add("active");
}


// ==========================================
// CLOSE DOCTOR MODAL
// ==========================================

function closeDoctorModal() {

    const modal =
        document.getElementById("doctorModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// ==========================================
// EDIT DOCTOR
// ==========================================

async function editDoctor(id) {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/doctors/" + id,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {

            if (response.status === 403) {
                alert("You do not have permission to edit doctors.");
                return;
            }

            throw new Error("Failed to get doctor");
        }

        const doctor = await response.json();

        document.getElementById("doctorId").value =
            doctor.id;

        document.getElementById("docName").value =
            doctor.name;

        document.getElementById("docSpecialization").value =
            doctor.specialization;

        document.getElementById("docDepartment").value =
            doctor.department || "";

        document.getElementById("docExperience").value =
            doctor.experienceYears != null ? doctor.experienceYears : "";

        document.getElementById("docPhone").value =
            doctor.phone;

        document.getElementById("docEmail").value =
            doctor.email;

        document.getElementById("docFee").value =
            doctor.consultationFee != null ? doctor.consultationFee : "";

        document.getElementById("doctorModalTitle").textContent =
            "Edit Doctor";

        document.getElementById("doctorModal")
            .classList.add("active");

    } catch (error) {

        console.error("Edit doctor error:", error);

        alert("Failed to load doctor information.");
    }
}


// ==========================================
// ADD / UPDATE DOCTOR
// ==========================================

async function saveDoctor() {

    const token = localStorage.getItem("token");

    const doctorId =
        document.getElementById("doctorId").value;

    const doctorData = {

        name:
            document.getElementById("docName").value.trim(),

        specialization:
            document.getElementById("docSpecialization").value.trim(),

        department:
            document.getElementById("docDepartment").value.trim(),

        experienceYears:
            Number(document.getElementById("docExperience").value),

        phone:
            document.getElementById("docPhone").value.trim(),

        email:
            document.getElementById("docEmail").value.trim(),

        consultationFee:
            Number(document.getElementById("docFee").value)
    };

    const isEdit = doctorId !== "";

    const url = isEdit
        ? "/api/doctors/" + doctorId
        : "/api/doctors";

    const method = isEdit
        ? "PUT"
        : "POST";

    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(doctorData)
        });

        if (!response.ok) {

            if (response.status === 403) {
                alert("Only Admin can add or edit doctors.");
                return;
            }

            const errorText = await response.text();

            console.error("Server error:", errorText);

            throw new Error("Failed to save doctor");
        }

        if (isEdit) {
            alert("Doctor updated successfully!");
        } else {
            alert("Doctor added successfully!");
        }

        closeDoctorModal();

        loadDoctors();

    } catch (error) {

        console.error("Save doctor error:", error);

        alert("Failed to save doctor.");
    }
}


// ==========================================
// DELETE DOCTOR
// ==========================================

async function deleteDoctor(id) {

    const token = localStorage.getItem("token");

    if (!confirm(
        "Are you sure you want to delete this doctor?"
    )) {
        return;
    }

    try {

        const response = await fetch(
            "/api/doctors/" + id,
            {
                method: "DELETE",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            if (response.status === 403) {
                alert("Only Admin can delete doctors.");
                return;
            }

            throw new Error("Failed to delete doctor");
        }

        alert("Doctor deleted successfully!");

        loadDoctors();

    } catch (error) {

        console.error("Delete doctor error:", error);

        alert("Failed to delete doctor.");
    }
}


// ==========================================
// SIDEBAR USER INFO (same technique as
// patients.js — decoded from the JWT)
// ==========================================

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


// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {

    localStorage.removeItem("token");

    window.location.href = "/login";
}