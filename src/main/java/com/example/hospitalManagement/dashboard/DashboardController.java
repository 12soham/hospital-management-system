package com.example.hospitalManagement.dashboard;


import com.example.hospitalManagement.patient.PatientRepository;
import com.example.hospitalManagement.doctor.DoctorRepository;
import com.example.hospitalManagement.appointment.AppointmentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/api/dashboard/stats")
    public DashboardResponse getStats() {

        long patientCount = patientRepository.count();
        long doctorCount = doctorRepository.count();
        long appointmentCount = appointmentRepository.count();

        return new DashboardResponse(
                patientCount,
                doctorCount,
                appointmentCount
        );
    }
}