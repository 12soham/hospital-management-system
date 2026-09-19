package com.example.hospitalManagement.prescription;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    boolean existsByAppointmentId(Long appointmentId);
}