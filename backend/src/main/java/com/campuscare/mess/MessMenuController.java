package com.campuscare.mess;
import com.campuscare.user.*; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException; import java.util.*;
@RestController @RequestMapping("/api/mess") @RequiredArgsConstructor public class MessMenuController{
 private final MessMenuRepository repo; private final UserRepository users;
 @GetMapping public List<MessMenuItem> all(){return repo.findAllByOrderByIdAsc();}
 @PutMapping("/{id}") public MessMenuItem update(@PathVariable Long id,@RequestBody Map<String,String> body,Authentication a){staff(a); MessMenuItem m=repo.findById(id).orElseThrow();m.setItems(body.getOrDefault("items",m.getItems()));return repo.save(m);}
 private void staff(Authentication a){if(users.findByEmail(a.getName()).orElseThrow().getRole()!=Role.STAFF)throw new ResponseStatusException(HttpStatus.FORBIDDEN);}
}
