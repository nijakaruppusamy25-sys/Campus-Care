package com.campuscare.lostitem;

import com.campuscare.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lost_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String itemType; // "LOST" or "FOUND"

    @Column(nullable = false)
    private String location; // e.g. "Mess", "Laundry Room", "Bucket / 5th Floor"

    private String roomNumber; // e.g. "507", "605", "501", "615"

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(name = "photo_url", columnDefinition = "LONGTEXT")
    private String photoUrl;

    @Column(nullable = false)
    private String status; // "OPEN" or "CLAIMED"

    @ManyToOne(optional = false)
    private User author;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime claimedAt;
}
