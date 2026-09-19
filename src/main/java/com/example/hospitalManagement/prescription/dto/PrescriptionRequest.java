package com.example.hospitalManagement.prescription.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PrescriptionRequest {

    @NotNull(message = "Appointment is required")
    private Long appointmentId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    @NotBlank(message = "Medicines are required")
    private String medicines;

    private String notes;

    public PrescriptionRequest() {
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
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
}
