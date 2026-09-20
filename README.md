# MediCare HMS — Hospital Management System

A full-stack, role-based Hospital Management System built with **Spring Boot**, **Spring Security (JWT)**, and a **Thymeleaf + vanilla JavaScript** frontend. It manages patients, doctors, appointments, prescriptions, and billing — with three distinct login roles, each seeing a tailored view of the app.

---

## ✨ Features

- **Dashboard** — live counts (patients, doctors, appointments, prescriptions, bills), appointment status breakdown, quick actions, and recent activity — all scoped to what the logged-in role is actually allowed to see.
- **Patient Management** — add, search, view, edit, and delete patient records (name, age, gender, phone, address, email).
- **Doctor Management** — manage doctor profiles (specialization, department, experience, consultation fee, contact info) with role-based read/write access.
- **Appointment Scheduling** — book, search, filter (status/date), complete, cancel, and edit appointments with a reason for visit.
- **Prescriptions** — create diagnoses and medicines tied to a specific appointment, with a printable prescription view.
- **Billing & Invoices** — generate bills against completed appointments, track payment status/method, mark bills as paid, and print/download invoices.
- **Staff Accounts** — Admins can create new login accounts (Doctor / Receptionist / Admin) directly from the app.
- **Role-based UI** — buttons, columns, and entire sections are shown or hidden per role, matching what the backend actually permits — not just cosmetic hiding.

---

## 🔐 Roles & Access

| Area | Admin | Doctor | Receptionist |
|---|:---:|:---:|:---:|
| Dashboard financials (revenue, bills) | ✅ | ❌ | ✅ |
| Manage Patients (add/edit/delete) | ✅ | ✅ | ✅ |
| Manage Doctors (add/edit/delete) | ✅ | View only | View only |
| Doctor consultation fees | ✅ | ❌ | ✅ |
| Book Appointments | ✅ | ✅ | ✅ |
| Complete / Cancel Appointments | ✅ | ✅ | ❌ |
| Prescriptions (view/print) | ✅ | ✅ | ✅ |
| Prescriptions (create/edit/delete) | ✅ | ✅ | ❌ |
| Generate Bills | ✅ | ❌ | ✅ |
| Mark Bills as Paid | ✅ | ✅ | ✅ |
| Create Staff Accounts | ✅ | ❌ | ❌ |

Every restriction above is enforced **on the backend** (Spring Security) — the frontend only hides what a role can't do, it never relies on hiding alone.

---

## 🛠 Tech Stack

**Backend**
- Java, Spring Boot
- Spring Security + JWT (stateless authentication)
- Spring Data JPA / Hibernate
- Bean Validation (Jakarta Validation)

**Frontend**
- Thymeleaf (server-rendered pages)
- Vanilla JavaScript (no frontend framework)
- Custom CSS design system (no UI library)

**Database**
- Relational database via Spring Data JPA (MySQL/PostgreSQL/H2 — configure in `application.properties`)

---

## 📁 Project Structure (key packages)

```
com.example.hospitalManagement
├── auth           # Login / registration (JWT issuance)
├── security        # SecurityConfig, JwtService, JwtAuthenticationFilter
├── user             # User entity (login accounts) + roles
├── patient          # Patient CRUD
├── doctor           # Doctor CRUD
├── appointment      # Appointment scheduling + status transitions
├── prescription     # Prescriptions tied to appointments
├── billing          # Bills / invoices tied to appointments
├── dashboard        # Aggregated stats endpoint
└── page             # Thymeleaf page routing (PageController)
```

Frontend templates live under `src/main/resources/templates/`, static JS/CSS under `src/main/resources/static/`.

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ (or your project's configured JDK version)
- Maven (or the included `mvnw` wrapper)
- A running database instance matching your `application.properties` configuration

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Configure the database and secrets**

   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password

   jwt.secret=your_base64_encoded_secret_key
   ```
   > ⚠️ Never commit real credentials. Use environment variables or a local, git-ignored properties file in production.

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   The app starts on `http://localhost:8081` (or whatever port is configured).

4. **Log in**

   The login page includes a **Quick Demo Login** panel with sample credentials for each role. For a fresh database, you'll need to seed at least one Admin account directly (via your database or a startup seeder), since new accounts can only be created by an existing Admin through the Staff Accounts page.

---

## 📡 Key API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/auth/login` | Public |
| `POST` | `/api/auth/register` | Admin only |
| `GET` | `/api/dashboard/stats` | Admin, Doctor, Receptionist |
| `GET/POST/PUT/DELETE` | `/api/patients/**` | Admin, Doctor, Receptionist |
| `GET` | `/api/doctors/**` | Admin, Doctor, Receptionist |
| `POST/PUT/DELETE` | `/api/doctors/**` | Admin only |
| `GET/POST/PUT` | `/api/appointments/**` | Admin, Doctor, Receptionist |
| `DELETE` | `/api/appointments/**` | Admin only |
| `GET` | `/api/prescriptions/**` | Admin, Doctor, Receptionist |
| `POST/PUT/DELETE` | `/api/prescriptions/**` | Admin, Doctor |
| `GET` | `/api/bills/**` | Admin, Doctor, Receptionist |
| `POST` | `/api/bills/**` | Admin, Receptionist |
| `PUT /api/bills/*/pay` | Mark as paid | Admin, Doctor, Receptionist |
| `DELETE` | `/api/bills/**` | Admin only |

---

## 📌 Notes on Design

- **User accounts and Doctor profiles are separate.** A doctor's *login* (in `users`) and their *clinical profile* (in `doctors`) are linked only by using the same email — there is no foreign key between them. Always create both when adding a new doctor.
- Role-based visibility on the frontend is driven by a `data-hide-for="ROLE"` attribute pattern, read from the JWT's `role` claim at page load — consistent across every page.

---

## 📄 License

This project is available for educational and portfolio purposes.