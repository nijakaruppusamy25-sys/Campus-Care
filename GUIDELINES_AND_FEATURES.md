# Campus Care — Full Guidelines, Features & User Manual

Campus Care is a modern, full-stack hostel administration and student living platform designed specifically for institutional residential campuses. It streamlines maintenance operations, package security, dining schedules, visitor accommodations, and administrative communications into a unified, role-based web application.

---

## 1. System Overview & Technology Stack

| Layer | Technology | Key Libraries & Specifications |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Tailwind CSS, Lucide React (Icons), Recharts (Analytics) |
| **Backend** | Java 21, Spring Boot 3.5.6 | Spring Data JPA, Hibernate, Spring Security, JJWT (0.12.6) |
| **Database** | MySQL 8 | InnoDB, UTF-8, Automated schema generation & seeding |
| **Authentication**| Stateless JWT | Bearer tokens, Role-Based Access Control (RBAC) |
| **Containerization**| Docker & Docker Compose | Multi-container setup for MySQL & Backend |

---

## 2. User Roles & Login Credentials

All demonstration accounts are pre-seeded in the database on initial startup with the default password: **`password123`**.

### 2.1 Students
Students have access to the personalized Dashboard, Public Feed & Voting, Private Room Issue reporting, Delivery tracking with Pickup OTP, Mess Menu, Guest Room Requests, and Lost & Found.

| Name | Email ID | Room No. | Floor | Floor Representative |
| :--- | :--- | :--- | :--- | :--- |
| **Nija K** | `24z202@psgitech.ac.in` | 214 | Floor 2 | Yes (Floor Rep) |
| **Navina M** | `24z200@psgitech.ac.in` | 201 | Floor 2 | No |
| **Nethrshri S** | `24z201@psgitech.ac.in` | 202 | Floor 2 | No |
| **Kavinaya S** | `24z173@psgitech.ac.in` | 203 | Floor 2 | No |
| **Poojashri V** | `24z211@psgitech.ac.in` | 204 | Floor 2 | No |
| **Prathiksha N** | `24z216@psgitech.ac.in` | 205 | Floor 2 | No |

### 2.2 Wardens (Executive Administration)
Wardens oversee entire hostel blocks, review private student room complaints, allocate guest room inventories, delegate tasks to maintenance supervisors, broadcast official notices, and manage mess schedules.

| Name | Role | Email ID | Phone Contact |
| :--- | :--- | :--- | :--- |
| **Puvaneshwari** | Chief Warden | `puvaneshwari@psgitech.ac.in` | `+91 98765 43220` |
| **Jeyashree** | Resident Warden | `jeyashree@psgitech.ac.in` | `+91 98765 43224` |

### 2.3 Supervisors & Security Staff (Operations & Gate Desk)
Supervisors manage on-ground maintenance tickets, execute Gate 1 parcel logging, verify pickup OTPs, release packages, and coordinate maintenance personnel.

| Name | Assigned Department | Email ID | Phone Contact |
| :--- | :--- | :--- | :--- |
| **Indra** | Block A & B Maintenance | `supervisor1@psgitech.ac.in` | `+91 98765 43221` |
| **Thangam** | Block C & Core Services | `supervisor2@psgitech.ac.in` | `+91 98765 43222` |
| **Archana** | Mess & Common Areas | `supervisor3@psgitech.ac.in` | `+91 98765 43223` |

### 2.4 Maintenance Technicians (Campus Directory)
| Specialty | Technician Name | Phone |
| :--- | :--- | :--- |
| **Plumbing Services** | Raghavan S | `+91 98765 43211` |
| **Electrical Works** | Murugan K | `+91 98765 43210` |
| **Carpentry & Furniture** | Vijay R | `+91 98765 43212` |
| **Mess Office** | Catering Supervisor | `+91 98765 43213` |
| **Health Centre** | Duty Nurse / Clinic | `+91 98765 43214` |
| **Security Counter (Gate 1)** | Chief Security Officer | `+91 98765 43215` |

---

## 3. Comprehensive Feature Catalog

### 3.1 Student Dashboard
- **Personalized Header**: Greets student with their assigned Room and Floor badges.
- **Waiting Parcel Card**: Real-time package indicator showing carrier, storage shelf at Gate 1, and the large 4-digit pickup verification OTP.
- **Today's Mess Menu Widget**: Shows the 4 daily meals (Breakfast, Lunch, Snacks, Dinner) for the current day with time schedules and automatic highlighting for the ongoing meal window.
- **Hostel Notice Board**: Live broadcast feed of pinned hostel rules, inspection dates, and biometric deadlines.
- **My Complaints Tracker**: Real-time progress bar of personal room issues submitted to wardens.

### 3.2 Dual-Mode Issue Reporting & Upvoting System
- **Common Area (Public)**:
  - Intended for shared facilities: Mess, Laundry, Study Halls, Corridors, Lifts, Common Restrooms.
  - **Duplicate Detection**: Warns students if an issue has already been reported on their floor.
  - **Crowd Upvoting**: Students upvote existing tickets; tickets reaching 15+ votes are automatically marked as **Urgent Escalations**.
