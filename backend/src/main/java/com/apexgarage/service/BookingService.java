package com.apexgarage.service;

import com.apexgarage.dto.BookingRequest;
import com.apexgarage.entity.Booking;
import com.apexgarage.entity.BookingStatus;
import com.apexgarage.entity.User;
import com.apexgarage.entity.Vehicle;
import com.apexgarage.repository.BookingRepository;
import com.apexgarage.repository.UserRepository;
import com.apexgarage.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + request.getCustomerId()));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with id: " + request.getVehicleId()));

        Booking booking = Booking.builder()
                .customer(customer)
                .vehicle(vehicle)
                .serviceType(request.getServiceType())
                .preferredDate(request.getPreferredDate())
                .timeSlot(request.getTimeSlot())
                .status(BookingStatus.CONFIRMED)
                .notes(request.getNotes() != null ? request.getNotes() : "Vehicle checked in for scheduled service.")
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
    }

    @Transactional
    public Booking updateBookingStatus(Long id, BookingStatus status, String notes) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        if (notes != null && !notes.trim().isEmpty()) {
            if (booking.getNotes() != null && !booking.getNotes().isEmpty()) {
                booking.setNotes(booking.getNotes() + "\n" + notes.trim());
            } else {
                booking.setNotes(notes.trim());
            }
        }
        return bookingRepository.save(booking);
    }
}
