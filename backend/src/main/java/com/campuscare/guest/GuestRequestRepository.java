package com.campuscare.guest;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface GuestRequestRepository extends JpaRepository<GuestRequest,Long>{ List<GuestRequest> findAllByOrderByCheckInDesc(); }
