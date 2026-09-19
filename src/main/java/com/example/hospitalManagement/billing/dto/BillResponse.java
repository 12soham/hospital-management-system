package com.example.hospitalManagement.billing.dto;

import java.time.LocalDate;

public class BillResponse {

    private Long id;

    private Long appointmentId;

    private Long patientId;

    private String patientName;
    private String patientPhone;

    private String doctorName;

    private Double amount;

    private String paymentStatus;
    private String paymentMethod;

    private LocalDate billDate;


    public BillResponse() {
    }

    public BillResponse(
            Long id,
            Long appointmentId,
            Long patientId,
            String patientName,
            String patientPhone,
            String doctorName,
            Double amount,
            String paymentStatus,
            String paymentMethod,
            LocalDate billDate
    ) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.doctorName = doctorName;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.billDate = billDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
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