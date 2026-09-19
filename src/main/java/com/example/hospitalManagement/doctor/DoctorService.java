package com.example.hospitalManagement.doctor;

import com.example.hospitalManagement.doctor.dto.DoctorRequest;
import com.example.hospitalManagement.doctor.dto.DoctorResponse;
import com.example.hospitalManagement.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // Add doctor
    public DoctorResponse saveDoctor(
            DoctorRequest request
    ) {

        Doctor doctor = new Doctor();

        doctor.setName(request.getName());
        doctor.setSpecialization(
                request.getSpecialization()
        );
        doctor.setPhone(request.getPhone());
        doctor.setEmail(request.getEmail());
        doctor.setDepartment(request.getDepartment());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setConsultationFee(request.getConsultationFee());

        Doctor savedDoctor =
                doctorRepository.save(doctor);

        return mapToResponse(savedDoctor);
    }

    // Get all doctors
    public List<DoctorResponse> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get doctor by ID
    public DoctorResponse getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor not found with id: " + id
                        )
                );

        return mapToResponse(doctor);
    }

    // Entity -> DTO
    private DoctorResponse mapToResponse(
            Doctor doctor
    ) {

        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getPhone(),
                doctor.getEmail(),
                doctor.getDepartment(),
                doctor.getExperienceYears(),
                doctor.getConsultationFee()
        );
    }

    public DoctorResponse updateDoctor(
            Long id,
            DoctorRequest request
    ) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor not found with id: " + id
                        )
                );

        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setPhone(request.getPhone());
        doctor.setEmail(request.getEmail());
        doctor.setDepartment(request.getDepartment());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setConsultationFee(request.getConsultationFee());

        Doctor updatedDoctor =
                doctorRepository.save(doctor);

        return mapToResponse(updatedDoctor);
    }

    public void deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor not found with id: " + id
                        )
                );

        doctorRepository.delete(doctor);
    }
}