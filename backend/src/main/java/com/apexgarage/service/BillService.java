package com.apexgarage.service;

import com.apexgarage.dto.BillCreateRequest;
import com.apexgarage.dto.BillItemRequest;
import com.apexgarage.entity.*;
import com.apexgarage.repository.BillRepository;
import com.apexgarage.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final BookingRepository bookingRepository;

    public BillService(BillRepository billRepository, BookingRepository bookingRepository) {
        this.billRepository = billRepository;
        this.bookingRepository = bookingRepository;
    }

    public Bill getBillByBookingId(Long bookingId) {
        return billRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("No bill found for booking id: " + bookingId));
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with id: " + id));
    }

    @Transactional
    public Bill createBill(BillCreateRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + request.getBookingId()));

        billRepository.findByBookingId(request.getBookingId())
                .ifPresent(billRepository::delete);

        BigDecimal laborTotal = BigDecimal.ZERO;
        BigDecimal partsTotal = BigDecimal.ZERO;

        Bill bill = Bill.builder()
                .booking(booking)
                .paymentStatus(PaymentStatus.UNPAID)
                .items(new ArrayList<>())
                .build();

        for (BillItemRequest itemReq : request.getItems()) {
            BigDecimal lineTotal = itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            if (itemReq.getType() == BillItemType.LABOR) {
                laborTotal = laborTotal.add(lineTotal);
            } else {
                partsTotal = partsTotal.add(lineTotal);
            }

            BillItem item = BillItem.builder()
                    .bill(bill)
                    .description(itemReq.getDescription())
                    .type(itemReq.getType())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .totalPrice(lineTotal)
                    .build();

            bill.addItem(item);
        }

        BigDecimal subtotal = laborTotal.add(partsTotal);
        BigDecimal effectiveTaxRate = request.getTaxRate() != null ? request.getTaxRate() : new BigDecimal("0.085");
        BigDecimal tax = subtotal.multiply(effectiveTaxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = subtotal.add(tax).setScale(2, RoundingMode.HALF_UP);

        bill.setTotalLaborCost(laborTotal.setScale(2, RoundingMode.HALF_UP));
        bill.setTotalPartsCost(partsTotal.setScale(2, RoundingMode.HALF_UP));
        bill.setTax(tax);
        bill.setGrandTotal(grandTotal);

        return billRepository.save(bill);
    }

    @Transactional
    public Bill payBill(Long id) {
        Bill bill = getBillById(id);
        bill.setPaymentStatus(PaymentStatus.PAID);
        Booking booking = bill.getBooking();
        if (booking.getStatus() == BookingStatus.READY_FOR_PICKUP) {
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
        }
        return billRepository.save(bill);
    }
}
