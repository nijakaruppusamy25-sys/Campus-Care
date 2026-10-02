package com.campuscare.lostitem;

import com.campuscare.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/lost-items")
@RequiredArgsConstructor
public class LostItemController {
    private final LostItemRepository repo;
    private final UserRepository users;
    @Value("${app.upload-dir}") private String uploadDir;

    public record LostItemDto(
        Long id,
        String title,
        String itemType,
        String location,
        String roomNumber,
        String description,
        String photoUrl,
        String status,
        String authorName,
        String authorEmail,
        String authorRoom,
        String time,
        boolean isMine
    ) {}

    @GetMapping
    public List<LostItemDto> all(Authentication auth) {
        User me = auth != null ? users.findByEmail(auth.getName()).orElse(null) : null;
        return repo.findAllByOrderByCreatedAtDesc().stream().map(item -> toDto(item, me)).toList();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public LostItemDto createMultipart(
        @RequestPart("title") String title,
        @RequestPart("itemType") String itemType,
        @RequestPart("location") String location,
        @RequestPart(value = "roomNumber", required = false) String roomNumber,
        @RequestPart("description") String description,
        @RequestPart(value = "photo", required = false) MultipartFile photo,
        Authentication auth
    ) throws IOException {
        User me = users.findByEmail(auth.getName()).orElseThrow();
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            String orig = photo.getOriginalFilename() != null ? Path.of(photo.getOriginalFilename()).getFileName().toString() : "photo.jpg";
            String sanitized = orig.replaceAll("[^a-zA-Z0-9.-]", "_");
            String name = UUID.randomUUID() + "-" + sanitized;
            try {
                Files.copy(photo.getInputStream(), dir.resolve(name), StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception ignored) {}
            // Persist as Base64 data URL if size allows so ephemeral cloud platforms (e.g. Render) retain images permanently
            try {
                if (photo.getSize() <= 2 * 1024 * 1024) {
                    String mime = photo.getContentType() != null && !photo.getContentType().isBlank() ? photo.getContentType() : "image/jpeg";
                    photoUrl = "data:" + mime + ";base64," + Base64.getEncoder().encodeToString(photo.getBytes());
                } else {
                    photoUrl = "/uploads/" + name;
                }
            } catch (Exception e) {
                photoUrl = "/uploads/" + name;
            }
        }
        String cleanType = "FOUND".equalsIgnoreCase(itemType) ? "FOUND" : "LOST";
        LostItem item = repo.save(LostItem.builder()
            .title(title.trim())
            .itemType(cleanType)
            .location(location.trim())
            .roomNumber(roomNumber != null && !roomNumber.isBlank() ? roomNumber.trim() : me.getRoomNumber())
            .description(description.trim())
            .photoUrl(photoUrl)
            .status("OPEN")
            .author(me)
            .createdAt(LocalDateTime.now())
            .build());
        return toDto(item, me);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public LostItemDto createJson(@RequestBody Map<String, Object> body, Authentication auth) {
        User me = users.findByEmail(auth.getName()).orElseThrow();
        String title = String.valueOf(body.get("title"));
        String itemType = "FOUND".equalsIgnoreCase(String.valueOf(body.get("itemType"))) ? "FOUND" : "LOST";
        String location = String.valueOf(body.get("location"));
        String roomNumber = body.get("roomNumber") != null ? String.valueOf(body.get("roomNumber")) : me.getRoomNumber();
        String description = String.valueOf(body.get("description"));
        String photoUrl = body.get("photoUrl") != null ? String.valueOf(body.get("photoUrl")) : null;

        LostItem item = repo.save(LostItem.builder()
            .title(title.trim())
            .itemType(itemType)
            .location(location.trim())
            .roomNumber(roomNumber)
            .description(description.trim())
            .photoUrl(photoUrl)
            .status("OPEN")
            .author(me)
            .createdAt(LocalDateTime.now())
            .build());
        return toDto(item, me);
    }

    @PatchMapping("/{id}/claim")
    public LostItemDto markClaimed(@PathVariable Long id, Authentication auth) {
        User me = users.findByEmail(auth.getName()).orElseThrow();
        LostItem item = repo.findById(id).orElseThrow();
        if (!item.getAuthor().getId().equals(me.getId()) && me.getRole() != Role.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only author or staff can mark this item claimed");
        }
        item.setStatus("CLAIMED");
        item.setClaimedAt(LocalDateTime.now());
        return toDto(repo.save(item), me);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        User me = users.findByEmail(auth.getName()).orElseThrow();
        LostItem item = repo.findById(id).orElseThrow();
        if (!item.getAuthor().getId().equals(me.getId()) && me.getRole() != Role.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        repo.delete(item);
    }

    private LostItemDto toDto(LostItem i, User me) {
        long h = Duration.between(i.getCreatedAt(), LocalDateTime.now()).toHours();
        String time = h < 1 ? "just now" : h < 24 ? h + "h ago" : (h / 24) + "d ago";
        boolean isMine = me != null && (i.getAuthor().getId().equals(me.getId()) || me.getRole() == Role.STAFF);
        return new LostItemDto(
            i.getId(),
            i.getTitle(),
            i.getItemType(),
            i.getLocation(),
            i.getRoomNumber(),
            i.getDescription(),
            i.getPhotoUrl(),
            i.getStatus(),
            i.getAuthor().getName(),
            i.getAuthor().getEmail(),
            i.getAuthor().getRoomNumber(),
            time,
            isMine
        );
    }
}
