package com.campuscare.config;

import com.campuscare.announcement.*;
import com.campuscare.directory.*;
import com.campuscare.guest.*;
import com.campuscare.issue.*;
import com.campuscare.mess.*;
import com.campuscare.parcel.*;
import com.campuscare.user.Role;
import com.campuscare.user.User;
import com.campuscare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.*; import java.util.*;

@Configuration @RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
 private final UserRepository users; private final PasswordEncoder encoder; private final IssueRepository issues; private final IssueVoteRepository votes; private final GuestRequestRepository guests; private final MessMenuRepository menu; private final AnnouncementRepository announcements; private final DirectoryRepository directory; private final ParcelRepository parcels;
 @Override public void run(String... args){
  if(users.count()==0){
    User a=users.save(User.builder().email("24z202@psgitech.ac.in").password(encoder.encode("password123")).name("Nija K").role(Role.STUDENT).roomNumber("214").floorNumber(2).floorRep(true).build());
    User k=users.save(User.builder().email("24z200@psgitech.ac.in").password(encoder.encode("password123")).name("Navina M").role(Role.STUDENT).roomNumber("201").floorNumber(2).build());
    User s=users.save(User.builder().email("24z201@psgitech.ac.in").password(encoder.encode("password123")).name("Nethrshri S").role(Role.STUDENT).roomNumber("202").floorNumber(2).build());
    User r=users.save(User.builder().email("24z173@psgitech.ac.in").password(encoder.encode("password123")).name("Kavinaya S").role(Role.STUDENT).roomNumber("203").floorNumber(2).build());
    User p=users.save(User.builder().email("24z211@psgitech.ac.in").password(encoder.encode("password123")).name("Poojashri V").role(Role.STUDENT).roomNumber("204").floorNumber(2).build());
    User pr=users.save(User.builder().email("24z216@psgitech.ac.in").password(encoder.encode("password123")).name("Prathiksha N").role(Role.STUDENT).roomNumber("205").floorNumber(2).build());
    User staff=users.save(User.builder().email("staff@college.edu").password(encoder.encode("password123")).name("Staff").role(Role.STAFF).build());
   Issue i1=issues.save(issue("Common Restroom",2,"Block C, Floor 2","Two taps leaking near entrance.",a,IssueStatus.IN_PROGRESS,2));Issue i2=issues.save(issue("Study Hall",1,"Floor 1, Hall B","Tube lights flickering.",k,IssueStatus.REPORTED,4));Issue i3=issues.save(issue("Lift",null,"Block A","Grinding noise between floor 3–4.",s,IssueStatus.REPORTED,6));Issue i4=issues.save(issue("Mess",0,"Ground floor","Water dispenser empty since yesterday.",r,IssueStatus.RESOLVED,1));
   Issue i5=issues.save(Issue.builder().department("Attached Restroom").floorNumber(2).location("Room 214").description("Attached bathroom washbasin tap dripping continuously.").author(a).status(IssueStatus.REPORTED).isPrivate(true).createdAt(LocalDateTime.now().minusHours(4)).build());
   seedVotes(i1,a,14);seedVotes(i2,k,9);seedVotes(i3,s,22);seedVotes(i4,r,5);
   guests.save(GuestRequest.builder().student(a).guestName("Radha Ramesh (Mother)").checkIn(LocalDate.of(2026,8,25)).checkOut(LocalDate.of(2026,8,27)).status(GuestStatus.PENDING).build());
   guests.save(GuestRequest.builder().student(k).guestName("Thomas Mathew (Father)").checkIn(LocalDate.of(2026,8,20)).checkOut(LocalDate.of(2026,8,24)).status(GuestStatus.APPROVED).room("804").guestStatus(GuestPresence.CHECKED_IN).build());
   guests.save(GuestRequest.builder().student(s).guestName("Nisha Pillai (Sister)").checkIn(LocalDate.of(2026,8,22)).checkOut(LocalDate.of(2026,8,23)).status(GuestStatus.PENDING).build());
    announcements.save(Announcement.builder().title("Biometric Attendance").message("Mark your biometric attendance by 7:00 PM every night.").pinned(true).author(staff).createdAt(LocalDateTime.now().minusHours(3)).build()); announcements.save(Announcement.builder().title("Hall Inspection").message("Rooms will be inspected Saturday morning. Please keep them tidy.").author(staff).createdAt(LocalDateTime.now().minusDays(2)).build());
   if(directory.count()==0) List.of(new String[]{"Electrician","Murugan K.","+91 98765 43210"},new String[]{"Plumber","Raghavan S.","+91 98765 43211"},new String[]{"Carpenter","Vijay R.","+91 98765 43212"},new String[]{"Food Department","Mess Office","+91 98765 43213"},new String[]{"Clinic","Health Centre","+91 98765 43214"},new String[]{"Emergency","Security Desk","+91 98765 43215"}).forEach(x->directory.save(DirectoryEntry.builder().role(x[0]).name(x[1]).phone(x[2]).build()));
    }
  if(parcels.count()==0){
   User a=users.findByEmail("24z202@psgitech.ac.in").orElse(null);
   User k=users.findByEmail("24z200@psgitech.ac.in").orElse(null);
   User s=users.findByEmail("24z201@psgitech.ac.in").orElse(null);
   if(a!=null) parcels.save(Parcel.builder().student(a).courier("Amazon").trackingNumber("AMZN-IN-839210").storageLocation("Gate 1 Security Desk (Shelf A-2)").notes("Cardboard box - Study lamp & books").otp("4812").status(ParcelStatus.WAITING_PICKUP).arrivedAt(LocalDateTime.now().minusHours(2)).build());
   if(k!=null) parcels.save(Parcel.builder().student(k).courier("India Post").trackingNumber("SP-KL-4091").storageLocation("Security Counter").notes("Speed Post - Homemade snacks box from Kerala (Perishable)").otp("2931").status(ParcelStatus.WAITING_PICKUP).arrivedAt(LocalDateTime.now().minusHours(4)).build());
   if(s!=null) parcels.save(Parcel.builder().student(s).courier("Flipkart").trackingNumber("FK-992144").storageLocation("Gate 1 Security Desk").notes("Noise-cancelling earphones").otp("7104").status(ParcelStatus.COLLECTED).arrivedAt(LocalDateTime.now().minusDays(1)).collectedAt(LocalDateTime.now().minusHours(5)).collectedBy("Verified with OTP").build());
  }
  if(users.findByEmail("puvaneshwari@psgitech.ac.in").isEmpty()){
   users.save(User.builder().email("puvaneshwari@psgitech.ac.in").password(encoder.encode("password123")).name("Puvaneshwari").role(Role.STAFF).build());
  }
  if(users.findByEmail("jeyashree@psgitech.ac.in").isEmpty()){
   users.save(User.builder().email("jeyashree@psgitech.ac.in").password(encoder.encode("password123")).name("Jeyashree").role(Role.STAFF).build());
  }
  if(users.findByEmail("supervisor1@psgitech.ac.in").isEmpty()){
   users.save(User.builder().email("supervisor1@psgitech.ac.in").password(encoder.encode("password123")).name("Indra (Supervisor)").role(Role.STAFF).build());
  }
  if(users.findByEmail("supervisor2@psgitech.ac.in").isEmpty()){
   users.save(User.builder().email("supervisor2@psgitech.ac.in").password(encoder.encode("password123")).name("Thangam (Supervisor)").role(Role.STAFF).build());
  }
  if(users.findByEmail("supervisor3@psgitech.ac.in").isEmpty()){
   users.save(User.builder().email("supervisor3@psgitech.ac.in").password(encoder.encode("password123")).name("Archana (Supervisor)").role(Role.STAFF).build());
  }
  syncDirectory();
  syncMenu();
 }
 private Issue issue(String d,Integer f,String l,String desc,User u,IssueStatus st,int days){return Issue.builder().department(d).floorNumber(f).location(l).description(desc).author(u).status(st).isPrivate(false).createdAt(LocalDateTime.now().minusDays(days)).build();}
 private void seedVotes(Issue issue,User author,int n){for(int i=0;i<n;i++){User u=users.findAll().get(i%users.findAll().size());if(!votes.existsByIssueAndUser(issue,u))votes.save(IssueVote.builder().issue(issue).user(u).build());}}
 private void syncMenu(){
    Map<String,Map<String,String>> menuByDay = new LinkedHashMap<>();
    menuByDay.put("Mon", Map.of("Breakfast","Idli + Sambar","Lunch","Rice + Sambar + Poriyal + Curd","Snacks","Tea + Biscuits","Dinner","Chapati + Kurma"));
    menuByDay.put("Tue", Map.of("Breakfast","Dosa + Chutney","Lunch","Lemon Rice + Potato Fry + Curd","Snacks","Sundal + Tea","Dinner","Idiyappam + Coconut Milk"));
    menuByDay.put("Wed", Map.of("Breakfast","Ven Pongal + Sambar","Lunch","Rice + Rasam + Beans Poriyal","Snacks","Bajji + Tea","Dinner","Dosa + Sambar"));
    menuByDay.put("Thu", Map.of("Breakfast","Poori + Masala","Lunch","Tomato Rice + Egg/Paneer + Curd","Snacks","Bonda + Tea","Dinner","Chapati + Paneer Curry"));
    menuByDay.put("Fri", Map.of("Breakfast","Upma + Chutney","Lunch","Rice + Sambar + Avial","Snacks","Banana + Tea","Dinner","Parotta + Salna"));
    menuByDay.put("Sat", Map.of("Breakfast","Vada + Sambar","Lunch","Vegetable Biryani + Raita","Snacks","Murukku + Coffee","Dinner","Vegetable Kothu Parotta"));
    menuByDay.put("Sun", Map.of("Breakfast","Rava Dosa + Chutney","Lunch","Rice + Mor Kuzhambu + Poriyal","Snacks","Vada + Tea","Dinner","Pongal + Chutney"));
    menuByDay.forEach((day, meals) -> meals.forEach((meal, items) -> {
     MessMenuItem entry = menu.findByDayOfWeekAndMeal(day, meal)
         .orElseGet(() -> MessMenuItem.builder().dayOfWeek(day).meal(meal).build());
     entry.setItems(items);
     menu.save(entry);
    }));
 }

  private void syncDirectory() {
    List<String[]> entries = List.of(
        new String[]{"Electrician", "Murugan K.", "+91 98765 43210"},
        new String[]{"Plumber", "Raghavan S.", "+91 98765 43211"},
        new String[]{"Carpenter", "Vijay R.", "+91 98765 43212"},
        new String[]{"Food Department", "Mess Office", "+91 98765 43213"},
        new String[]{"Clinic", "Health Centre", "+91 98765 43214"},
        new String[]{"Emergency", "Security Desk", "+91 98765 43215"},
        new String[]{"Hostel Warden", "Puvaneshwari (Chief Warden)", "+91 98765 43220"},
        new String[]{"Hostel Warden", "Jeyashree (Resident Warden)", "+91 98765 43224"},
        new String[]{"Hostel Supervisor", "Indra (Supervisor Desk - Block A & B)", "+91 98765 43221"},
        new String[]{"Hostel Supervisor", "Thangam (Supervisor Desk - Block C & Services)", "+91 98765 43222"},
        new String[]{"Hostel Supervisor", "Archana (Supervisor Desk - Mess & Common)", "+91 98765 43223"}
    );
    for (String[] e : entries) {
      if (directory.findAll().stream().noneMatch(x -> x.getPhone().equals(e[2]))) {
        directory.save(DirectoryEntry.builder().role(e[0]).name(e[1]).phone(e[2]).build());
      }
    }
  }
}
