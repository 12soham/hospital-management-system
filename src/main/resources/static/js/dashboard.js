document.addEventListener("DOMContentLoaded", function () {

    applyRoleVisibility();

    loadDashboardData();
});


// =====================================================
// ROLE-BASED DASHBOARD VISIBILITY
// (client-side only — hides financial/admin-oriented
// pieces for doctors. Receptionists still see them since
// they handle billing per SecurityConfig. This does NOT
// restrict data access — it only curates what's shown on
// this page; a doctor can still open /billing directly,
// since GET /api/bills is permitted for their role too.)
// =====================================================

function applyRoleVisibility() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    let role = "";

    try {

        const payload = token.split(".")[1];

        const base64 =
            payload.replace(/-/g, "+").replace(/_/g, "/");

        role = JSON.parse(atob(base64)).role || "";

    } catch (error) {

        console.error("Unable to read role for visibility check:", error);

        return;
    }

    document.querySelectorAll("[data-hide-for]").forEach(function (el) {

        const hiddenRoles = el.getAttribute("data-hide-for").split(",");

        if (hiddenRoles.includes(role)) {
            el.style.display = "none";
        }
    });

    // If Recent Invoices got hidden, let Recent Appointments take
    // the full row instead of leaving an empty gap beside it.
    if (role === "DOCTOR") {

        const appointmentsPanel =
            document.getElementById("recentAppointmentsPanel");

        if (appointmentsPanel) {
            appointmentsPanel.classList.add("full-width");
        }
    }
}


// =====================================================
// LOGOUT
// =====================================================

function handleLogout() {

    localStorage.removeItem("token");

    window.location.href = "/login";
}


// =====================================================
// LOAD ALL DASHBOARD DATA
// =====================================================

async function loadDashboardData() {

    const token = localStorage.getItem("token");

    const headers = {
        "Authorization": "Bearer " + token
    };

    try {

        const [
            statsRes,
            appointmentsRes,
            prescriptionsRes,
            billsRes
        ] = await Promise.all([

            // Dedicated backend endpoint — returns
            // { patients, doctors, appointments } as totals.
            fetch("/api/dashboard/stats", { headers: headers }),

            // Large size so totalElements/content effectively covers
            // everything for the breakdown + recent list below.
            fetch("/api/appointments?page=0&size=1000", { headers: headers }),

            fetch("/api/prescriptions", { headers: headers }),

            fetch("/api/bills", { headers: headers })
        ]);


        // If the session has expired, any of these will be 401
        const responses = [
            statsRes,
            appointmentsRes,
            prescriptionsRes,
            billsRes
        ];

        if (responses.some(function (r) { return r.status === 401; })) {

            alert("Please login again.");

            window.location.href = "/login";

            return;
        }


        const stats =
            statsRes.ok
                ? await statsRes.json()
                : { patients: 0, doctors: 0, appointments: 0 };

        const appointmentPage =
            appointmentsRes.ok
                ? await appointmentsRes.json()
                : { content: [], totalElements: 0 };

        const prescriptions =
            prescriptionsRes.ok ? await prescriptionsRes.json() : [];

        const bills =
            billsRes.ok ? await billsRes.json() : [];


        const appointments = appointmentPage.content || [];


        // =============================================
        // STAT CARDS
        // =============================================

        setText("patientCount", stats.patients);

        setText("doctorCount", stats.doctors);

        setText("appointmentCount", stats.appointments);

        setText("prescriptionCount", prescriptions.length);

        setText("billCount", bills.length);


        const paidRevenue = bills

            .filter(function (bill) {
                return bill.paymentStatus === "PAID";
            })

            .reduce(function (sum, bill) {
                return sum + Number(bill.amount || 0);
            }, 0);

        setText("paidRevenue", "₹" + paidRevenue.toFixed(2));


        // =============================================
        // APPOINTMENT BREAKDOWN
        // =============================================

        const scheduledCount =
            appointments.filter(function (a) {
                return a.status === "BOOKED";
            }).length;

        const completedCount =
            appointments.filter(function (a) {
                return a.status === "COMPLETED";
            }).length;

        const cancelledCount =
            appointments.filter(function (a) {
                return a.status === "CANCELLED";
            }).length;

        setText("scheduledCount", scheduledCount);

        setText("completedCount", completedCount);

        setText("cancelledCount", cancelledCount);


        // =============================================
        // RECENT APPOINTMENTS (latest 4)
        // =============================================

        const recentAppointments = appointments

            .slice()

            .sort(function (a, b) {

                const dateA =
                    new Date(
                        a.appointmentDate + "T" +
                        (a.appointmentTime || "00:00")
                    );

                const dateB =
                    new Date(
                        b.appointmentDate + "T" +
                        (b.appointmentTime || "00:00")
                    );

                return dateB - dateA;
            })

            .slice(0, 4);

        renderRecentAppointments(recentAppointments);


        // =============================================
        // RECENT INVOICES (latest 3)
        // =============================================

        const recentBills = bills

            .slice()

            .sort(function (a, b) {
                return b.id - a.id;
            })

            .slice(0, 3);

        renderRecentInvoices(recentBills);


    } catch (error) {

        console.error("Dashboard load error:", error);
    }
}


// =====================================================
// HELPERS
// =====================================================

function setText(id, value) {

    const el = document.getElementById(id);

    if (el) {
        el.textContent = value;
    }
}


function renderRecentAppointments(list) {

    const tbody =
        document.getElementById("recentAppointmentsBody");

    if (!tbody) {
        return;
    }

    if (!list || list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:20px;">
                    No appointments found
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = list.map(function (appointment) {

        let statusClass = "status-booked";

        if (appointment.status === "COMPLETED") {
            statusClass = "status-completed";
        } else if (appointment.status === "CANCELLED") {
            statusClass = "status-cancelled";
        }

        return `
            <tr>
                <td>${appointment.patientName || ""}</td>
                <td>${appointment.doctorName || ""}</td>
                <td>
                    ${formatDate(appointment.appointmentDate)}
                    &nbsp;
                    ${formatTime(appointment.appointmentTime)}
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${appointment.status || ""}
                    </span>
                </td>
                <td>
                    <a class="btn btn-secondary btn-sm" href="/appointments">
                        View
                    </a>
                </td>
            </tr>
        `;
    }).join("");
}


function renderRecentInvoices(list) {

    const tbody =
        document.getElementById("recentInvoicesBody");

    if (!tbody) {
        return;
    }

    if (!list || list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:20px;">
                    No invoices found
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = list.map(function (bill) {

        const statusClass =
            bill.paymentStatus === "PAID"
                ? "status-paid"
                : "status-pending";

        const billNumber =
            "INV-" + String(bill.id).padStart(4, "0");

        return `
            <tr>
                <td>${billNumber}</td>
                <td>${bill.patientName || ""}</td>
                <td>₹${Number(bill.amount || 0).toFixed(2)}</td>
                <td>
                    <span class="${statusClass}">
                        ${bill.paymentStatus || ""}
                    </span>
                </td>
                <td>
                    <a class="btn btn-secondary btn-sm" href="/billing">
                        View
                    </a>
                </td>
            </tr>
        `;
    }).join("");
}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
}


function formatTime(timeString) {

    if (!timeString) {
        return "";
    }

    const parts = timeString.split(":");

    const hours = parseInt(parts[0], 10);

    const minutes = parts[1];

    const period = hours >= 12 ? "PM" : "AM";

    const displayHour = hours % 12 || 12;

    return displayHour + ":" + minutes + " " + period;
}