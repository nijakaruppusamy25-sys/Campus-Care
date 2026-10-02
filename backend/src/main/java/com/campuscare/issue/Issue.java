package com.campuscare.issue;

import com.campuscare.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="issues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Issue {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String department;
 private Integer floorNumber;
 @Column(nullable=false) private String location;
 @Column(nullable=false, length=2000) private String description;
 @Column(name = "photo_url", columnDefinition = "LONGTEXT")
 private String photoUrl;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private IssueStatus status;
 private boolean isPrivate;
 @ManyToOne(optional=false) private User author;
 @Column(nullable=false) private LocalDateTime createdAt;

 private boolean assignedToSupervisor;
 private String assignedTechnician;
 @Column(length=1000) private String wardenInstructions;
 private LocalDateTime assignedAt;

 private boolean workCompleted;
 @Column(length=1000) private String supervisorReport;
 private LocalDateTime completedAt;
}
