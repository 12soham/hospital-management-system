package com.example.hospitalManagement.doctor;

import com.example.hospitalManagement.doctor.dto.DoctorRequest;
import com.example.hospitalManagement.doctor.dto.DoctorResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // Add doctor
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoctorResponse addDoctor(
            @Valid @RequestBody DoctorRequest request
    ) {
        return doctorService.saveDoctor(request);
    }

    // Get all doctors
    @GetMapping
    public List<DoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // Get doctor by ID
    @GetMapping("/{id}")
    public DoctorResponse getDoctorById(
            @PathVariable Long id
    ) {
        return doctorService.getDoctorById(id);
    }@PutMapping("/{id}")
    public DoctorResponse updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorRequest request
    ) {
        return doctorService.updateDoctor(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(
            @PathVariable Long id
    ) {
        doctorService.deleteDoctor(id);
    }

}