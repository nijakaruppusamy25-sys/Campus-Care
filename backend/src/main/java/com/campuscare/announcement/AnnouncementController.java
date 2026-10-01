package com.campuscare.announcement;
import com.campuscare.user.*; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException; import java.time.*; import java.util.*;
@RestController @RequestMapping("/api/announcements") @RequiredArgsConstructor public class AnnouncementController{
 private final AnnouncementRepository repo; private final UserRepository users;
 record Dto(Long id,String title,String message,boolean pinned,String author,String time){}
 @GetMapping public List<Dto> all(){return repo.findAllByOrderByPinnedDescCreatedAtDesc().stream().map(this::dto).toList();}
 @PostMapping public Dto create(@RequestBody Map<String,Object> body,Authentication a){User u=users.findByEmail(a.getName()).orElseThrow();if(u.getRole()!=Role.STAFF)throw new ResponseStatusException(HttpStatus.FORBIDDEN);Announcement x=repo.save(Announcement.builder().title(String.valueOf(body.get("title"))).message(String.valueOf(body.get("message"))).pinned(Boolean.TRUE.equals(body.get("pinned"))).author(u).createdAt(LocalDateTime.now()).build());return dto(x);}
 private Dto dto(Announcement a){long d=Duration.between(a.getCreatedAt(),LocalDateTime.now()).toHours()/24;String t=d==0?"today":d+"d ago";return new Dto(a.getId(),a.getTitle(),a.getMessage(),a.isPinned(),a.getAuthor().getName(),t);}
}
