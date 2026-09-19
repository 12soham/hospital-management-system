package com.example.hospitalManagement.patient;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Patient name is required")
    @Column(nullable = false)
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
    @Column(nullable = false, unique = true)
    private String phone;

    private String address;

    // Optional — no @NotBlank, since the Add Patient form
    // does not require it (no red asterisk in the design).
    private String email;
}