package com.example.hospitalManagement.billing;

import com.example.hospitalManagement.appointment.Appointment;
import com.example.hospitalManagement.appointment.AppointmentRepository;
import com.example.hospitalManagement.billing.dto.BillRequest;
import com.example.hospitalManagement.billing.dto.BillResponse;
import com.example.hospitalManagement.exception.ResourceNotFoundException;
import com.example.hospitalManagement.patient.Patient;
import com.example.hospitalManagement.patient.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public BillService(
            BillRepository billRepository,
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository
    ) {
        this.billRepository = billRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    public BillResponse saveBill(BillRequest request) {

        Appointment appointment =
                appointmentRepository.findById(request.getAppointmentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appointment not found with id: "
                                                + request.getAppointmentId()
                                )
                        );

        Patient patient =
                patientRepository.findById(request.getPatientId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient not found with id: "
                                                + request.getPatientId()
                                )
                        );

        // Make sure the selected patient belongs to the appointment
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException(
                    "Selected patient does not belong to this appointment"
            );
        }

        // One appointment can have only one bill
        if (billRepository.existsByAppointmentId(
                request.getAppointmentId()
        )) {
            throw new RuntimeException(
                    "Bill already exists for this appointment"
            );
        }

        Bill bill = new Bill();

        bill.setAppointment(appointment);
        bill.setPatient(patient);
        bill.setAmount(request.getAmount());
        bill.setPaymentMethod(request.getPaymentMethod());
        bill.setPaymentStatus("PENDING");
        bill.setBillDate(LocalDate.now());

        Bill savedBill = billRepository.save(bill);

        return mapToResponse(savedBill);
    }

    public List<BillResponse> getAllBills() {

        return billRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BillResponse getBillById(Long id) {

        Bill bill =
                billRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bill not found with id: " + id
                                )
                        );

        return mapToResponse(bill);
    }

    public BillResponse markAsPaid(Long id) {

        Bill bill =
                billRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bill not found with id: " + id
                                )
                        );

        bill.setPaymentStatus("PAID");

        Bill updatedBill =
                billRepository.save(bill);

        return mapToResponse(updatedBill);
    }

    private BillResponse mapToResponse(Bill bill) {

        return new BillResponse(
                bill.getId(),
                bill.getAppointment().getId(),
                bill.getPatient().getId(),
                bill.getPatient().getName(),
                bill.getPatient().getPhone(),
                bill.getAppointment().getDoctor().getName(),
                bill.getAmount(),
                bill.getPaymentStatus(),
                bill.getPaymentMethod(),
                bill.getBillDate()
        );
    }
}