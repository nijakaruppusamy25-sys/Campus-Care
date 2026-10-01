# Campus Care build status

## Implemented in this build
- React/Vite/Tailwind frontend matching the supplied reference screens
- Student and Staff login using JWT
- Student dashboard
- Staff dashboard with complaint chart
- Issue feed with voting
- Private room maintenance reporting (attached bath, electricals, furniture) without public voting
- Privacy-aware feed segmentation (Community vs My Room Tickets)
- Duplicate issue warning by department + floor
- Urgent issue threshold at 15 votes
- Staff issue queue with Urgent Community and Private Room Request triage
- Issue photo upload endpoint
- Guest room requests
- Date-overlap room availability across rooms 801–840
- Staff approval/rejection
- Guest check-in/check-out
- Student mess menu
- Staff mess menu inline editing
- Student announcements
- Staff announcement posting + pinning
- Floor digest for floor representatives
- Staff-only directory
- MySQL/JPA persistence
- Seed data matching the supplied screenshots
- Postman collection
- Docker Compose for MySQL

## Not included yet
- Production deployment
- Email/SMS/push notifications
- Password reset
- Cloud object storage for uploaded photos
- Production-grade secret management
- Automated integration/end-to-end tests
