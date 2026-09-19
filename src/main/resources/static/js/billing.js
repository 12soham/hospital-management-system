let allBills = [];
let filteredBills = [];
let currentPage = 0;
let appointmentsById = {};

const recordsPerPage = 5;


document.addEventListener("DOMContentLoaded", () => {

    applyRoleVisibility();

    loadUserInfo();

    loadBills();

    loadAppointmentOptions();

    document
        .getElementById("generateBillBtn")
        .addEventListener("click", openBillModal);

    document
        .getElementById("closeBillModal")
        .addEventListener("click", closeBillModal);

    document
        .getElementById("cancelBillBtn")
        .addEventListener("click", closeBillModal);

    document
        .getElementById("closeInvoiceModal")
        .addEventListener("click", closeInvoiceModal);

    document
        .getElementById("billForm")
        .addEventListener("submit", generateBill);

    document
        .getElementById("appointmentId")
        .addEventListener("change", onAppointmentSelected);


    const searchInput = document.getElementById("billSearchInput");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            currentPage = 0;

            applyFilters();
        });
    }


    const statusFilter = document.getElementById("billStatusFilter");

    if (statusFilter) {

        statusFilter.addEventListener("change", function () {

            currentPage = 0;

            applyFilters();
        });
    }


    const prevBtn = document.getElementById("billPrevBtn");

    if (prevBtn) {

        prevBtn.addEventListener("click", function () {

            if (currentPage > 0) {

                currentPage--;

                renderCurrentPage();
            }
        });
    }


    const nextBtn = document.getElementById("billNextBtn");

    if (nextBtn) {

        nextBtn.addEventListener("click", function () {

            const totalPages =
                Math.ceil(filteredBills.length / recordsPerPage);

            if (currentPage < totalPages - 1) {

                currentPage++;

                renderCurrentPage();
            }
        });
    }
});


// =====================================================
// GET USER ROLE (same technique as appointments.js /
// doctors.js)
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


// =====================================================
// ROLE-BASED VISIBILITY
// (same client-side pattern as dashboard.js/doctors.js —
// hides elements tagged data-hide-for="ROLE,ROLE")
// =====================================================

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
// OPEN / CLOSE BILL MODAL
// =====================================================

function openBillModal() {

    document.getElementById("billModal").style.display = "block";

    document.getElementById("billForm").reset();

    document.getElementById("billId").value = "";

    document.getElementById("patientId").value = "";
}


function closeBillModal() {

    document.getElementById("billModal").style.display = "none";

    document.getElementById("billForm").reset();

    document.getElementById("billId").value = "";

    document.getElementById("patientId").value = "";
}


function closeInvoiceModal() {

    document.getElementById("invoiceModal").style.display = "none";
}


