package com.example.hospitalManagement.billing;

import com.example.hospitalManagement.billing.dto.BillRequest;
import com.example.hospitalManagement.billing.dto.BillResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // Create bill
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BillResponse createBill(
            @Valid @RequestBody BillRequest request
    ) {
        return billService.saveBill(request);
    }

    // Get all bills
    @GetMapping
    public List<BillResponse> getAllBills() {
        return billService.getAllBills();
    }

    // Get bill by ID
    @GetMapping("/{id}")
    public BillResponse getBillById(
            @PathVariable Long id
    ) {
        return billService.getBillById(id);
    }

    // Mark bill as paid
    @PutMapping("/{id}/pay")
    public BillResponse markBillAsPaid(
            @PathVariable Long id
    ) {
        return billService.markAsPaid(id);
    }
}