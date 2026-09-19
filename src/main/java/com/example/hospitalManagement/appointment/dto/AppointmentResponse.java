package com.example.hospitalManagement.appointment.dto;



import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {

    private Long id;

    private Long patientId;
    private String patientName;
    private String patientPhone;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    private String status;

    private String reason;

    // constructors

    public AppointmentResponse() {
    }

    public AppointmentResponse(
            Long id,
            Long patientId,
            String patientName,
            String patientPhone,
            Long doctorId,
            String doctorName,
            String doctorSpecialization,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            String status,
            String reason
    ) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.reason = reason;
    }
    // getters
    // setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpecialization() {
        return doctorSpecialization;
    }

    public void setDoctorSpecialization(String doctorSpecialization) {
        this.doctorSpecialization = doctorSpecialization;
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