// =====================================================
// LOAD APPOINTMENT OPTIONS FOR THE DROPDOWN
// (same size=1000 technique as prescriptions.js /
// dashboard.js — /api/appointments has no "give me
// everything" mode)
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

        appointmentsById = {};

        const select = document.getElementById("appointmentId");

        select.innerHTML = `<option value="">Select Appointment</option>`;

        appointments.forEach((appointment) => {

            appointmentsById[appointment.id] = appointment;

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


// Auto-fills the hidden patientId from the selected appointment,
// instead of the user typing a raw ID that has to match manually.
function onAppointmentSelected() {

    const appointmentSelect = document.getElementById("appointmentId");

    const appointment = appointmentsById[appointmentSelect.value];

    document.getElementById("patientId").value =
        appointment ? appointment.patientId : "";
}


// =====================================================
// LOAD ALL BILLS
// (backend returns a plain list — client-side search /
// status filter / pagination below, same pattern as the
// other rebuilt pages)
// =====================================================

async function loadBills() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("/api/bills", {

            method: "GET",

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

            const errorText = await response.text();

            console.error("Load Bills Error:", errorText);

            throw new Error(
                errorText || "Failed to load bills"
            );
        }

        allBills = await response.json();

        filteredBills = allBills;

        renderCurrentPage();

    } catch (error) {

        console.error("Load Bills Error:", error);

        const tableBody = document.getElementById("billTableBody");

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:24px;">
                        Failed to load bills
                    </td>
                </tr>
            `;
        }
    }
}


// =====================================================
// SEARCH + STATUS FILTER (client-side)
// =====================================================

function applyFilters() {

    const searchInput = document.getElementById("billSearchInput");

    const statusFilter = document.getElementById("billStatusFilter");

    const query =
        searchInput ? searchInput.value.trim().toLowerCase() : "";

    const selectedStatus =
        statusFilter ? statusFilter.value : "";

    filteredBills = allBills.filter((bill) => {

        const invoiceNumber = formatInvoiceNumber(bill).toLowerCase();
        const patientName = (bill.patientName || "").toLowerCase();
        const patientPhone = (bill.patientPhone || "").toLowerCase();

        const matchesSearch =
            !query ||
            invoiceNumber.includes(query) ||
            patientName.includes(query) ||
            patientPhone.includes(query);

        const matchesStatus =
            !selectedStatus || bill.paymentStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    renderCurrentPage();
}


// =====================================================
// PAGINATION (client-side)
// =====================================================

function renderCurrentPage() {

    const totalRecords = filteredBills.length;

    const totalPages =
        Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

    if (currentPage > totalPages - 1) currentPage = totalPages - 1;
    if (currentPage < 0) currentPage = 0;

    const start = currentPage * recordsPerPage;
    const end = start + recordsPerPage;
    const pageItems = filteredBills.slice(start, end);

    displayBills(pageItems);
    updatePagination(totalRecords, totalPages);
}


function updatePagination(totalRecords, totalPages) {

    const paginationInfo = document.getElementById("billPaginationInfo");
    const prevBtn = document.getElementById("billPrevBtn");
    const nextBtn = document.getElementById("billNextBtn");

    if (totalRecords === 0) {
        if (paginationInfo) paginationInfo.textContent = "Showing 0 bills";
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
    }

    const start = currentPage * recordsPerPage + 1;
    const end = Math.min(start + recordsPerPage - 1, totalRecords);

    if (paginationInfo) {
        paginationInfo.textContent =
            "Showing " + start + "-" + end + " of " + totalRecords + " bills";
    }

    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}


// =====================================================
// INVOICE NUMBER (computed client-side from billDate +
// id — no backend change needed for this)
// =====================================================

function formatInvoiceNumber(bill) {

    const year =
        bill.billDate ? bill.billDate.split("-")[0] : "0000";

    const paddedId = String(bill.id).padStart(4, "0");

    return "INV-" + year + "-" + paddedId;
}


// =====================================================
// DISPLAY BILLS
// =====================================================

function displayBills(bills) {

    const tableBody = document.getElementById("billTableBody");

    tableBody.innerHTML = "";

    if (bills.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No bills found
                </td>
            </tr>
        `;

        return;
    }

    bills.forEach(bill => {

        const isPaid = bill.paymentStatus === "PAID";

        const statusClass = isPaid ? "status-paid" : "status-pending";

        // Displayed label is normalized to PAID / UNPAID regardless
        // of the raw stored value (e.g. "PENDING"), matching the
        // screenshot's wording without changing what's in the DB.
        const statusLabel = isPaid ? "PAID" : "UNPAID";

        tableBody.innerHTML += `

            <tr>

                <td><strong>${formatInvoiceNumber(bill)}</strong></td>

                <td>
                    <strong>${bill.patientName || ""}</strong>
                    <span class="cell-subtext">${bill.patientPhone || ""}</span>
                </td>

                <td>${formatDate(bill.billDate)}</td>

                <td>${formatPaymentMethod(bill.paymentMethod)}</td>

                <td><strong>₹${Number(bill.amount).toFixed(2)}</strong></td>

                <td>
                    <span class="${statusClass}">
                        ${statusLabel}
                    </span>
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            class="btn btn-primary btn-sm"
                            onclick="viewInvoice(${bill.id})">
                            Invoice
                        </button>

                        ${
                            !isPaid
                            ? `
                                <button
                                    class="btn btn-success btn-sm"
                                    onclick="markAsPaid(${bill.id})">
                                    Mark Paid
                                </button>
                              `
                            : ""
                        }

                    </div>
                </td>

            </tr>
        `;
    });
}


function formatPaymentMethod(method) {

    if (!method) {
        return "—";
    }

    // CREDIT_CARD -> Credit Card
    return method
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}


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
// GENERATE BILL
// =====================================================

async function generateBill(event) {

    event.preventDefault();

    const appointmentId =
        Number(document.getElementById("appointmentId").value);

    const patientId =
        Number(document.getElementById("patientId").value);

    const amount =
        Number(document.getElementById("amount").value);

    const paymentMethod =
        document.getElementById("paymentMethod").value;


    if (!appointmentId) {
        alert("Please select an appointment.");
        return;
    }

    if (!patientId) {
        alert("Could not determine the patient for this appointment.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Bill amount must be greater than 0.");
        return;
    }

    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    const billData = {
        appointmentId: appointmentId,
        patientId: patientId,
        amount: amount,
        paymentMethod: paymentMethod
    };

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("/api/bills", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(billData)
        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Backend Error:", errorText);

            throw new Error(errorText || "Failed to generate bill");
        }

        const savedBill = await response.json();

        closeBillModal();

        await loadBills();

        alert("Bill Generated Successfully");

        viewInvoiceFromData(savedBill);

    } catch (error) {

        console.error("Generate Bill Error:", error);

        alert("Error Generating Bill: " + error.message);
    }
}


