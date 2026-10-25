package com.apexgarage.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class BillCreateRequest {
    @NotNull
    private Long bookingId;

    private BigDecimal taxRate;

    @NotEmpty
    private List<BillItemRequest> items;

    public BillCreateRequest() {}

    public BillCreateRequest(Long bookingId, BigDecimal taxRate, List<BillItemRequest> items) {
        this.bookingId = bookingId;
        this.taxRate = taxRate;
        this.items = items;
    }

    public static BillCreateRequestBuilder builder() {
        return new BillCreateRequestBuilder();
    }

    public static class BillCreateRequestBuilder {
        private Long bookingId;
        private BigDecimal taxRate;
        private List<BillItemRequest> items;

        public BillCreateRequestBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public BillCreateRequestBuilder taxRate(BigDecimal taxRate) { this.taxRate = taxRate; return this; }
        public BillCreateRequestBuilder items(List<BillItemRequest> items) { this.items = items; return this; }

        public BillCreateRequest build() {
            return new BillCreateRequest(bookingId, taxRate, items);
        }
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }

    public List<BillItemRequest> getItems() { return items; }
    public void setItems(List<BillItemRequest> items) { this.items = items; }
}
