# Campus Care – Smart Campus & Hostel Living Platform

Campus Care is a modern full-stack hostel administration and residential management platform. It unites maintenance complaints, Gate 1 package delivery with 4-digit OTP verification, real-time dining schedules, Floor 8 guest room inventory, notice broadcasts, and campus technician directories into a clean, role-based dashboard.

> 📖 **Full Documentation**: For in-depth role workflows, how-to guides, and feature details, read [GUIDELINES_AND_FEATURES.md](file:///Users/jaishreenija/Downloads/Campus-Care-Full-Stack/GUIDELINES_AND_FEATURES.md).

---

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: Java 21, Spring Boot 3.5.6, Spring Data JPA / Hibernate, Spring Security, JJWT
- **Database**: MySQL 8.0
- **Testing**: Postman Collection (`postman/Campus-Care.postman_collection.json`)
- **Version Control**: Git / GitHub

---

## Demo Accounts
Default password for all accounts: **`password123`**

### Students
- `24z202@psgitech.ac.in` (Nija K — Room 214, Floor 2, Floor Rep)
- `24z200@psgitech.ac.in` (Navina M — Room 201)
- `24z201@psgitech.ac.in` (Nethrshri S — Room 202)
- `24z173@psgitech.ac.in` (Kavinaya S — Room 203)
- `24z211@psgitech.ac.in` (Poojashri V — Room 204)
- `24z216@psgitech.ac.in` (Prathiksha N — Room 205)

### Wardens
- `puvaneshwari@psgitech.ac.in` (Puvaneshwari — Chief Warden)
- `jeyashree@psgitech.ac.in` (Jeyashree — Resident Warden)

### Supervisors & Gate Security
- `supervisor1@psgitech.ac.in` (Indra — Block A & B)
- `supervisor2@psgitech.ac.in` (Thangam — Block C & Services)
- `supervisor3@psgitech.ac.in` (Archana — Mess & Common Areas)

---

## Quick Start (Run Locally)

### 1. Database
Make sure MySQL is running on `localhost:3306` with database `campus_care`:
```sql
CREATE DATABASE IF NOT EXISTS campus_care;
```
Or start via Docker Compose:
```bash
cd backend
docker compose up -d
```

### 2. Run Backend
In a terminal window:
```bash
cd backend
mvn spring-boot:run
```
- API Base: `http://localhost:8080`
- Tables and demonstration data are seeded automatically on first launch.

### 3. Run Frontend
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## Core Features
1. **Student Dashboard**: Live greetings, assigned room/floor badge, awaiting parcel OTP badge, Today's 4-meal mess menu, notice board, and private room complaints progress.
2. **Dual-Mode Maintenance Reporting**:
   - *Public Communal*: Shared facilities with floor duplicate detection and crowd upvoting (escalates to Urgent at 15+ votes).
   - *Private Room*: Confidential tickets for room fixtures, lighting, and attached restrooms.
   - *Smart Crop*: In-browser canvas tool for isolating defective items in photos.
3. **Gate 1 Parcel Desk (OTP Verification)**:
   - Security staff logs deliveries and generates a secure 4-digit OTP.
   - Students can only receive packages by showing their OTP at the gate desk.
4. **Mess Menu Manager**: Weekly 7-day schedule with live click-to-edit capabilities for wardens and supervisors.
5. **Guest Room Booking (Floor 8)**: Automated availability calculation for 40 guest suites (801–840) preventing booking overlaps.
6. **Hostel Notice Board**: Broadcast critical notices and pin recurring daily regulations.
7. **Lost & Found Desk**: Report and claim lost campus items with high-resolution cropped image previews.
8. **Staff Directory**: Direct phone directory for electricians, plumbers, carpenters, and medical staff.
