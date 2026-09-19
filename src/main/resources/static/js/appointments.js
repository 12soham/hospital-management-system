let currentPage = 0;

const recordsPerPage = 5;

let totalPages = 0;
let totalElements = 0;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserInfo();

        loadAppointments();

        loadPatients();

        loadDoctors();


        // Search

        const searchInput =
            document.getElementById(
                "appointmentSearchInput"
            );

        if (searchInput) {

            let searchDebounce;

            searchInput.addEventListener(
                "input",
                function () {

                    clearTimeout(searchDebounce);

                    searchDebounce = setTimeout(
                        function () {

                            currentPage = 0;

                            loadAppointments();
                        },
                        300
                    );
                }
            );
        }


        // Status filter

        const statusFilter =
            document.getElementById(
                "appointmentStatusFilter"
            );

        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                function () {

                    // Start from first page
                    currentPage = 0;

                    loadAppointments();
                }
            );
        }


        // Date filter

        const dateFilter =
            document.getElementById(
                "appointmentDateFilter"
            );

        if (dateFilter) {

            dateFilter.addEventListener(
                "change",
                function () {

                    currentPage = 0;

                    loadAppointments();
                }
            );
        }


        // Appointment form

        const appointmentForm =
            document.getElementById(
                "appointmentForm"
            );

        if (appointmentForm) {

            appointmentForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    saveAppointment();
                }
            );
        }


        // Previous button

        const previousButton =
            document.getElementById(
                "appointmentPrevBtn"
            );

        if (previousButton) {

            previousButton.addEventListener(
                "click",
                function () {

                    if (currentPage > 0) {

                        currentPage--;

                        loadAppointments();
                    }
                }
            );
        }


        // Next button

        const nextButton =
            document.getElementById(
                "appointmentNextBtn"
            );

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    if (
                        currentPage <
                        totalPages - 1
                    ) {

                        currentPage++;

                        loadAppointments();
                    }
                }
            );
        }
    }
);


// =====================================================
// LOAD APPOINTMENTS
// =====================================================

