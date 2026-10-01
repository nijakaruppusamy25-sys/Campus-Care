package com.campuscare.parcel;

import com.campuscare.user.Role;
import com.campuscare.user.User;
import com.campuscare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
public class ParcelController {
    private final ParcelRepository repo;
    private final UserRepository users;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMM, hh:mm a");

    public record ParcelDto(
            Long id,
            String parcelCode,
            Long studentId,
            String studentName,
            String roomNumber,
            Integer floorNumber,
            String courier,
            String trackingNumber,
            String storageLocation,
            String notes,
            String otp,
            String status,
            String arrivedAt,
            String collectedAt,
            String collectedBy
    ) {}

    public record CreateParcelRequest(
            Long studentId,
            String courier,
            String trackingNumber,
            String storageLocation,
            String notes
    ) {}

    public record VerifyOtpRequest(String otp) {}

    public record StudentOptionDto(Long id, String name, String roomNumber, Integer floorNumber, String email) {}

    @GetMapping
    public List<ParcelDto> all(Authentication a) {
        User me = me(a);
        if (me.getRole() == Role.STUDENT) {
            return repo.findByStudentOrderByArrivedAtDesc(me).stream().map(this::dto).toList();
        }
        return repo.findAllByOrderByArrivedAtDesc().stream().map(this::dto).toList();
    }

    @GetMapping("/students")
    public List<StudentOptionDto> getStudents(Authentication a) {
        staffOnly(a);
        return users.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .map(u -> new StudentOptionDto(u.getId(), u.getName(), u.getRoomNumber(), u.getFloorNumber(), u.getEmail()))
                .toList();
    }

    @PostMapping
    public ParcelDto create(@RequestBody CreateParcelRequest req, Authentication a) {
        staffOnly(a);
        if (req.studentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student is required");
        }
        if (req.courier() == null || req.courier().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Courier partner is required");
        }
        User student = users.findById(req.studentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        String otp = String.format("%04d", (int)(Math.random() * 9000 + 1000));
        String storage = (req.storageLocation() == null || req.storageLocation().trim().isEmpty())
                ? "Security Gate Desk" : req.storageLocation().trim();

        Parcel parcel = Parcel.builder()
                .student(student)
                .courier(req.courier().trim())
                .trackingNumber(req.trackingNumber() != null ? req.trackingNumber().trim() : null)
                .storageLocation(storage)
                .notes(req.notes() != null ? req.notes().trim() : null)
                .otp(otp)
                .status(ParcelStatus.WAITING_PICKUP)
                .arrivedAt(LocalDateTime.now())
                .build();

        return dto(repo.save(parcel));
    }

    @PostMapping("/{id}/verify-otp")
    public ParcelDto verifyOtp(@PathVariable Long id, @RequestBody VerifyOtpRequest req, Authentication a) {
        User me = me(a);
        Parcel p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parcel not found"));

        if (p.getStatus() == ParcelStatus.COLLECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parcel already collected");
        }

        if (req.otp() == null || !req.otp().trim().equals(p.getOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP code. Please check your Campus Care app.");
        }

        p.setStatus(ParcelStatus.COLLECTED);
        p.setCollectedAt(LocalDateTime.now());
        p.setCollectedBy(me.getRole() == Role.STAFF ? "Verified by Security" : "Claimed by " + me.getName());
        return dto(repo.save(p));
    }

    @PatchMapping("/{id}/collect")
    public ParcelDto collectDirectly(@PathVariable Long id, Authentication a) {
        User me = me(a);
        if (me.getRole() != Role.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Students can only receive parcels using OTP verification at the security desk.");
        }
        Parcel p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parcel not found"));

        if (p.getStatus() == ParcelStatus.COLLECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parcel already marked as collected");
        }

        p.setStatus(ParcelStatus.COLLECTED);
        p.setCollectedAt(LocalDateTime.now());
        p.setCollectedBy("Manual Gate Release (Staff)");
        return dto(repo.save(p));
    }

    private User me(Authentication a) {
        return users.findByEmail(a.getName()).orElseThrow();
    }

    private void staffOnly(Authentication a) {
        if (me(a).getRole() != Role.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only staff/security can perform this action");
        }
    }

    private ParcelDto dto(Parcel p) {
        return new ParcelDto(
                p.getId(),
                "P-" + (100 + p.getId()),
                p.getStudent().getId(),
                p.getStudent().getName(),
                p.getStudent().getRoomNumber(),
                p.getStudent().getFloorNumber(),
                p.getCourier(),
                p.getTrackingNumber(),
                p.getStorageLocation(),
                p.getNotes(),
                p.getOtp(),
                p.getStatus().name(),
                p.getArrivedAt() != null ? p.getArrivedAt().format(FORMATTER) : "",
                p.getCollectedAt() != null ? p.getCollectedAt().format(FORMATTER) : null,
                p.getCollectedBy()
        );
    }
}
