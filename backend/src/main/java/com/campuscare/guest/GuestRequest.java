package com.campuscare.guest;
import com.campuscare.user.User;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDate;
@Entity @Table(name="guest_requests") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuestRequest {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @ManyToOne(optional=false) User student;
 @Column(nullable=false) String guestName;
 @Column(nullable=false) LocalDate checkIn;
 @Column(nullable=false) LocalDate checkOut;
 private String checkInTime;
 private String checkOutTime;
 @Enumerated(EnumType.STRING) @Column(nullable=false) GuestStatus status;
 @Enumerated(EnumType.STRING) GuestPresence guestStatus;
 String room;
}