async function loadAppointments() {

    const token =
        localStorage.getItem("token");


    const statusFilter =
        document.getElementById(
            "appointmentStatusFilter"
        );

    const searchInput =
        document.getElementById(
            "appointmentSearchInput"
        );

    const dateFilter =
        document.getElementById(
            "appointmentDateFilter"
        );


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "";

    const searchText =
        searchInput
            ? searchInput.value.trim()
            : "";

    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "";


    try {

        let url =
            "/api/appointments?page=" +
            currentPage +
            "&size=" +
            recordsPerPage;


        if (selectedStatus) {

            url +=
                "&status=" +
                encodeURIComponent(
                    selectedStatus
                );
        }

        if (searchText) {

            url +=
                "&search=" +
                encodeURIComponent(
                    searchText
                );
        }

        if (selectedDate) {

            url +=
                "&date=" +
                encodeURIComponent(
                    selectedDate
                );
        }


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        // Unauthorized

        if (response.status === 401) {

            alert(
                "Please login again."
            );

            window.location.href =
                "/login";

            return;
        }


        // Forbidden

        if (response.status === 403) {

            alert(
                "You do not have permission to view appointments."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load appointments"
            );
        }


        const pageData =
            await response.json();


        totalPages =
            pageData.totalPages;

        totalElements =
            pageData.totalElements;


        displayAppointments(
            pageData.content
        );


        updatePagination();


    } catch (error) {

        console.error(
            "Appointment loading error:",
            error
        );


        const tableBody =
            document.getElementById(
                "appointmentTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:24px;
                        "
                    >
                        Failed to load appointments
                    </td>
                </tr>
            `;
        }
    }
}


// =====================================================
// DISPLAY APPOINTMENTS
// =====================================================

function displayAppointments(
    appointments
) {

    const tableBody =
        document.getElementById(
            "appointmentTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !appointments ||
        appointments.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:24px;
                    "
                >
                    No appointments found
                </td>
            </tr>
        `;

        return;
    }


    appointments.forEach(
        function (appointment) {

            const row =
                document.createElement("tr");


            let statusClass = "";


            if (
                appointment.status ===
                "BOOKED"
            ) {

                statusClass =
                    "status-booked";
            }

            else if (
                appointment.status ===
                "COMPLETED"
            ) {

                statusClass =
                    "status-completed";
            }

            else if (
                appointment.status ===
                "CANCELLED"
            ) {

                statusClass =
                    "status-cancelled";
            }


            const formattedDate =
                formatDate(
                    appointment.appointmentDate
                );


            const formattedTime =
                formatTime(
                    appointment.appointmentTime
                );


            const reasonText =
                appointment.reason || "—";


            row.innerHTML = `

                <td>
                    <strong>${appointment.patientName || ""}</strong>
                    <span class="cell-subtext">${appointment.patientPhone || ""}</span>
                </td>

                <td>
                    <strong>${appointment.doctorName || ""}</strong>
                    <span class="cell-subtext">${appointment.doctorSpecialization || ""}</span>
                </td>

                <td>
                    <strong>${formattedDate}</strong>
                    <span class="cell-subtext">${formattedTime}</span>
                </td>

                <td>
                    <span
                        class="status-badge ${statusClass}"
                    >
                        ${appointment.status}
                    </span>
                </td>

                <td>${reasonText}</td>

                <td>
                    <div class="action-buttons">
                        ${getActionButtons(
                            appointment
                        )}
                    </div>
                </td>

            `;


            tableBody.appendChild(row);
        }
    );
}


// =====================================================
// GET USER ROLE
// =====================================================

function getUserRole() {

    const token =
        localStorage.getItem("token");


    if (!token) {
        return "";
    }


    try {

        const payload =
            token.split(".")[1];


        const base64 =
            payload
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        const decodedPayload =
            JSON.parse(
                atob(base64)
            );


        return decodedPayload.role || "";


    } catch (error) {

        console.error(
            "Unable to read user role:",
            error
        );

        return "";
    }
}


// =====================================================
// ACTION BUTTONS
// =====================================================

function getActionButtons(
    appointment
) {

    const role =
        getUserRole();


    let buttons = "";


    // =================================================
    // ADMIN
    // =================================================

    if (role === "ADMIN") {

        if (
            appointment.status ===
            "BOOKED"
        ) {

            buttons += `
                <button
                    class="btn btn-success btn-sm"
                    onclick="completeAppointment(
                        ${appointment.id}
                    )"
                >
                    Complete
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="cancelAppointment(
                        ${appointment.id}
                    )"
                >
                    Cancel
                </button>
            `;
        }


        buttons += `
            <button
                class="icon-btn edit-icon"
                title="Edit"
                onclick="editAppointment(
                    ${appointment.id}
                )"
            >
                ✎
            </button>
        `;


        // ADMIN DELETE

        buttons += `
            <button
                class="icon-btn delete-icon"
                title="Delete"
                onclick="deleteAppointment(
                    ${appointment.id}
                )"
            >
                ✕
            </button>
        `;
    }


    // =================================================
    // DOCTOR
    // =================================================

    else if (role === "DOCTOR") {

        if (
            appointment.status ===
            "BOOKED"
        ) {

            buttons += `
                <button
                    class="btn btn-success btn-sm"
                    onclick="completeAppointment(
                        ${appointment.id}
                    )"
                >
                    Complete
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="cancelAppointment(
                        ${appointment.id}
                    )"
                >
                    Cancel
                </button>
            `;
        }

        buttons += `
            <button
                class="icon-btn edit-icon"
                title="Edit"
                onclick="editAppointment(
                    ${appointment.id}
                )"
            >
                ✎
            </button>
        `;
    }


    // =================================================
    // RECEPTIONIST
    // =================================================

    else if (
        role === "RECEPTIONIST"
    ) {

        buttons += `
            <button
                class="icon-btn edit-icon"
                title="Edit"
                onclick="editAppointment(
                    ${appointment.id}
                )"
            >
                ✎
            </button>
        `;
    }


    return buttons;
}


// =====================================================
// LOAD PATIENTS
// =====================================================

async function loadPatients() {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/patients",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );
        }


        const patients =
            await response.json();


        const patientSelect =
            document.getElementById(
                "appointmentPatient"
            );


        if (!patientSelect) {
            return;
        }


        patientSelect.innerHTML = `
            <option value="">
                Select Patient
            </option>
        `;


        patients.forEach(
            function (patient) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    patient.id;


                option.textContent =
                    patient.name;


                patientSelect.appendChild(
                    option
                );
            }
        );


    } catch (error) {

        console.error(
            "Patient dropdown error:",
            error
        );
    }
}


