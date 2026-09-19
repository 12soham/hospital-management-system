package com.example.hospitalManagement.doctor.dto;


public class DoctorResponse {

    private Long id;
    private String name;
    private String specialization;
    private String phone;
    private String email;
    private String department;
    private Integer experienceYears;
    private Double consultationFee;

    public DoctorResponse() {
    }

    public DoctorResponse(Long id,
                          String name,
                          String specialization,
                          String phone,
                          String email,
                          String department,
                          Integer experienceYears,
                          Double consultationFee) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.phone = phone;
        this.email = email;
        this.department = department;
        this.experienceYears = experienceYears;
        this.consultationFee = consultationFee;
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