// =====================================================
// MARK BILL AS PAID
// =====================================================

async function markAsPaid(id) {

    if (!confirm("Are you sure you want to mark this bill as PAID?")) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(`/api/bills/${id}/pay`, {

            method: "PUT",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error(errorText);

            throw new Error("Failed to mark bill as paid");
        }

        await loadBills();

        alert("Bill Marked as PAID Successfully");

    } catch (error) {

        console.error("Mark Paid Error:", error);

        alert("Error marking bill as paid: " + error.message);
    }
}


// =====================================================
// VIEW INVOICE
// =====================================================

async function viewInvoice(id) {

    const bill = allBills.find((b) => b.id === id);

    if (bill) {
        viewInvoiceFromData(bill);
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(`/api/bills/${id}`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(errorText || "Failed to load invoice");
        }

        const fetchedBill = await response.json();

        viewInvoiceFromData(fetchedBill);

    } catch (error) {

        console.error("Invoice Error:", error);

        alert("Error loading invoice: " + error.message);
    }
}


// =====================================================
// CREATE INVOICE
// =====================================================

function viewInvoiceFromData(bill) {

    const invoiceContent = document.getElementById("invoiceContent");

    const isPaid = bill.paymentStatus === "PAID";

    invoiceContent.innerHTML = `

        <div class="invoice">

            <div class="invoice-header">

                <div>
                    <h2>Hospital Management</h2>
                    <p>Medical Billing Invoice</p>
                </div>

                <div>
                    <strong>Invoice #${formatInvoiceNumber(bill)}</strong>
                    <p>Date: ${formatDate(bill.billDate)}</p>
                </div>

            </div>

            <hr>

            <div class="invoice-details">

                <div>
                    <strong>Patient</strong>
                    <p>${bill.patientName || ""}</p>
                    <p>${bill.patientPhone || ""}</p>
                </div>

                <div>
                    <strong>Doctor</strong>
                    <p>${bill.doctorName || ""}</p>
                    <p>Appointment ID: ${bill.appointmentId}</p>
                </div>

            </div>

            <table class="invoice-table">

                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Medical / Consultation Charges</td>
                        <td>₹${Number(bill.amount).toFixed(2)}</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <th>Total Amount</th>
                        <th>₹${Number(bill.amount).toFixed(2)}</th>
                    </tr>
                </tfoot>

            </table>

            <div class="invoice-status">
                <strong>Payment Method:</strong>
                <span>${formatPaymentMethod(bill.paymentMethod)}</span>
            </div>

            <div class="invoice-status">
                <strong>Payment Status:</strong>
                <span>${isPaid ? "PAID" : "UNPAID"}</span>
            </div>

            <div class="invoice-footer">
                <p>Thank you for choosing our hospital.</p>
            </div>

        </div>
    `;

    document.getElementById("invoiceModal").style.display = "block";
}


// =====================================================
// PRINT / DOWNLOAD INVOICE
// =====================================================

function printInvoice() {

    const invoiceContent =
        document.getElementById("invoiceContent").innerHTML;

    const printWindow =
        window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>Hospital Invoice</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #111827;
                }

                .invoice {
                    max-width: 800px;
                    margin: auto;
                }

                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 25px;
                }

                .invoice-details {
                    display: flex;
                    justify-content: space-between;
                    margin: 25px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th,
                td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }

                th {
                    background: #f3f4f6;
                }

                .invoice-status {
                    margin-top: 12px;
                    font-size: 15px;
                }

                .invoice-footer {
                    margin-top: 40px;
                    text-align: center;
                }

                hr {
                    border: none;
                    border-top: 1px solid #ddd;
                }

            </style>

        </head>


        <body>

            ${invoiceContent}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();
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