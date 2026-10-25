package com.apexgarage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleRequest {
    private Long ownerId;

    @NotBlank
    private String make;

    @NotBlank
    private String model;

    @NotNull
    private Integer year;

    @NotBlank
    private String licensePlate;

    public VehicleRequest() {}

    public VehicleRequest(Long ownerId, String make, String model, Integer year, String licensePlate) {
        this.ownerId = ownerId;
        this.make = make;
        this.model = model;
        this.year = year;
        this.licensePlate = licensePlate;
    }

    public static VehicleRequestBuilder builder() {
        return new VehicleRequestBuilder();
    }

    public static class VehicleRequestBuilder {
        private Long ownerId;
        private String make;
        private String model;
        private Integer year;
        private String licensePlate;

        public VehicleRequestBuilder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public VehicleRequestBuilder make(String make) { this.make = make; return this; }
        public VehicleRequestBuilder model(String model) { this.model = model; return this; }
        public VehicleRequestBuilder year(Integer year) { this.year = year; return this; }
        public VehicleRequestBuilder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }

        public VehicleRequest build() {
            return new VehicleRequest(ownerId, make, model, year, licensePlate);
        }
    }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
}
