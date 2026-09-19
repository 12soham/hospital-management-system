package com.example.hospitalManagement.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PageController {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboardPage() {
        return "dashboard";
    }

    @GetMapping("/patients")
    public String patientListPage() {
        return "patient-list";
    }

    @GetMapping("/patients/add")
    public String patientFormPage() {
        return "patient-form";
    }

    @GetMapping("/patients/edit/{id}")
    public String editPatientPage(@PathVariable Long id) {
        return "patient-form";
    }

    @GetMapping("/doctors")
    public String doctorsPage() {
        return "doctors";
    }

    @GetMapping("/appointments")
    public String appointmentsPage() {
        return "appointments";
    }

    // Prescription Page
    @GetMapping("/prescriptions")
    public String prescriptionsPage() {
        return "prescriptions";
    }
    @GetMapping("/billing")
    public String billingPage() {
        return "billing";
    }

    // Staff Accounts Page (Admin only)
    @GetMapping("/staff")
    public String staffPage() {
        return "staff";
    }
}