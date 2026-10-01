package com.campuscare.issue;

import com.campuscare.user.Role;
import com.campuscare.user.User;
import com.campuscare.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class IssueFeedbackController {
    private final IssueRepository issues;
    private final IssueFeedbackRepository feedback;
    private final UserRepository users;

    public record FeedbackRequest(@NotNull @Min(1) @Max(5) Integer rating, String comment) {}
    public record FeedbackDto(Long id, Long issueId, String student, Integer rating, String comment, LocalDateTime submittedAt) {}
    public record FeedbackSummary(long total, double average, Map<Integer, Long> counts, List<FeedbackDto> recent) {}

    @PostMapping("/issues/{issueId}/feedback")
    @ResponseStatus(HttpStatus.CREATED)
    public FeedbackDto submit(@PathVariable Long issueId, @Valid @RequestBody FeedbackRequest request, Authentication auth) {
        User student = currentUser(auth);
        Issue issue = issue(issueId);
        if (!issue.getAuthor().getId().equals(student.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the student who reported this issue can submit feedback");
        }
        if (issue.getStatus() != IssueStatus.RESOLVED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Feedback is available only after the issue is resolved");
        }
        if (feedback.existsByIssueAndStudent(issue, student)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Feedback has already been submitted for this issue");
        }
        IssueFeedback saved = feedback.save(IssueFeedback.builder()
                .issue(issue)
                .student(student)
                .rating(request.rating())
                .comment(cleanComment(request.comment()))
                .submittedAt(LocalDateTime.now())
                .build());
        return dto(saved);
    }

    @GetMapping("/issues/{issueId}/feedback")
    public FeedbackDto get(@PathVariable Long issueId, Authentication auth) {
        User viewer = currentUser(auth);
        Issue issue = issue(issueId);
        if (viewer.getRole() != Role.STAFF && !issue.getAuthor().getId().equals(viewer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view feedback for this issue");
        }
        return feedback.findByIssueAndStudent(issue, issue.getAuthor()).map(this::dto).orElse(null);
    }

    @GetMapping("/feedback")
    public FeedbackSummary all(Authentication auth) {
        requireStaff(auth);
        List<IssueFeedback> entries = feedback.findAllByOrderBySubmittedAtDesc();
        Map<Integer, Long> counts = new LinkedHashMap<>();
        for (int rating = 5; rating >= 1; rating--) {
            int selectedRating = rating;
            counts.put(rating, entries.stream().filter(item -> item.getRating() == selectedRating).count());
        }
        double average = entries.stream().mapToInt(IssueFeedback::getRating).average().orElse(0);
        return new FeedbackSummary(entries.size(), Math.round(average * 10) / 10.0, counts,
                entries.stream().limit(10).map(this::dto).toList());
    }

    private Issue issue(Long id) {
        return issues.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));
    }

    private User currentUser(Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        return users.findByEmail(auth.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void requireStaff(Authentication auth) {
        if (currentUser(auth).getRole() != Role.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff access required");
        }
    }

    private FeedbackDto dto(IssueFeedback item) {
        return new FeedbackDto(item.getId(), item.getIssue().getId(), item.getStudent().getName(), item.getRating(), item.getComment(), item.getSubmittedAt());
    }

    private String cleanComment(String comment) {
        if (comment == null || comment.isBlank()) return null;
        return comment.trim();
    }
}
