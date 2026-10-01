package com.campuscare.parcel;

import com.campuscare.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parcels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User student;

    @Column(nullable = false)
    private String courier;

    private String trackingNumber;

    private String storageLocation;

    private String notes;

    @Column(nullable = false)
    private String otp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParcelStatus status;

    @Column(nullable = false)
    private LocalDateTime arrivedAt;

    private LocalDateTime collectedAt;

    private String collectedBy;
}
