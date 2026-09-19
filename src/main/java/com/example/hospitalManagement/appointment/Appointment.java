package com.example.hospitalManagement.appointment;

import jakarta.validation.constraints.NotNull;
import com.example.hospitalManagement.doctor.Doctor;
import com.example.hospitalManagement.patient.Patient;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Patient is required")
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @NotNull(message = "Doctor is required")
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @NotNull(message = "Appointment date is required")
    @Column(nullable = false)
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    @Column(nullable = false)
    private LocalTime appointmentTime;

    @Column(nullable = false)
    private String status = "BOOKED";

    // Intentionally nullable at the DB level (no nullable = false) so
    // adding this column doesn't fail on existing appointment rows
    // that predate it. Required-ness is enforced in AppointmentRequest
    // (@NotBlank) for new submissions instead.
    private String reason;

    public Appointment() {
    }

    public Long getId() {
        return id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}