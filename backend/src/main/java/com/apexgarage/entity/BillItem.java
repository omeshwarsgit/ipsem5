package com.apexgarage.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bill_items")
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    @JsonBackReference
    private Bill bill;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillItemType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    public BillItem() {}

    public BillItem(Long id, Bill bill, String description, BillItemType type, Integer quantity,
                    BigDecimal unitPrice, BigDecimal totalPrice) {
        this.id = id;
        this.bill = bill;
        this.description = description;
        this.type = type;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public static BillItemBuilder builder() {
        return new BillItemBuilder();
    }

    public static class BillItemBuilder {
        private Long id;
        private Bill bill;
        private String description;
        private BillItemType type;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public BillItemBuilder id(Long id) { this.id = id; return this; }
        public BillItemBuilder bill(Bill bill) { this.bill = bill; return this; }
        public BillItemBuilder description(String description) { this.description = description; return this; }
        public BillItemBuilder type(BillItemType type) { this.type = type; return this; }
        public BillItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public BillItemBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public BillItemBuilder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }

        public BillItem build() {
            return new BillItem(id, bill, description, type, quantity, unitPrice, totalPrice);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Bill getBill() { return bill; }
    public void setBill(Bill bill) { this.bill = bill; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BillItemType getType() { return type; }
    public void setType(BillItemType type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
