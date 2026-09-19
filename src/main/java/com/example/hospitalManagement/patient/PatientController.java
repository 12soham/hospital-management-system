package com.example.hospitalManagement.patient;

import com.example.hospitalManagement.patient.dto.PatientRequest;
import com.example.hospitalManagement.patient.dto.PatientResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Add patient
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse addPatient(
            @Valid @RequestBody PatientRequest request
    ) {
        return patientService.savePatient(request);
    }

    // Get all patients
    @GetMapping
    public List<PatientResponse> getAllPatients() {
        return patientService.getAllPatients();
    }

    // Get patient by ID
    @GetMapping("/{id}")
    public PatientResponse getPatientById(
            @PathVariable Long id
    ) {
        return patientService.getPatientById(id);
    }
    @PutMapping("/{id}")
    public PatientResponse updatePatient(
            @PathVariable Long id,
            @RequestBody PatientRequest request
    ) {
        return patientService.updatePatient(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(
            @PathVariable Long id
    ) {
        patientService.deletePatient(id);
    }
}