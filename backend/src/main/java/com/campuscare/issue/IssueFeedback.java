package com.campuscare.issue;

import com.campuscare.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_feedback", uniqueConstraints = @UniqueConstraint(columnNames = {"issue_id", "student_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Issue issue;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private User student;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 2000)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime submittedAt;
}
