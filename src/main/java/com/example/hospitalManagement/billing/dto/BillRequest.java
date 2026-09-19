package com.example.hospitalManagement.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BillRequest {

    @NotNull(message = "Appointment is required")
    @Positive(message = "Appointment ID must be greater than 0")
    private Long appointmentId;

    @NotNull(message = "Patient is required")
    @Positive(message = "Patient ID must be greater than 0")
    private Long patientId;

    @NotNull(message = "Bill amount is required")
    @Positive(message = "Bill amount must be greater than 0")
    private Double amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    public BillRequest() {
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}