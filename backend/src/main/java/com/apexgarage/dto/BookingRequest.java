package com.apexgarage.dto;

import com.apexgarage.entity.ServiceType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class BookingRequest {
    @NotNull
    private Long customerId;

    @NotNull
    private Long vehicleId;

    @NotNull
    private ServiceType serviceType;

    @NotNull
    private LocalDate preferredDate;

    @NotNull
    private String timeSlot;

    private String notes;

    public BookingRequest() {}

    public BookingRequest(Long customerId, Long vehicleId, ServiceType serviceType, LocalDate preferredDate, String timeSlot, String notes) {
        this.customerId = customerId;
        this.vehicleId = vehicleId;
        this.serviceType = serviceType;
        this.preferredDate = preferredDate;
        this.timeSlot = timeSlot;
        this.notes = notes;
    }

    public static BookingRequestBuilder builder() {
        return new BookingRequestBuilder();
    }

    public static class BookingRequestBuilder {
        private Long customerId;
        private Long vehicleId;
        private ServiceType serviceType;
        private LocalDate preferredDate;
        private String timeSlot;
        private String notes;

        public BookingRequestBuilder customerId(Long customerId) { this.customerId = customerId; return this; }
        public BookingRequestBuilder vehicleId(Long vehicleId) { this.vehicleId = vehicleId; return this; }
        public BookingRequestBuilder serviceType(ServiceType serviceType) { this.serviceType = serviceType; return this; }
        public BookingRequestBuilder preferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; return this; }
        public BookingRequestBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public BookingRequestBuilder notes(String notes) { this.notes = notes; return this; }

        public BookingRequest build() {
            return new BookingRequest(customerId, vehicleId, serviceType, preferredDate, timeSlot, notes);
        }
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