- **My Room (Private)**:
  - Intended for individual resident rooms: Attached bathrooms, fan/light fixtures, study table, door latches.
  - Confidential to the resident, floor supervisor, and warden.
  - Does not appear on the public communal feed.
- **Smart Image Cropping Modal**:
  - Built-in HTML5 Canvas photo editor that allows students to crop and isolate defective items (e.g. leaking tap, broken latch) before uploading.

### 3.3 Gate 1 Parcel Desk & OTP Security Protocol
- **Strict Anti-Theft Protocol**: Students **cannot** self-collect or dismiss parcel notifications in the UI without staff verification.
- **Incoming Package Logging**: Security staff logs carrier (Amazon, Flipkart, India Post, Blue Dart, Swiggy Instamart, Parents, etc.), tracking AWB number, recipient student room, and shelf location.
- **Automated OTP Generation**: System creates a cryptographically secure 4-digit OTP.
- **Security Desk Verification**: Upon parcel collection at Gate 1, the student presents their OTP. Staff enters the 4-digit code in the Parcel Desk console; once verified, the system archives the parcel with the timestamp and security officer signature.

### 3.4 Interactive Mess Menu Management
- **Full Weekly Schedule**: Comprehensive 7-day table spanning Monday through Sunday across all 4 meal sessions.
- **Real-Time Staff Editor**: Wardens and supervisors can click any meal cell to update the menu in-place without reloading. Changes reflect instantaneously on all student dashboards.

### 3.5 Guest Room Booking & Inventory Engine (Floor 8)
- **Dedicated Inventory**: 40 institutional guest suites located on Floor 8 (Rooms 801 to 840).
- **Automated Collision Detection**: Calculates availability by evaluating date overlaps (`checkIn` vs `checkOut`) across active reservations.
- **Lifecycle Management**: Students request dates → Wardens review and select specific available rooms → Security checks guests in upon arrival (`Checked In`) → Marks departed on exit (`Checked Out`), immediately returning the room to available inventory.

### 3.6 Hostel Notice Board & Announcements
- Wardens and supervisors can post rich announcements.
- **Pinning Feature**: Crucial announcements (e.g. Biometric Attendance cut-off, Block Inspections) remain permanently pinned at the top of the feed and dashboard.

### 3.7 Lost & Found Desk
- Students and staff can report lost or discovered hostel items.
- Built-in category tags (Apparel, Electronics, IDs, Bottles, Keys).
- High-resolution cropped image previews help rightful owners identify their possessions quickly.

### 3.8 Staff & Technician Directory
- Click-to-call directory for all on-duty campus personnel: Plumbers, Electricians, Carpenters, Medical Staff, and Wardens.

---

## 4. Step-by-Step "How to Use" Guide

### Scenario A: As a Student (`24z202@psgitech.ac.in`)

#### 1. Logging In:
1. Open `http://localhost:5173` in your browser.
2. Select or enter your student email (`24z202@psgitech.ac.in`) and password (`password123`).
3. Click **Sign In**.

