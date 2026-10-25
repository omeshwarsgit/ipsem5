package com.apexgarage.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(name = "vehicle_year", nullable = false)
    private Integer year;

    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    public Vehicle() {}

    public Vehicle(Long id, User owner, String make, String model, Integer year, String licensePlate) {
        this.id = id;
        this.owner = owner;
        this.make = make;
        this.model = model;
        this.year = year;
        this.licensePlate = licensePlate;
    }

    public static VehicleBuilder builder() {
        return new VehicleBuilder();
    }

    public static class VehicleBuilder {
        private Long id;
        private User owner;
        private String make;
        private String model;
        private Integer year;
        private String licensePlate;

        public VehicleBuilder id(Long id) { this.id = id; return this; }
        public VehicleBuilder owner(User owner) { this.owner = owner; return this; }
        public VehicleBuilder make(String make) { this.make = make; return this; }
        public VehicleBuilder model(String model) { this.model = model; return this; }
        public VehicleBuilder year(Integer year) { this.year = year; return this; }
        public VehicleBuilder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }

        public Vehicle build() {
            return new Vehicle(id, owner, make, model, year, licensePlate);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
}
