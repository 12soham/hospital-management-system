package com.example.hospitalManagement.patient;

import com.example.hospitalManagement.exception.ResourceNotFoundException;
import com.example.hospitalManagement.patient.dto.PatientRequest;
import com.example.hospitalManagement.patient.dto.PatientResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Add patient
    public PatientResponse savePatient(PatientRequest request) {

        Patient patient = new Patient();

        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setEmail(request.getEmail());

        Patient savedPatient = patientRepository.save(patient);

        return mapToResponse(savedPatient);
    }

    // Get all patients
    public List<PatientResponse> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get patient by ID
    public PatientResponse getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found with id: " + id
                        )
                );

        return mapToResponse(patient);
    }

    // Update patient
    public PatientResponse updatePatient(
            Long id,
            PatientRequest request
    ) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found with id: " + id
                        )
                );

        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setEmail(request.getEmail());

        Patient updatedPatient = patientRepository.save(patient);

        return mapToResponse(updatedPatient);
    }

    // Delete patient
    public void deletePatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found with id: " + id
                        )
                );

        patientRepository.delete(patient);
    }

    // Entity -> Response DTO
    private PatientResponse mapToResponse(Patient patient) {

        return new PatientResponse(
                patient.getId(),
                patient.getName(),
                patient.getAge(),
                patient.getGender(),
                patient.getPhone(),
                patient.getAddress(),
                patient.getEmail()
        );
    }
}