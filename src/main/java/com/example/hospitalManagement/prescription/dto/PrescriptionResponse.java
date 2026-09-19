package com.example.hospitalManagement.prescription.dto;

import java.time.LocalDate;

public class PrescriptionResponse {

    private Long id;

    private Long appointmentId;

    private String patientName;
    private Integer patientAge;
    private String patientGender;

    private String doctorName;
    private String doctorSpecialization;

    private String diagnosis;

    private String medicines;

    private String notes;

    private LocalDate prescriptionDate;

    public PrescriptionResponse() {
    }

    public PrescriptionResponse(
            Long id,
            Long appointmentId,
            String patientName,
            Integer patientAge,
            String patientGender,
            String doctorName,
            String doctorSpecialization,
            String diagnosis,
            String medicines,
            String notes,
            LocalDate prescriptionDate
    ) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.patientName = patientName;
        this.patientAge = patientAge;
        this.patientGender = patientGender;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.diagnosis = diagnosis;
        this.medicines = medicines;
        this.notes = notes;
        this.prescriptionDate = prescriptionDate;
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

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Integer getPatientAge() {
        return patientAge;
    }

    public void setPatientAge(Integer patientAge) {
        this.patientAge = patientAge;
    }

    public String getPatientGender() {
        return patientGender;
    }

    public void setPatientGender(String patientGender) {
        this.patientGender = patientGender;
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