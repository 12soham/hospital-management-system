package com.example.hospitalManagement.prescription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.example.hospitalManagement.appointment.Appointment;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(message = "Appointment is required")
    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @NotBlank(message = "Diagnosis is required")
    @Column(nullable = false)
    private String diagnosis;

    @NotBlank(message = "Medicines are required")
    @Column(nullable = false, length = 1000)
    private String medicines;

    private String notes;

    private LocalDate prescriptionDate = LocalDate.now();

    public Prescription() {
    }

    public Long getId() {
        return id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getMedicines() {
        return medicines;
    }

    public void setMedicines(String medicines) {
        this.medicines = medicines;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(LocalDate prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }
}
