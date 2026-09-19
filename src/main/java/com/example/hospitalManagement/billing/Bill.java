package com.example.hospitalManagement.billing;

import com.example.hospitalManagement.appointment.Appointment;
import com.example.hospitalManagement.patient.Patient;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Appointment is required")
    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @NotNull(message = "Patient is required")
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @NotNull(message = "Bill amount is required")
    @Positive(message = "Bill amount must be greater than 0")
    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentStatus = "PENDING";

    // Intentionally nullable at the DB level (no nullable = false) so
    // adding this column doesn't fail on existing bill rows that
    // predate it. Required-ness is enforced in BillRequest (@NotBlank)
    // for new submissions instead.
    private String paymentMethod;

    @Column(nullable = false)
    private LocalDate billDate = LocalDate.now();

    public Bill() {
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }
}