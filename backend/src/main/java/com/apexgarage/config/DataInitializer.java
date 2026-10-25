package com.apexgarage.config;

import com.apexgarage.entity.*;
import com.apexgarage.repository.BillRepository;
import com.apexgarage.repository.BookingRepository;
import com.apexgarage.repository.UserRepository;
import com.apexgarage.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final BillRepository billRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, VehicleRepository vehicleRepository,
                           BookingRepository bookingRepository, BillRepository billRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
        this.billRepository = billRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data load.");
            return;
        }

        log.info("Seeding Apex Garage initial luxury demo data...");

        // 1. Create Users
        User customer = User.builder()
                .name("Alexander Sterling")
                .email("customer@apexgarage.com")
                .password(passwordEncoder.encode("password123"))
                .phone("+1 (555) 782-4910")
                .role(Role.CUSTOMER)
                .build();
        customer = userRepository.save(customer);

        User mechanic = User.builder()
                .name("Marcus Vance (Master Tech)")
                .email("mechanic@apexgarage.com")
                .password(passwordEncoder.encode("password123"))
                .phone("+1 (555) 349-8812")
                .role(Role.MECHANIC)
                .build();
        mechanic = userRepository.save(mechanic);

        User admin = User.builder()
                .name("Victoria Chen (Garage Director)")
                .email("admin@apexgarage.com")
                .password(passwordEncoder.encode("password123"))
                .phone("+1 (555) 902-1100")
                .role(Role.ADMIN)
                .build();
        admin = userRepository.save(admin);

        // 2. Create Vehicles
        Vehicle porsche = Vehicle.builder()
                .owner(customer)
                .make("Porsche")
                .model("911 GT3 Touring")
                .year(2024)
                .licensePlate("APX-GT302")
                .build();
        porsche = vehicleRepository.save(porsche);

        Vehicle bmw = Vehicle.builder()
                .owner(customer)
                .make("BMW")
                .model("M3 Competition xDrive")
                .year(2023)
                .licensePlate("APX-M301")
                .build();
        bmw = vehicleRepository.save(bmw);

        Vehicle audi = Vehicle.builder()
                .owner(customer)
                .make("Audi")
                .model("RS6 Avant Quattro")
                .year(2023)
                .licensePlate("APX-RS603")
                .build();
        audi = vehicleRepository.save(audi);

        // 3. Create Bookings with various stages
        // Active in-progress repair for Porsche
        Booking bookingPorsche = Booking.builder()
                .customer(customer)
                .vehicle(porsche)
                .serviceType(ServiceType.BRAKE_REPAIR)
                .preferredDate(LocalDate.now())
                .timeSlot("09:00 AM - 11:00 AM")
                .status(BookingStatus.IN_PROGRESS)
                .notes("Master Tech Marcus: Calipers disassembled. Inspecting rotor wear and flushing with AP Racing synthetic brake fluid. Target completion by 3:00 PM.")
                .createdAt(LocalDateTime.now().minusHours(4))
                .build();
        bookingPorsche = bookingRepository.save(bookingPorsche);

        // Quality check for BMW
        Booking bookingBmw = Booking.builder()
                .customer(customer)
                .vehicle(bmw)
                .serviceType(ServiceType.ENGINE_DIAGNOSTICS)
                .preferredDate(LocalDate.now().minusDays(1))
                .timeSlot("02:00 PM - 04:00 PM")
                .status(BookingStatus.QUALITY_CHECK)
                .notes("Diagnostic scan complete: Air-fuel mixture calibrated, boost leak resolved. Currently running dyno quality road test verification.")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();
        bookingBmw = bookingRepository.save(bookingBmw);

        // Ready for pickup for Audi with itemized Bill
        Booking bookingAudi = Booking.builder()
                .customer(customer)
                .vehicle(audi)
                .serviceType(ServiceType.FULL_DETAILING)
                .preferredDate(LocalDate.now().minusDays(2))
                .timeSlot("11:30 AM - 01:30 PM")
                .status(BookingStatus.READY_FOR_PICKUP)
                .notes("Concierge Detailing completed! Graphene 9H ceramic coating applied and cured. Vehicle staged in luxury delivery bay 2.")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        bookingAudi = bookingRepository.save(bookingAudi);

        // 4. Create an Itemized Bill for Audi
        BigDecimal partsTotal = new BigDecimal("398.00");
        BigDecimal laborTotal = new BigDecimal("500.00");
        BigDecimal tax = new BigDecimal("76.33");
        BigDecimal grandTotal = new BigDecimal("974.33");

        Bill bill = Bill.builder()
                .booking(bookingAudi)
                .totalPartsCost(partsTotal)
                .totalLaborCost(laborTotal)
                .tax(tax)
                .grandTotal(grandTotal)
                .paymentStatus(PaymentStatus.UNPAID)
                .items(new ArrayList<>())
                .build();

        bill.addItem(BillItem.builder()
                .description("Carbon Ceramic Brake Fluid DOT 5.1 (1L)")
                .type(BillItemType.PART)
                .quantity(2)
                .unitPrice(new BigDecimal("48.00"))
                .totalPrice(new BigDecimal("96.00"))
                .build());

        bill.addItem(BillItem.builder()
                .description("OEM M-Performance High-Flow Cabin & Engine Filter")
                .type(BillItemType.PART)
                .quantity(1)
                .unitPrice(new BigDecimal("117.00"))
                .totalPrice(new BigDecimal("117.00"))
                .build());

        bill.addItem(BillItem.builder()
                .description("Graphene Matrix Ceramic Sealant 50ml Kit")
                .type(BillItemType.PART)
                .quantity(1)
                .unitPrice(new BigDecimal("185.00"))
                .totalPrice(new BigDecimal("185.00"))
                .build());

        bill.addItem(BillItem.builder()
                .description("Concierge Multi-Stage Paint Correction & Decontamination")
                .type(BillItemType.LABOR)
                .quantity(4)
                .unitPrice(new BigDecimal("95.00"))
                .totalPrice(new BigDecimal("380.00"))
                .build());

        bill.addItem(BillItem.builder()
                .description("Digital OBD-II Telemetry Diagnostics & Road Test")
                .type(BillItemType.LABOR)
                .quantity(1)
                .unitPrice(new BigDecimal("120.00"))
                .totalPrice(new BigDecimal("120.00"))
                .build());

        billRepository.save(bill);

        log.info("Apex Garage Demo data initialization complete! Seeded 3 users, 3 vehicles, 3 bookings, and 1 itemized bill.");
    }
}