// =====================================================
// LOAD DOCTORS
// =====================================================

async function loadDoctors() {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/doctors",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load doctors"
            );
        }


        const doctors =
            await response.json();


        const doctorSelect =
            document.getElementById(
                "appointmentDoctor"
            );


        if (!doctorSelect) {
            return;
        }


        doctorSelect.innerHTML = `
            <option value="">
                Select Doctor
            </option>
        `;


        doctors.forEach(
            function (doctor) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.id;


                option.textContent =
                    doctor.name +
                    " - " +
                    doctor.specialization;


                doctorSelect.appendChild(
                    option
                );
            }
        );


    } catch (error) {

        console.error(
            "Doctor dropdown error:",
            error
        );
    }
}


// =====================================================
// OPEN ADD APPOINTMENT MODAL
// =====================================================

function openAddAppointmentModal() {

    const modal =
        document.getElementById(
            "appointmentModal"
        );


    const form =
        document.getElementById(
            "appointmentForm"
        );


    const title =
        document.getElementById(
            "appointmentModalTitle"
        );


    const appointmentId =
        document.getElementById(
            "appointmentId"
        );


    if (!modal || !form) {
        return;
    }


    form.reset();


    if (appointmentId) {

        appointmentId.value = "";
    }


    if (title) {

        title.textContent =
            "Add New Appointment";
    }


    modal.classList.add(
        "active"
    );
}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeAppointmentModal() {

    const modal =
        document.getElementById(
            "appointmentModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


// =====================================================
// EDIT APPOINTMENT
// =====================================================

async function editAppointment(id) {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/appointments/" + id,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (response.status === 403) {

            alert(
                "You do not have permission to edit appointments."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load appointment"
            );
        }


        const appointment =
            await response.json();


        document.getElementById(
            "appointmentId"
        ).value =
            appointment.id;


        document.getElementById(
            "appointmentPatient"
        ).value =
            appointment.patientId;


        document.getElementById(
            "appointmentDoctor"
        ).value =
            appointment.doctorId;


        document.getElementById(
            "appointmentDate"
        ).value =
            appointment.appointmentDate;


        document.getElementById(
            "appointmentTime"
        ).value =
            appointment.appointmentTime;


        document.getElementById(
            "appointmentReason"
        ).value =
            appointment.reason || "";


        document.getElementById(
            "appointmentModalTitle"
        ).textContent =
            "Edit Appointment";


        document.getElementById(
            "appointmentModal"
        ).classList.add(
            "active"
        );


    } catch (error) {

        console.error(
            "Edit appointment error:",
            error
        );


        alert(
            "Failed to load appointment information."
        );
    }
}


// =====================================================
// SAVE APPOINTMENT
// =====================================================

async function saveAppointment() {

    const token =
        localStorage.getItem("token");


    const appointmentId =
        document.getElementById(
            "appointmentId"
        ).value;


    const patientId =
        document.getElementById(
            "appointmentPatient"
        ).value;


    const doctorId =
        document.getElementById(
            "appointmentDoctor"
        ).value;


    const appointmentDate =
        document.getElementById(
            "appointmentDate"
        ).value;


    const appointmentTime =
        document.getElementById(
            "appointmentTime"
        ).value;


    const reason =
        document.getElementById(
            "appointmentReason"
        ).value.trim();


    if (
        !patientId ||
        !doctorId ||
        !appointmentDate ||
        !appointmentTime ||
        !reason
    ) {

        alert(
            "Please fill all appointment fields."
        );

        return;
    }


    const appointmentData = {

        patientId:
            Number(patientId),

        doctorId:
            Number(doctorId),

        appointmentDate:
            appointmentDate,

        appointmentTime:
            appointmentTime,

        reason:
            reason
    };


    const isEdit =
        appointmentId !== "";


    const url =
        isEdit
            ? "/api/appointments/" +
              appointmentId
            : "/api/appointments";


    const method =
        isEdit
            ? "PUT"
            : "POST";


    try {

        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            appointmentData
                        )
                }
            );


        if (response.status === 403) {

            alert(
                "You do not have permission to save this appointment."
            );

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Server error:",
                errorText
            );


            throw new Error(
                "Failed to save appointment"
            );
        }


        if (isEdit) {

            alert(
                "Appointment updated successfully!"
            );

        } else {

            alert(
                "Appointment booked successfully!"
            );
        }


        closeAppointmentModal();


        await loadAppointments();


    } catch (error) {

        console.error(
            "Save appointment error:",
            error
        );


        alert(
            "Failed to save appointment."
        );
    }
}


