package com.example.hospitalManagement.billing;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {

    boolean existsByAppointmentId(Long appointmentId);
}