package com.apexgarage.controller;

import com.apexgarage.dto.BillCreateRequest;
import com.apexgarage.entity.Bill;
import com.apexgarage.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bills")
public class BillingController {

    private final BillService billService;

    public BillingController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Bill> getBillByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(billService.getBillByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@Valid @RequestBody BillCreateRequest request) {
        return ResponseEntity.ok(billService.createBill(request));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Bill> payBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.payBill(id));
    }
}
