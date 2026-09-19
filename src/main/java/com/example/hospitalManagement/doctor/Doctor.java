package com.example.hospitalManagement.doctor;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Doctor name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Specialization is required")
    @Column(nullable = false)
    private String specialization;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    @Column(nullable = false, unique = true)
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    @Column(nullable = false)
    private Integer experienceYears;

    @NotNull(message = "Consultation fee is required")
    @Positive(message = "Consultation fee must be greater than 0")
    @Column(nullable = false)
    private Double consultationFee;

    public Doctor() {
    }

    // Original 5-arg constructor kept as-is for backward compatibility
    // with any existing callers — new fields default to null through
    // it and are only set via the setters below (as the service layer
    // already does).
    public Doctor(Long id, String name, String specialization, String phone, String email) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.phone = phone;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }
}