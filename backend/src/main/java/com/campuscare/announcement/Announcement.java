package com.campuscare.announcement;
import com.campuscare.user.User; import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="announcements") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class Announcement{ @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false) String title; @Column(nullable=false,length=3000) String message; boolean pinned; @ManyToOne(optional=false) User author; @Column(nullable=false) LocalDateTime createdAt; }
