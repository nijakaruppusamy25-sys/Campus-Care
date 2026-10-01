package com.campuscare.auth;

import com.campuscare.config.JwtService;
import com.campuscare.user.User;
import com.campuscare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String input = req.email() != null ? req.email().trim().toLowerCase() : "";
        var user = users.findByEmail(input);
        if (user.isEmpty()) {
            if (input.contains("puvaneshwari")) {
                user = users.findByEmail("puvaneshwari@psgitech.ac.in");
            } else if (input.contains("jeyashree")) {
                user = users.findByEmail("jeyashree@psgitech.ac.in");
            } else if (input.contains("warden") || input.equals("staff")) {
                user = users.findByEmail("puvaneshwari@psgitech.ac.in")
                            .or(() -> users.findByEmail("jeyashree@psgitech.ac.in"))
                            .or(() -> users.findByEmail("warden@college.edu"));
            } else if (input.contains("supervisor1") || input.contains("indra")) {
                user = users.findByEmail("supervisor1@psgitech.ac.in");
            } else if (input.contains("supervisor2") || input.contains("thangam")) {
                user = users.findByEmail("supervisor2@psgitech.ac.in");
            } else if (input.contains("supervisor3") || input.contains("archana")) {
                user = users.findByEmail("supervisor3@psgitech.ac.in");
            } else if (input.contains("supervisor")) {
                user = users.findByEmail("supervisor1@psgitech.ac.in")
                            .or(() -> users.findByEmail("supervisor@college.edu"));
            }
        }

        if (user.isEmpty() || !encoder.matches(req.password(), user.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email, Warden ID, or password");
        }

        var u = user.get();
        String roleName = u.getRole().name();
        if (u.getRole() == com.campuscare.user.Role.STAFF) {
            if (u.getEmail().toLowerCase().contains("supervisor") || u.getName().toLowerCase().contains("supervisor")) {
                roleName = "SUPERVISOR";
            } else {
                roleName = "WARDEN";
            }
        }
        return ResponseEntity.ok(new LoginResponse(
                jwt.generate(u.getEmail(), u.getRole().name()),
                u.getId(),
                u.getName(),
                u.getEmail(),
                roleName,
                u.getRoomNumber(),
                u.getFloorNumber(),
                u.isFloorRep()
        ));
    }
}
