package com.apexgarage.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(name = "total_labor_cost", precision = 12, scale = 2)
    private BigDecimal totalLaborCost;

    @Column(name = "total_parts_cost", precision = 12, scale = 2)
    private BigDecimal totalPartsCost;

    @Column(precision = 12, scale = 2)
    private BigDecimal tax;

    @Column(name = "grand_total", precision = 12, scale = 2, nullable = false)
    private BigDecimal grandTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<BillItem> items = new ArrayList<>();

    public Bill() {}

    public Bill(Long id, Booking booking, BigDecimal totalLaborCost, BigDecimal totalPartsCost, BigDecimal tax,
                BigDecimal grandTotal, PaymentStatus paymentStatus, LocalDateTime generatedAt, List<BillItem> items) {
        this.id = id;
        this.booking = booking;
        this.totalLaborCost = totalLaborCost;
        this.totalPartsCost = totalPartsCost;
        this.tax = tax;
        this.grandTotal = grandTotal;
        this.paymentStatus = paymentStatus;
        this.generatedAt = generatedAt;
        this.items = items != null ? items : new ArrayList<>();
    }

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.UNPAID;
        }
    }

    public void addItem(BillItem item) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.add(item);
        item.setBill(this);
    }

    public static BillBuilder builder() {
        return new BillBuilder();
    }

    public static class BillBuilder {
        private Long id;
        private Booking booking;
        private BigDecimal totalLaborCost;
        private BigDecimal totalPartsCost;
        private BigDecimal tax;
        private BigDecimal grandTotal;
        private PaymentStatus paymentStatus;
        private LocalDateTime generatedAt;
        private List<BillItem> items = new ArrayList<>();

        public BillBuilder id(Long id) { this.id = id; return this; }
        public BillBuilder booking(Booking booking) { this.booking = booking; return this; }
        public BillBuilder totalLaborCost(BigDecimal totalLaborCost) { this.totalLaborCost = totalLaborCost; return this; }
        public BillBuilder totalPartsCost(BigDecimal totalPartsCost) { this.totalPartsCost = totalPartsCost; return this; }
        public BillBuilder tax(BigDecimal tax) { this.tax = tax; return this; }
        public BillBuilder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public BillBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public BillBuilder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }
        public BillBuilder items(List<BillItem> items) { this.items = items; return this; }

        public Bill build() {
            return new Bill(id, booking, totalLaborCost, totalPartsCost, tax, grandTotal, paymentStatus, generatedAt, items);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public BigDecimal getTotalLaborCost() { return totalLaborCost; }
    public void setTotalLaborCost(BigDecimal totalLaborCost) { this.totalLaborCost = totalLaborCost; }

    public BigDecimal getTotalPartsCost() { return totalPartsCost; }
    public void setTotalPartsCost(BigDecimal totalPartsCost) { this.totalPartsCost = totalPartsCost; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public List<BillItem> getItems() { return items; }
    public void setItems(List<BillItem> items) { this.items = items; }
}
