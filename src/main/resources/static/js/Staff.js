document.addEventListener("DOMContentLoaded", () => {

    applyRoleVisibility();

    loadUserInfo();

    guardAdminOnly();

    const staffForm = document.getElementById("staffForm");

    if (staffForm) {

        staffForm.addEventListener("submit", (event) => {

            event.preventDefault();

            createStaffAccount();
        });
    }

    const roleSelect = document.getElementById("staffRole");

    if (roleSelect) {

        roleSelect.addEventListener("change", () => {

            const doctorReminder = document.getElementById("doctorReminder");

            if (doctorReminder) {
                doctorReminder.style.display =
                    roleSelect.value === "DOCTOR" ? "block" : "none";
            }
        });
    }
});


// =====================================================
// ADMIN-ONLY GUARD
// (this page is Admin-only in intent, but the frontend
// route itself is permitAll — same as every other page in
// this app — so this just swaps the form for a message if
// a non-admin somehow lands here directly. The real
// protection is server-side: POST /api/auth/register
// requires ADMIN per SecurityConfig, so a non-admin token
// could never actually succeed here anyway.)
// =====================================================

function guardAdminOnly() {

    if (getUserRole() !== "ADMIN") {

        const notice = document.getElementById("accessRestrictedNotice");
        const formWrapper = document.getElementById("staffFormWrapper");

        if (notice) notice.style.display = "block";
        if (formWrapper) formWrapper.style.display = "none";
    }
}


// =====================================================
// CREATE STAFF ACCOUNT
// =====================================================

async function createStaffAccount() {

    const token = localStorage.getItem("token");

    const name = document.getElementById("staffName").value.trim();
    const email = document.getElementById("staffEmail").value.trim();
    const password = document.getElementById("staffPassword").value;
    const role = document.getElementById("staffRole").value;

    const messageEl = document.getElementById("formMessage");

    if (!name || !email || !password || !role) {
        showFormMessage("Please fill all required fields.", true);
        return;
    }

    const payload = { name, email, password, role };

    try {

        const response = await fetch("/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify(payload)
        });

        if (response.status === 403) {
            showFormMessage(
                "Only Admin accounts can create new staff logins.",
                true
            );
            return;
        }

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Register error:", errorText);

            throw new Error(errorText || "Failed to create account");
        }

        showFormMessage(
            `Account created for ${name} (${role}).` +
            (role === "DOCTOR"
                ? " Remember to add their doctor profile too."
                : ""),
            false
        );

        document.getElementById("staffForm").reset();

        const doctorReminder = document.getElementById("doctorReminder");
        if (doctorReminder) doctorReminder.style.display = "none";

    } catch (error) {

        console.error("Create staff account error:", error);

        showFormMessage("Failed to create account: " + error.message, true);
    }
}


function showFormMessage(text, isError) {

    const messageEl = document.getElementById("formMessage");

    if (!messageEl) return;

    messageEl.textContent = text;

    messageEl.style.color = isError ? "var(--danger)" : "var(--success)";
}


// =====================================================
// ROLE / SIDEBAR HELPERS (same pattern as other pages)
// =====================================================

function getUserRole() {

    const token = localStorage.getItem("token");

    if (!token) return "";

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


function handleLogout() {

    localStorage.removeItem("token");

    window.location.href = "/login";
}