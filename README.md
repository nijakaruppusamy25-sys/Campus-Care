# Campus Care – Hostel Issue Reporting & Management System

A full-stack hostel/campus management platform based on the provided Campus Care UI reference. Students can report and vote on maintenance issues, request guest rooms, view the mess menu and announcements, and access their floor digest. Staff can triage issues, allocate guest rooms, edit the mess menu, post announcements, and use a staff directory.

## Stack
- Frontend: React, Vite, Tailwind CSS, Lucide React, Recharts
- Backend: Java 21, Spring Boot, Spring Data JPA/Hibernate, Spring Security, JWT
- Database: MySQL 8
- API testing: Postman
- Build/version control: Maven, Git/GitHub

## Demo accounts
- Student: `aditi.ramesh@college.edu` / `password123`
- Staff: `staff@college.edu` / `password123`

## Run locally

### 1. Start MySQL
From `backend/`:
```bash
docker compose up -d
```
Or create a MySQL database named `campus_care` and use the credentials in `backend/src/main/resources/application.properties`.

### 2. Start backend
```bash
cd backend
mvn spring-boot:run
```
Backend: http://localhost:8080

### 3. Start frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## Main API groups
- `POST /api/auth/login`
- `GET/POST /api/issues`
- `POST /api/issues/{id}/vote`
- `PATCH /api/issues/{id}/status`
- `GET/POST /api/guests`
- `GET /api/guests/availability`
- `PATCH /api/guests/{id}/approve`
- `PATCH /api/guests/{id}/reject`
- `PATCH /api/guests/{id}/arrive`
- `PATCH /api/guests/{id}/depart`
- `GET/PUT /api/mess`
- `GET/POST /api/announcements`
- `GET /api/directory`
- `GET /api/dashboard/student`
- `GET /api/dashboard/staff`

## Notes
The first backend run seeds the demo users, sample issues, guest requests, mess menu, announcements, and staff directory entries used by the reference screens.
