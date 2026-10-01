package com.campuscare.announcement; 
import org.springframework.data.jpa.repository.JpaRepository; 
import java.util.*; 
public interface AnnouncementRepository extends JpaRepository<Announcement,Long>{List<Announcement> findAllByOrderByPinnedDescCreatedAtDesc();}
