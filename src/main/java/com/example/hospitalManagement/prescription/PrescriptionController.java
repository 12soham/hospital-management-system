package com.example.hospitalManagement.prescription;

import com.example.hospitalManagement.prescription.dto.PrescriptionRequest;
import com.example.hospitalManagement.prescription.dto.PrescriptionResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(
            PrescriptionService prescriptionService
    ) {
        this.prescriptionService = prescriptionService;
    }

    // Create prescription
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PrescriptionResponse createPrescription(
            @Valid @RequestBody PrescriptionRequest request
    ) {
        return prescriptionService.savePrescription(request);
    }

    // Get all prescriptions
    @GetMapping
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    // Get prescription by ID
    @GetMapping("/{id}")
    public PrescriptionResponse getPrescriptionById(
            @PathVariable Long id
    ) {
        return prescriptionService.getPrescriptionById(id);
    }


    @PutMapping("/{id}")
    public PrescriptionResponse updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionRequest request
    ) {
        return prescriptionService.updatePrescription(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    public void deletePrescription(
            @PathVariable Long id
    ) {
        prescriptionService.deletePrescription(id);
    }
}