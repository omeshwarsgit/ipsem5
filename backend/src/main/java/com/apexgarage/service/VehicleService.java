package com.apexgarage.service;

import com.apexgarage.dto.VehicleRequest;
import com.apexgarage.entity.User;
import com.apexgarage.entity.Vehicle;
import com.apexgarage.repository.UserRepository;
import com.apexgarage.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public List<Vehicle> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByOwnerId(userId);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Transactional
    public Vehicle addVehicle(VehicleRequest request, Long fallbackOwnerId) {
        Long ownerId = request.getOwnerId() != null ? request.getOwnerId() : fallbackOwnerId;
        if (ownerId == null) {
            throw new IllegalArgumentException("Vehicle owner ID must be provided");
        }

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + ownerId));

        vehicleRepository.findByLicensePlate(request.getLicensePlate().toUpperCase().trim())
                .ifPresent(v -> {
                    throw new IllegalArgumentException("Vehicle with license plate already exists: " + request.getLicensePlate());
                });

        Vehicle vehicle = Vehicle.builder()
                .owner(owner)
                .make(request.getMake().trim())
                .model(request.getModel().trim())
                .year(request.getYear())
                .licensePlate(request.getLicensePlate().toUpperCase().trim())
                .build();

        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new IllegalArgumentException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }
}
