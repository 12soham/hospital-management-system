package com.example.hospitalManagement.patient.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class PatientRequest {

    @NotBlank(message = "Patient name is required")
    private String name;

    @Min(value = 1, message = "Age must be at least 1")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    private String phone;

    private String address;

    // Optional field — intentionally no @NotBlank/@Email validation
    // so the form can be submitted with it left blank.
    private String email;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}