// =====================================================
// COMPLETE APPOINTMENT
// =====================================================

async function completeAppointment(id) {

    if (
        !confirm(
            "Mark this appointment as completed?"
        )
    ) {

        return;
    }


    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/appointments/" +
                id +
                "/complete",
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (response.status === 403) {

            alert(
                "You do not have permission to complete appointments."
            );

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                errorText
            );

            throw new Error(
                "Failed to complete appointment"
            );
        }


        alert(
            "Appointment completed successfully!"
        );


        await loadAppointments();


    } catch (error) {

        console.error(
            "Complete appointment error:",
            error
        );


        alert(
            "Failed to complete appointment."
        );
    }
}


// =====================================================
// CANCEL APPOINTMENT
// =====================================================

async function cancelAppointment(id) {

    if (
        !confirm(
            "Are you sure you want to cancel this appointment?"
        )
    ) {

        return;
    }


    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/appointments/" +
                id +
                "/cancel",
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (response.status === 403) {

            alert(
                "You do not have permission to cancel appointments."
            );

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                errorText
            );

            throw new Error(
                "Failed to cancel appointment"
            );
        }


        alert(
            "Appointment cancelled successfully!"
        );


        await loadAppointments();


    } catch (error) {

        console.error(
            "Cancel appointment error:",
            error
        );


        alert(
            "Failed to cancel appointment."
        );
    }
}


// =====================================================
// DELETE APPOINTMENT
// ADMIN ONLY
// =====================================================

async function deleteAppointment(id) {

    if (
        !confirm(
            "Are you sure you want to delete this appointment?"
        )
    ) {

        return;
    }


    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "/api/appointments/" + id,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (response.status === 403) {

            alert(
                "You do not have permission to delete appointments."
            );

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                errorText
            );

            throw new Error(
                "Failed to delete appointment"
            );
        }


        alert(
            "Appointment deleted successfully!"
        );


        // Reload current page
        await loadAppointments();


    } catch (error) {

        console.error(
            "Delete appointment error:",
            error
        );


        alert(
            "Failed to delete appointment."
        );
    }
}


// =====================================================
// PAGINATION
// =====================================================

function updatePagination() {

    const paginationInfo =
        document.getElementById(
            "appointmentPaginationInfo"
        );


    const previousButton =
        document.getElementById(
            "appointmentPrevBtn"
        );


    const nextButton =
        document.getElementById(
            "appointmentNextBtn"
        );


    if (totalElements === 0) {

        if (paginationInfo) {

            paginationInfo.textContent =
                "Showing 0 appointments";
        }


        if (previousButton) {

            previousButton.disabled =
                true;
        }


        if (nextButton) {

            nextButton.disabled =
                true;
        }


        return;
    }


    const start =
        currentPage *
        recordsPerPage +
        1;


    const end =
        Math.min(
            start +
            recordsPerPage -
            1,
            totalElements
        );


    if (paginationInfo) {

        paginationInfo.textContent =
            "Showing " +
            start +
            "-" +
            end +
            " of " +
            totalElements +
            " appointments";
    }


    if (previousButton) {

        previousButton.disabled =
            currentPage === 0;
    }


    if (nextButton) {

        nextButton.disabled =
            currentPage >=
            totalPages - 1;
    }
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(timeString) {

    if (!timeString) {
        return "";
    }


    const parts =
        timeString.split(":");


    const hours =
        parseInt(
            parts[0],
            10
        );


    const minutes =
        parts[1];


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    const displayHour =
        hours % 12 || 12;


    return (
        displayHour +
        ":" +
        minutes +
        " " +
        period
    );
}


// =====================================================
// SIDEBAR USER INFO (same technique as
// patients.js / doctors.js — decoded from the JWT)
// =====================================================

function loadUserInfo() {

    const token =
        localStorage.getItem("token");

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


// =====================================================
// LOGOUT
// =====================================================

function handleLogout() {

    localStorage.removeItem("token");

    window.location.href = "/login";
}