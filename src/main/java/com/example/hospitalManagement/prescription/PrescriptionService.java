package com.example.hospitalManagement.prescription;

import com.example.hospitalManagement.appointment.Appointment;
import com.example.hospitalManagement.appointment.AppointmentRepository;
import com.example.hospitalManagement.exception.ResourceNotFoundException;
import com.example.hospitalManagement.prescription.dto.PrescriptionRequest;
import com.example.hospitalManagement.prescription.dto.PrescriptionResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public PrescriptionResponse savePrescription(
            PrescriptionRequest request
    ) {

        Appointment appointment =
                appointmentRepository.findById(
                                request.getAppointmentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + request.getAppointmentId()
                                )
                        );

        if (prescriptionRepository.existsByAppointmentId(
                request.getAppointmentId()
        )) {

            throw new RuntimeException(
                    "Prescription already exists for this appointment"
            );
        }

        Prescription prescription = new Prescription();

        prescription.setAppointment(appointment);
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setMedicines(request.getMedicines());
        prescription.setNotes(request.getNotes());
        prescription.setPrescriptionDate(LocalDate.now());

        Prescription savedPrescription =
                prescriptionRepository.save(prescription);

        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);

        return mapToResponse(savedPrescription);
    }

    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PrescriptionResponse getPrescriptionById(
            Long id
    ) {

        Prescription prescription =
                prescriptionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Prescription not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(prescription);
    }

    private PrescriptionResponse mapToResponse(
            Prescription prescription
    ) {

        return new PrescriptionResponse(
                prescription.getId(),
                prescription.getAppointment().getId(),
                prescription.getAppointment()
                        .getPatient()
                        .getName(),
                prescription.getAppointment()
                        .getPatient()
                        .getAge(),
                prescription.getAppointment()
                        .getPatient()
                        .getGender(),
                prescription.getAppointment()
                        .getDoctor()
                        .getName(),
                prescription.getAppointment()
                        .getDoctor()
                        .getSpecialization(),
                prescription.getDiagnosis(),
                prescription.getMedicines(),
                prescription.getNotes(),
                prescription.getPrescriptionDate()
        );
    }

    public PrescriptionResponse updatePrescription(
            Long id,
            PrescriptionRequest request
    ) {

        Prescription prescription =
                prescriptionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Prescription not found"
                                ));

        prescription.setDiagnosis(
                request.getDiagnosis()
        );

        prescription.setMedicines(
                request.getMedicines()
        );

        prescription.setNotes(
                request.getNotes()
        );

        return mapToResponse(
                prescriptionRepository.save(
                        prescription
                )
        );
    }

    public void deletePrescription(Long id) {

        Prescription prescription =
                prescriptionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Prescription not found"
                                ));

        prescriptionRepository.delete(prescription);
    }
}