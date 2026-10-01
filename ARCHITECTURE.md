# Campus Care architecture

```text
React + Tailwind + Lucide + Recharts
              |
              | REST + JWT
              v
       Spring Boot API
       /      |       \
   Auth   Issues/Guests  Content
       \      |       /
          Spring Data JPA
              |
            MySQL
```

## Main entities
- User: student/staff role, room, floor and floor-rep flag
- Issue: department, floor, location, description, photo, status, author
- IssueVote: unique student vote per issue
- GuestRequest: guest dates, status, allocated room and presence status
- MessMenuItem: day + meal + menu text
- Announcement: title, message, pinned flag, author and timestamp
- DirectoryEntry: service role, contact person and phone

## Business rules
- An issue is urgent at 15 or more votes while unresolved (communal issues only).
- Students can vote once per issue and toggle their vote.
- Private room issues (attached bath, furniture, room electricals) bypass voting and are kept confidential to the student and staff.
- Staff can change issue status.
- Guest rooms are 801–840.
- Approved guest bookings reserve a room only when their date range overlaps another booking.
- Checked-out guests no longer block the room.
- Only staff can approve/reject guests, edit the mess menu and post announcements.
- Only staff can access the directory endpoint.
