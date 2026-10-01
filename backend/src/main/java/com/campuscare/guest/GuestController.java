package com.campuscare.guest;

import com.campuscare.user.*; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate; import java.util.*;

@RestController @RequestMapping("/api/guests") @RequiredArgsConstructor
public class GuestController {
 private final GuestRequestRepository repo; private final UserRepository users;
 private static final List<String> ROOMS=java.util.stream.IntStream.rangeClosed(801,840).mapToObj(String::valueOf).toList();
 record GuestDto(Long id,String student,String guest,String checkIn,String checkOut,String status,String room,String guestStatus){}
 record CreateGuest(String guest,String checkIn,String checkOut){}
 @GetMapping public List<GuestDto> all(Authentication a){ User me=me(a); if(me.getRole()==Role.STUDENT)return repo.findAllByOrderByCheckInDesc().stream().filter(g->g.getStudent().getId().equals(me.getId())).map(this::dto).toList(); return repo.findAllByOrderByCheckInDesc().stream().map(this::dto).toList(); }
 @PostMapping public GuestDto create(@RequestBody CreateGuest r,Authentication a){ User me=me(a); if(me.getRole()!=Role.STUDENT)throw new ResponseStatusException(HttpStatus.FORBIDDEN); LocalDate in=LocalDate.parse(r.checkIn()),out=LocalDate.parse(r.checkOut()); if(out.isBefore(in))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Check-out must be after check-in"); GuestRequest g=repo.save(GuestRequest.builder().student(me).guestName(r.guest()).checkIn(in).checkOut(out).status(GuestStatus.PENDING).build()); return dto(g); }
 @GetMapping("/availability") public Map<String,Object> availability(@RequestParam String checkIn,@RequestParam String checkOut,@RequestParam(required=false) Long excludeId){ LocalDate in=LocalDate.parse(checkIn),out=LocalDate.parse(checkOut); List<String> booked=repo.findAll().stream().filter(g->g.getStatus()==GuestStatus.APPROVED&&g.getGuestStatus()!=GuestPresence.CHECKED_OUT).filter(g->excludeId==null||!g.getId().equals(excludeId)).filter(g->overlap(g.getCheckIn(),g.getCheckOut(),in,out)).map(GuestRequest::getRoom).filter(Objects::nonNull).toList(); List<String> free=ROOMS.stream().filter(r->!booked.contains(r)).toList(); return Map.of("rooms",free,"count",free.size()); }
 @PatchMapping("/{id}/approve") public GuestDto approve(@PathVariable Long id,@RequestParam String room,Authentication a){staff(a); GuestRequest g=repo.findById(id).orElseThrow(); if(!available(room,g.getCheckIn(),g.getCheckOut(),id))throw new ResponseStatusException(HttpStatus.CONFLICT,"Room is unavailable for these dates"); g.setStatus(GuestStatus.APPROVED);g.setRoom(room);g.setGuestStatus(GuestPresence.AWAITING);return dto(repo.save(g));}
 @PatchMapping("/{id}/reject") public GuestDto reject(@PathVariable Long id,Authentication a){staff(a); GuestRequest g=repo.findById(id).orElseThrow();g.setStatus(GuestStatus.REJECTED);return dto(repo.save(g));}
 @PatchMapping("/{id}/arrive") public GuestDto arrive(@PathVariable Long id,Authentication a){staff(a);GuestRequest g=repo.findById(id).orElseThrow();g.setGuestStatus(GuestPresence.CHECKED_IN);return dto(repo.save(g));}
 @PatchMapping("/{id}/depart") public GuestDto depart(@PathVariable Long id,Authentication a){staff(a);GuestRequest g=repo.findById(id).orElseThrow();g.setGuestStatus(GuestPresence.CHECKED_OUT);return dto(repo.save(g));}
 private boolean available(String room,LocalDate in,LocalDate out,Long ex){return ROOMS.contains(room)&&repo.findAll().stream().filter(g->g.getStatus()==GuestStatus.APPROVED&&g.getGuestStatus()!=GuestPresence.CHECKED_OUT&&room.equals(g.getRoom())&&!g.getId().equals(ex)).noneMatch(g->overlap(g.getCheckIn(),g.getCheckOut(),in,out));}
 private boolean overlap(LocalDate a,LocalDate b,LocalDate c,LocalDate d){return a!=null&&b!=null&&c!=null&&d!=null&&!a.isAfter(d)&&!c.isAfter(b);}
 private User me(Authentication a){return users.findByEmail(a.getName()).orElseThrow();} private void staff(Authentication a){if(me(a).getRole()!=Role.STAFF)throw new ResponseStatusException(HttpStatus.FORBIDDEN);}
 private GuestDto dto(GuestRequest g){return new GuestDto(g.getId(),g.getStudent().getName()+" · "+g.getStudent().getRoomNumber(),g.getGuestName(),g.getCheckIn().toString(),g.getCheckOut().toString(),title(g.getStatus().name()),g.getRoom(),g.getGuestStatus()==null?null:title(g.getGuestStatus().name()));}
 private String title(String s){return java.util.Arrays.stream(s.split("_")).map(x->x.substring(0,1)+x.substring(1).toLowerCase()).reduce((x,y)->x+" "+y).orElse(s);}
}
