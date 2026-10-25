package com.apexgarage.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(length = 2000)
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Booking() {}

    public Booking(Long id, User customer, Vehicle vehicle, ServiceType serviceType, LocalDate preferredDate,
                   String timeSlot, BookingStatus status, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.customer = customer;
        this.vehicle = vehicle;
        this.serviceType = serviceType;
        this.preferredDate = preferredDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = BookingStatus.PENDING;
        }
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private Long id;
        private User customer;
        private Vehicle vehicle;
        private ServiceType serviceType;
        private LocalDate preferredDate;
        private String timeSlot;
        private BookingStatus status;
        private String notes;
        private LocalDateTime createdAt;

        public BookingBuilder id(Long id) { this.id = id; return this; }
        public BookingBuilder customer(User customer) { this.customer = customer; return this; }
        public BookingBuilder vehicle(Vehicle vehicle) { this.vehicle = vehicle; return this; }
        public BookingBuilder serviceType(ServiceType serviceType) { this.serviceType = serviceType; return this; }
        public BookingBuilder preferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; return this; }
        public BookingBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public BookingBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingBuilder notes(String notes) { this.notes = notes; return this; }
        public BookingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Booking build() {
            return new Booking(id, customer, vehicle, serviceType, preferredDate, timeSlot, status, notes, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
