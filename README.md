# 🏎️ APEX MOTORWERKS — Premium Vehicle Service & Garage Management System

> **A high-end, bespoke automotive service suite featuring interactive booking slots, live telemetry repair milestone tracking, and transparent itemized digital billing.**

---

## 🌟 Executive Overview & Aesthetics

**Apex Motorwerks** is an enterprise-grade vehicle service & garage scheduling platform designed for high-performance and luxury automobile owners, service advisors, and master technicians. 

### Key Highlights
- **Automotive Aesthetic**: Dark gunmetal grey (`#121417`), brushed metallic silver (`#C0C0C0`), and platinum (`#E2E8F0`) highlights with electric blue (`#00D2FF`) and neon amber telemetry status indicators.
- **Glassmorphism & Fluid Motion**: High-contrast glass panels, micro-animations, real-time pulse glow states on active repair milestones, and celebratory confetti upon confirmed reservations.
- **Dual Perspective**: Complete Customer booking/tracking experience plus a **Technician / Mechanic Workbench** to advance repair stages and dispatch itemized bills in real-time.

---

## 🛠️ Technology Stack

### Backend
- **Language**: Java 17+ (Java 24 verified)
- **Framework**: Spring Boot 3.3.4
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: H2 in-memory embedded (with MySQL compatibility mode enabled for instant zero-config startup; easily re-pointed to production MySQL via `application.yml`)
- **Security**: Spring Security 6 with stateless JWT Bearer token authentication
- **Build**: Apache Maven

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS with custom automotive glassmorphic utility classes
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios with JWT interceptor & auto-routing
- **Effects**: Canvas Confetti

---

## 🗄️ Database Schema & Entities

1. **User (`users`)**:
   - `id` (PK, Long), `name` (String), `email` (Unique String), `password` (BCrypt Hashed), `phone` (String), `role` (`CUSTOMER`, `MECHANIC`, `ADMIN`), `created_at` (Timestamp).
2. **Vehicle (`vehicles`)**:
   - `id` (PK, Long), `owner_id` (FK -> `users.id`), `make` (String), `model` (String), `vehicle_year` (Integer), `license_plate` (Unique String).
3. **Booking (`bookings`)**:
   - `id` (PK, Long), `customer_id` (FK -> `users.id`), `vehicle_id` (FK -> `vehicles.id`), `service_type` (`GENERAL_MAINTENANCE`, `OIL_CHANGE`, `BRAKE_REPAIR`, `ENGINE_DIAGNOSTICS`, `FULL_DETAILING`), `preferred_date` (LocalDate), `time_slot` (String), `status` (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `QUALITY_CHECK`, `READY_FOR_PICKUP`, `COMPLETED`, `CANCELLED`), `notes` (String), `created_at` (Timestamp).
4. **Bill (`bills`)**:
   - `id` (PK, Long), `booking_id` (FK -> `bookings.id`), `total_labor_cost` (BigDecimal), `total_parts_cost` (BigDecimal), `tax` (BigDecimal), `grand_total` (BigDecimal), `payment_status` (`UNPAID`, `PAID`), `generated_at` (Timestamp).
5. **Bill Item (`bill_items`)**:
   - `id` (PK, Long), `bill_id` (FK -> `bills.id`), `description` (String), `type` (`PART`, `LABOR`), `quantity` (Integer), `unit_price` (BigDecimal), `total_price` (BigDecimal).

---

## 🌐 Spring Boot REST API Endpoints

### 1. Authentication Controller (`/api/auth`)
- `POST /api/auth/register` — Register a new customer or mechanic
- `POST /api/auth/login` — Authenticate credentials and receive JWT Bearer token
- `GET /api/auth/me` — Retrieve currently authenticated user profile

### 2. Vehicle Controller (`/api/vehicles`)
- `GET /api/vehicles/user/{userId}` — Retrieve all vehicles belonging to a customer
- `GET /api/vehicles` — Retrieve all registered vehicles (Admin view)
- `POST /api/vehicles` — Add and register a new vehicle to customer profile
- `DELETE /api/vehicles/{id}` — Remove a vehicle

### 3. Booking Controller (`/api/bookings`)
- `POST /api/bookings` — Create a new service booking slot
- `GET /api/bookings/customer/{customerId}` — Get active bookings & service history for a customer
- `GET /api/bookings` — Get all bookings (Garage Queue view)
- `GET /api/bookings/{id}` — Get specific booking detail
- `PATCH /api/bookings/{id}/status` — Update repair status & append technician notes (Mechanic workflow)

### 4. Billing Controller (`/api/bills`)
- `GET /api/bills/booking/{bookingId}` — Retrieve final itemized invoice for a booking
- `GET /api/bills/{id}` — Retrieve invoice by bill ID
- `POST /api/bills` — Create and publish an itemized bill (Admin/Mechanic action)
- `PATCH /api/bills/{id}/pay` — Process and simulate 256-bit encrypted card payment

---

## 📱 User Interface Walkthrough

1. **Page 1: Landing & Hero Section**
   - High-contrast metallic dark theme with glowing engine diagnostic telemetry HUD.
   - Live telemetry status nodes: ECU online check, remaining brake pad wear, oil viscosity index, tire temperatures.
   - Quick CTAs: *Book Service Slot* & *Track Repair Live*.
   - Specialized service tier catalog.

2. **Page 2: Interactive Booking Wizard**
   - **Step 1: Select Vehicle**: Interactive luxury automobile cards (Porsche 911 GT3, BMW M3 Competition, Audi RS6 Avant) + *Add New Vehicle* modal.
   - **Step 2: Choose Service Package**: General Maintenance, Synthetic Oil, Performance Brakes, Engine Dyno Diagnostics, Concierge Detailing.
   - **Step 3: Schedule Slot**: Date selector, animated time slot grid, customer symptom notes.
   - Confetti & checkmark confirmation dialog with instant dispatch reference.

3. **Page 3: Live Repair Tracker Dashboard**
   - 5-step milestone progress stepper with glowing active pulse effect:
     `Booking Confirmed` ➔ `Inspection & Diagnostics` ➔ `Repairs In Progress` ➔ `Quality Check & Dyno` ➔ `Ready for Pickup`.
   - Real-time field notes dispatched directly by Master Technician Marcus Vance.
   - Dedicated vehicle switcher chip selector.

4. **Page 4: Itemized Digital Bill View**
   - Brushed titanium invoice header with timestamp and unique reference ID.
   - Split tables: **Table A (OEM Parts & Spares)** vs **Table B (Certified Labor & Diagnostics)**.
   - Subtotals, 8.5% state tax calculation, grand total.
   - 256-bit encrypted checkout modal with instant card simulation.
   - Official green **PAID IN FULL** watermark stamp + browser print/PDF capability.

5. **Mechanic / Service Advisor Bay**
   - Switch roles in the navbar (*Owner* / *Tech* / *Admin*).
   - Real-time milestone status advancement that instantly reflects on customer's live tracker.
   - Form to publish new itemized bills with custom parts & labor lines.

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- Node.js 18+ and npm

### 1. Launch Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
- Server starts on: `http://localhost:8080`
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:apexgaragedb`, User: `sa`, Password: *blank*)
- Pre-seeded with demo customer, mechanic, admin, 3 exotic vehicles, 3 active bookings, and an itemized bill.

### 2. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open browser at: `http://localhost:5173`
- Full API proxy configured to forward `/api` requests to backend on port 8080.