#### 2. Collecting a Delivered Package:
1. View your **Dashboard** or navigate to **Parcels** in the sidebar.
2. Under **Waiting for Pickup**, you will see your delivery card (e.g. Blue Dart #P-106) with a 4-digit code (e.g. `3106`).
3. Walk to the Gate 1 Security Counter and show this 4-digit OTP to the security officer.
4. The officer verifies the code on their screen and hands over your package. The card automatically moves to **Past Deliveries**.

#### 3. Reporting a Room Maintenance Issue:
1. Click **+ Report Room Issue** or click **Report Issue** in the sidebar.
2. Toggle the mode:
   - Click **My Room (Private)** for plumbing/fixtures inside your room.
   - Click **Common Area (Public)** for shared spaces (e.g. water cooler, mess).
3. Select the Department, Floor, and Room fixture.
4. (Optional) Click **Upload photo** to select an image, adjust the crop box around the defect, and confirm.
5. Provide a short description and click **Submit**.
6. Track supervisor progress under **My Complaints** on your Dashboard.

#### 4. Booking a Guest Room:
1. Click **Guest Rooms** in the sidebar.
2. Fill in the **Guest name & relation**, **Check-in date**, and **Check-out date**.
3. Click **Send request**.
4. Once the Warden approves your request, your allocated room number (e.g. Room 804) will appear in your requests list.

---

### Scenario B: As a Warden (`puvaneshwari@psgitech.ac.in`)

#### 1. Triaging Complaints:
1. Log in with `puvaneshwari@psgitech.ac.in` / `password123`.
2. Navigate to **Issue Queue** from the sidebar.
3. Review pending complaints across all floors.
4. Filter by status (`Reported`, `In Progress`, `Resolved`) or priority.
5. Click **Assign Supervisor** or mark issues as **In Progress** / **Resolved**.

#### 2. Allocating Guest Rooms:
1. Navigate to **Guest Requests** in the sidebar.
2. Review pending requests showing student name, relation, and requested dates.
3. The dropdown automatically calculates and lists all currently unoccupied Floor 8 rooms for that date range.
4. Select a room (e.g. Room 802) and click **Approve**.

#### 3. Publishing an Announcement:
1. Go to **Announcements**.
2. Enter the title and message.
3. Check **Pin as daily reminder** if it is a standing regulation.
4. Click **Post**. It will appear instantly on all student dashboards.

---

### Scenario C: As Gate Security / Supervisor (`supervisor1@psgitech.ac.in`)

#### 1. Logging an Incoming Parcel at Gate 1:
1. Log in with `supervisor1@psgitech.ac.in` / `password123`.
2. Navigate to **Parcel Desk** in the sidebar.
3. Click **Log Incoming Delivery**.
4. Select the student recipient (e.g. `Nija K — Room 214`).
5. Choose courier partner (Amazon, Flipkart, Swiggy, etc.), tracking number, and storage shelf (e.g. `Shelf A-2`).
6. Click **Log Package & Generate Student OTP**. The student is immediately alerted with their 4-digit code.

#### 2. Verifying Student OTP & Handing Over:
1. In the **Parcel Desk** under **Waiting for Pickup**, find the recipient's card.
2. Ask the student for their 4-digit OTP.
3. Enter the 4 digits into the OTP box and click **Verify OTP**.
4. The system validates the code, marks the package as `COLLECTED` with `Verified by Security`, and timestamps the hand-off.

#### 3. Updating the Mess Menu:
1. Navigate to **Mess Menu**.
2. Click on any meal box for any day of the week.
3. Type the updated food items and click **Save**.

---

## 5. Local Setup & Execution Guide

### Prerequisites
- **Java**: JDK 21 or later (`java -version`)
- **Maven**: 3.8+ (`mvn -version`)
- **Node.js**: v18+ and npm (`node -v`)
- **MySQL**: 8.0+ running locally on port 3306 OR Docker

---

### Step 1: Database Setup
Make sure MySQL is running. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS campus_care;
```
Check `backend/src/main/resources/application.properties` to ensure credentials match your MySQL setup:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_care?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```
*(If using Docker for MySQL, run `docker compose up -d` inside `backend/`)*.

---

### Step 2: Start Spring Boot Backend
Open a terminal and run:
```bash
cd backend
mvn spring-boot:run
```
- **Backend Port**: `http://localhost:8080`
- On startup, `DataInitializer.java` will automatically create the tables and seed all student, supervisor, warden, parcel, menu, and notice records.

---

### Step 3: Start React Frontend
Open a second terminal and run:
```bash
cd frontend
npm install
npm run dev
```
- **Frontend URL**: `http://localhost:5173`
- Open your browser to `http://localhost:5173` to access the application.

---

## 6. API Reference (Postman)

The repository includes a ready-to-import Postman collection located at:
`postman/Campus-Care.postman_collection.json`

### Core Endpoints:
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/parcels` | Retrieve parcels for student or all (staff) | Student / Staff |
| `POST` | `/api/parcels` | Log new package and generate 4-digit OTP | Staff Only |
| `POST` | `/api/parcels/{id}/verify-otp` | Verify OTP and mark package as collected | Staff / Security |
| `PATCH` | `/api/parcels/{id}/collect` | Manual release fallback | Staff Only |
| `GET` | `/api/issues` | Fetch complaints feed & status | Authenticated |
| `POST` | `/api/issues` | Submit public or private room maintenance request | Student |
| `POST` | `/api/issues/{id}/vote`| Upvote or toggle vote on public issue | Student |
| `PATCH` | `/api/issues/{id}/status`| Update issue status (Reported / In Progress / Resolved)| Staff |
| `GET` | `/api/mess` | Fetch full 7-day dining schedule | Authenticated |
| `PUT` | `/api/mess/{id}` | Edit meal dishes for day & meal type | Staff Only |
| `GET` | `/api/guests` | List guest bookings | Authenticated |
| `POST` | `/api/guests` | Request Floor 8 guest room reservation | Student |
| `GET` | `/api/guests/availability` | Query available Floor 8 rooms for date span | Staff |
| `PATCH` | `/api/guests/{id}/approve` | Allocate room and approve booking | Staff Only |
| `GET` | `/api/announcements` | Fetch active notices | Authenticated |
| `POST` | `/api/announcements` | Publish notice (with optional pin) | Staff Only |
| `GET` | `/api/directory` | Fetch maintenance directory & phone contacts | Authenticated |

---

## 7. Security & Business Rules Summary

1. **OTP-Only Parcel Collection**: Students can never bypass security to mark parcels as collected in their app. Collection is finalized exclusively by security officers entering the verified 4-digit code.
2. **Confidential Room Tickets**: Private room maintenance requests (restrooms, lighting, locks) are kept strictly confidential between the resident and hostel authorities.
3. **Automated Escalation Threshold**: Communal tickets automatically upgrade to **Urgent** upon receiving 15 or more upvotes.
4. **Collision-Free Room Allocation**: Floor 8 guest suites check for active date span overlaps before presenting room options to wardens, preventing double-bookings.
