package com.campuscare.parcel;

import com.campuscare.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    List<Parcel> findAllByOrderByArrivedAtDesc();
    List<Parcel> findByStudentOrderByArrivedAtDesc(User student);
    long countByStudentAndStatus(User student, ParcelStatus status);
    long countByStatus(ParcelStatus status);
}
