package com.campuscare.issue;

import com.campuscare.user.*;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.*; import java.nio.file.*; import java.time.*; import java.util.*;

@RestController @RequestMapping("/api/issues") @RequiredArgsConstructor
public class IssueController {
 private final IssueRepository issues; private final IssueVoteRepository votes; private final IssueFeedbackRepository feedback; private final UserRepository users;
 @Value("${app.upload-dir}") private String uploadDir;

 record IssueDto(Long id,String department,Integer floor,String location,String description,String photoUrl,String status,long votes,boolean voted,String author,String room,String time,boolean urgent,boolean isPrivate,IssueFeedbackController.FeedbackDto feedback,boolean assignedToSupervisor,String assignedTechnician,String wardenInstructions,String assignedAt,boolean workCompleted,String supervisorReport,String completedAt){}
 record CreateIssue(String department,Integer floor,String location,String description){}
 record AssignSupervisorRequest(String technician, String instructions){}
 record ReportCompletionRequest(String report){}

 @GetMapping public List<IssueDto> all(Authentication auth){ User me=users.findByEmail(auth.getName()).orElseThrow(); return issues.findAllByOrderByCreatedAtDesc().stream().filter(i->me.getRole()==Role.STAFF||!i.isPrivate()||i.getAuthor().getId().equals(me.getId())).map(i->dto(i,me)).toList(); }
 @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
 public IssueDto create(@RequestPart("department") String department,@RequestPart(value="floor",required=false) Integer floor,@RequestPart("location") String location,@RequestPart("description") String description,@RequestPart(value="isPrivate",required=false) String isPrivate,@RequestPart(value="photo",required=false) MultipartFile photo,Authentication auth) throws IOException {
   User me=users.findByEmail(auth.getName()).orElseThrow(); String photoUrl=null;
   if(photo!=null&&!photo.isEmpty()){ Path dir=Paths.get(uploadDir); Files.createDirectories(dir); String name=UUID.randomUUID()+"-"+Path.of(photo.getOriginalFilename()).getFileName(); Files.copy(photo.getInputStream(),dir.resolve(name),StandardCopyOption.REPLACE_EXISTING); photoUrl="/uploads/"+name; }
   boolean privateIssue=isPrivate!=null&&(isPrivate.equalsIgnoreCase("true")||isPrivate.equals("1"));
   Issue i=issues.save(Issue.builder().department(department).floorNumber(floor).location(location).description(description).photoUrl(photoUrl).status(IssueStatus.REPORTED).isPrivate(privateIssue).author(me).createdAt(LocalDateTime.now()).build()); return dto(i,me);
 }
 @PostMapping("/{id}/vote") public IssueDto vote(@PathVariable Long id,Authentication auth){ User me=users.findByEmail(auth.getName()).orElseThrow(); Issue i=issues.findById(id).orElseThrow(); if(i.isPrivate()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Private room issues do not accept community votes"); if(votes.existsByIssueAndUser(i,me)) votes.deleteByIssueAndUser(i,me); else votes.save(IssueVote.builder().issue(i).user(me).build()); return dto(i,me); }

 @PostMapping("/{id}/assign-supervisor")
 public IssueDto assignSupervisor(@PathVariable Long id, @RequestBody AssignSupervisorRequest req, Authentication auth) {
   User me=users.findByEmail(auth.getName()).orElseThrow();
   if(me.getRole()!=Role.STAFF) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
   Issue i=issues.findById(id).orElseThrow();
   i.setAssignedToSupervisor(true);
   i.setAssignedTechnician(req.technician()!=null&&!req.technician().isBlank()?req.technician().trim():"General Maintenance");
   i.setWardenInstructions(req.instructions()!=null?req.instructions().trim():"");
   i.setAssignedAt(LocalDateTime.now());
   i.setStatus(IssueStatus.IN_PROGRESS);
   return dto(issues.save(i),me);
 }

 @PostMapping("/{id}/report-completion")
 public IssueDto reportCompletion(@PathVariable Long id, @RequestBody ReportCompletionRequest req, Authentication auth) {
   User me=users.findByEmail(auth.getName()).orElseThrow();
   if(me.getRole()!=Role.STAFF) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
   Issue i=issues.findById(id).orElseThrow();
   i.setWorkCompleted(true);
   i.setSupervisorReport(req.report()!=null&&!req.report().isBlank()?req.report().trim():"Work completed and verified on site.");
   i.setCompletedAt(LocalDateTime.now());
   i.setStatus(IssueStatus.WORK_COMPLETED);
   return dto(issues.save(i),me);
 }

 @PostMapping("/{id}/resolve")
 public IssueDto resolve(@PathVariable Long id, Authentication auth) {
   User me=users.findByEmail(auth.getName()).orElseThrow();
   if(me.getRole()!=Role.STAFF) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
   Issue i=issues.findById(id).orElseThrow();
   i.setStatus(IssueStatus.RESOLVED);
   return dto(issues.save(i),me);
 }

 @PatchMapping("/{id}/status") public IssueDto status(@PathVariable Long id,@RequestParam IssueStatus status,Authentication auth){ User me=users.findByEmail(auth.getName()).orElseThrow(); if(me.getRole()!=Role.STAFF) throw new ResponseStatusException(HttpStatus.FORBIDDEN); Issue i=issues.findById(id).orElseThrow(); i.setStatus(status); return dto(issues.save(i),me); }
 @GetMapping("/mine") public List<IssueDto> mine(Authentication auth){ User me=users.findByEmail(auth.getName()).orElseThrow(); return issues.findAllByOrderByCreatedAtDesc().stream().filter(i->i.getAuthor().getId().equals(me.getId())).map(i->dto(i,me)).toList(); }
 private IssueDto dto(Issue i,User me){
   long v=votes.countByIssue(i);
   IssueFeedbackController.FeedbackDto item=feedback.findByIssueAndStudent(i,i.getAuthor()).map(x->new IssueFeedbackController.FeedbackDto(x.getId(),x.getIssue().getId(),x.getStudent().getName(),x.getRating(),x.getComment(),x.getSubmittedAt())).orElse(null);
   String assignedTime=i.getAssignedAt()!=null?relative(i.getAssignedAt()):null;
   String completedTime=i.getCompletedAt()!=null?relative(i.getCompletedAt()):null;
   return new IssueDto(i.getId(),i.getDepartment(),i.getFloorNumber(),i.getLocation(),i.getDescription(),i.getPhotoUrl(),i.getStatus().name().replace('_',' '),v,votes.existsByIssueAndUser(i,me),i.getAuthor().getName(),i.getAuthor().getRoomNumber(),relative(i.getCreatedAt()),!i.isPrivate()&&v>=15&&i.getStatus()!=IssueStatus.RESOLVED,i.isPrivate(),item,i.isAssignedToSupervisor(),i.getAssignedTechnician(),i.getWardenInstructions(),assignedTime,i.isWorkCompleted(),i.getSupervisorReport(),completedTime);
 }
 private String relative(LocalDateTime t){ long h=Duration.between(t,LocalDateTime.now()).toHours(); if(h<1)return "now"; if(h<24)return h+"h ago"; long d=h/24; return d+"d ago"; }
}
