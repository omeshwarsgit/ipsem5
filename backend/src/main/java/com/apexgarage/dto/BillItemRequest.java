package com.apexgarage.dto;

import com.apexgarage.entity.BillItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BillItemRequest {
    @NotBlank
    private String description;

    @NotNull
    private BillItemType type;

    @NotNull
    private Integer quantity;

    @NotNull
    private BigDecimal unitPrice;

    public BillItemRequest() {}

    public BillItemRequest(String description, BillItemType type, Integer quantity, BigDecimal unitPrice) {
        this.description = description;
        this.type = type;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static BillItemRequestBuilder builder() {
        return new BillItemRequestBuilder();
    }

    public static class BillItemRequestBuilder {
        private String description;
        private BillItemType type;
        private Integer quantity;
        private BigDecimal unitPrice;

        public BillItemRequestBuilder description(String description) { this.description = description; return this; }
        public BillItemRequestBuilder type(BillItemType type) { this.type = type; return this; }
        public BillItemRequestBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public BillItemRequestBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }

        public BillItemRequest build() {
            return new BillItemRequest(description, type, quantity, unitPrice);
        }
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BillItemType getType() { return type; }
    public void setType(BillItemType type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
