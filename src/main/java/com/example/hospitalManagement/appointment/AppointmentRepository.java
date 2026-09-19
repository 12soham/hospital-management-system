package com.example.hospitalManagement.appointment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Kept for backward compatibility — no longer called by
    // AppointmentService (which now uses searchAppointments below
    // to combine status with the new search/date filters), but left
    // here in case anything else in the codebase still uses it.
    Page<Appointment> findByStatus(
            String status,
            Pageable pageable
    );


    // Each filter is optional: passing null for a parameter skips
    // that condition entirely (the "(:param IS NULL OR ...)" pattern).
    // search matches against patient name, doctor name, and reason.
    @Query(
            "SELECT a FROM Appointment a " +
                    "WHERE (:status IS NULL OR a.status = :status) " +
                    "AND (:date IS NULL OR a.appointmentDate = :date) " +
                    "AND (" +
                    "     :search IS NULL " +
                    "     OR LOWER(a.patient.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "     OR LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "     OR LOWER(a.reason) LIKE LOWER(CONCAT('%', :search, '%'))" +
                    ")"
    )
    Page<Appointment> searchAppointments(
            @Param("status") String status,
            @Param("date") LocalDate date,
            @Param("search") String search,
            Pageable pageable
    );
}