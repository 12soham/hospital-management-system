package com.example.hospitalManagement.appointment;

import com.example.hospitalManagement.appointment.dto.AppointmentRequest;
import com.example.hospitalManagement.appointment.dto.AppointmentResponse;
import com.example.hospitalManagement.doctor.Doctor;
import com.example.hospitalManagement.doctor.DoctorRepository;
import com.example.hospitalManagement.exception.ResourceNotFoundException;
import com.example.hospitalManagement.patient.Patient;
import com.example.hospitalManagement.patient.PatientRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // =====================================================
    // CREATE APPOINTMENT
    // =====================================================

    public AppointmentResponse saveAppointment(
            AppointmentRequest request
    ) {

        Patient patient =
                patientRepository.findById(
                        request.getPatientId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found with id: "
                                        + request.getPatientId()
                        )
                );

        Doctor doctor =
                doctorRepository.findById(
                        request.getDoctorId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor not found with id: "
                                        + request.getDoctorId()
                        )
                );

        Appointment appointment =
                new Appointment();

        appointment.setPatient(patient);

        appointment.setDoctor(doctor);

        appointment.setAppointmentDate(
                request.getAppointmentDate()
        );

        appointment.setAppointmentTime(
                request.getAppointmentTime()
        );

        appointment.setReason(
                request.getReason()
        );

        // New appointments are BOOKED
        appointment.setStatus("BOOKED");

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return mapToResponse(savedAppointment);
    }


    // =====================================================
    // GET APPOINTMENTS WITH STATUS + SEARCH + DATE FILTERS
    // + PAGINATION
    // =====================================================

    public Page<AppointmentResponse> getAllAppointments(
            int page,
            int size,
            String status,
            String search,
            LocalDate date
    ) {

        Pageable pageable =
                PageRequest.of(page, size);

        String statusParam =
                (status == null || status.isBlank())
                        ? null
                        : status;

        String searchParam =
                (search == null || search.isBlank())
                        ? null
                        : search;

        Page<Appointment> appointments =
                appointmentRepository.searchAppointments(
                        statusParam,
                        date,
                        searchParam,
                        pageable
                );

        return appointments.map(
                this::mapToResponse
        );
    }


    // =====================================================
    // GET APPOINTMENT BY ID
    // =====================================================

    public AppointmentResponse getAppointmentById(
            Long id
    ) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(appointment);
    }


    // =====================================================
    // UPDATE APPOINTMENT
    // =====================================================

    public AppointmentResponse updateAppointment(
            Long id,
            AppointmentRequest request
    ) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + id
                                )
                        );

        // Don't allow editing cancelled appointments
        if ("CANCELLED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Cancelled appointment cannot be edited."
            );
        }

        Patient patient =
                patientRepository.findById(
                        request.getPatientId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found with id: "
                                        + request.getPatientId()
                        )
                );

        Doctor doctor =
                doctorRepository.findById(
                        request.getDoctorId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor not found with id: "
                                        + request.getDoctorId()
                        )
                );

        appointment.setPatient(patient);

        appointment.setDoctor(doctor);

        appointment.setAppointmentDate(
                request.getAppointmentDate()
        );

        appointment.setAppointmentTime(
                request.getAppointmentTime()
        );

        appointment.setReason(
                request.getReason()
        );

        return mapToResponse(
                appointmentRepository.save(appointment)
        );
    }


    // =====================================================
    // COMPLETE APPOINTMENT
    // =====================================================

    public AppointmentResponse completeAppointment(
            Long id
    ) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + id
                                )
                        );

        if ("CANCELLED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Cancelled appointment cannot be completed."
            );
        }

        if ("COMPLETED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Appointment is already completed."
            );
        }

        appointment.setStatus("COMPLETED");

        return mapToResponse(
                appointmentRepository.save(appointment)
        );
    }


    // =====================================================
    // CANCEL APPOINTMENT
    // =====================================================

    public AppointmentResponse cancelAppointment(
            Long id
    ) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + id
                                )
                        );

        if ("COMPLETED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Completed appointment cannot be cancelled."
            );
        }

        if ("CANCELLED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Appointment is already cancelled."
            );
        }

        appointment.setStatus("CANCELLED");

        return mapToResponse(
                appointmentRepository.save(appointment)
        );
    }


    // =====================================================
    // DELETE APPOINTMENT
    // =====================================================

    public void deleteAppointment(Long id) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + id
                                )
                        );

        appointmentRepository.delete(appointment);
    }


    // =====================================================
    // MAP ENTITY → RESPONSE DTO
    // =====================================================

    private AppointmentResponse mapToResponse(
            Appointment appointment
    ) {

        AppointmentResponse response =
                new AppointmentResponse();

        response.setId(
                appointment.getId()
        );

        response.setPatientId(
                appointment.getPatient().getId()
        );

        response.setPatientName(
                appointment.getPatient().getName()
        );

        response.setPatientPhone(
                appointment.getPatient().getPhone()
        );

        response.setDoctorId(
                appointment.getDoctor().getId()
        );

        response.setDoctorName(
                appointment.getDoctor().getName()
        );

        response.setDoctorSpecialization(
                appointment.getDoctor().getSpecialization()
        );

        response.setAppointmentDate(
                appointment.getAppointmentDate()
        );

        response.setAppointmentTime(
                appointment.getAppointmentTime()
        );

        response.setStatus(
                appointment.getStatus()
        );

        response.setReason(
                appointment.getReason()
        );

        return response;
    }
}