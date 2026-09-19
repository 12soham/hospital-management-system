package com.example.hospitalManagement.appointment;

import com.example.hospitalManagement.appointment.dto.AppointmentRequest;
import com.example.hospitalManagement.appointment.dto.AppointmentResponse;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService =
                appointmentService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse bookAppointment(
            @Valid @RequestBody AppointmentRequest request
    ) {

        return appointmentService.saveAppointment(
                request
        );
    }


    // =====================================================
    // GET ALL + STATUS/SEARCH/DATE FILTERS + PAGINATION
    // =====================================================

    @GetMapping
    public Page<AppointmentResponse> getAllAppointments(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "5"
            )
            int size,

            @RequestParam(
                    required = false
            )
            String status,

            @RequestParam(
                    required = false
            )
            String search,

            @RequestParam(
                    required = false
            )
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date

    ) {

        return appointmentService.getAllAppointments(
                page,
                size,
                status,
                search,
                date
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public AppointmentResponse getAppointmentById(
            @PathVariable Long id
    ) {

        return appointmentService.getAppointmentById(
                id
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public AppointmentResponse updateAppointment(

            @PathVariable Long id,

            @Valid
            @RequestBody
            AppointmentRequest request

    ) {

        return appointmentService.updateAppointment(
                id,
                request
        );
    }


    // =====================================================
    // COMPLETE
    // =====================================================

    @PutMapping("/{id}/complete")
    public AppointmentResponse completeAppointment(
            @PathVariable Long id
    ) {

        return appointmentService.completeAppointment(
                id
        );
    }


    // =====================================================
    // CANCEL
    // =====================================================

    @PutMapping("/{id}/cancel")
    public AppointmentResponse cancelAppointment(
            @PathVariable Long id
    ) {

        return appointmentService.cancelAppointment(
                id
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAppointment(
            @PathVariable Long id
    ) {

        appointmentService.deleteAppointment(id);
    }
}