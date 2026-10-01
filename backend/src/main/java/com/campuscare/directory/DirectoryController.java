package com.campuscare.directory; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/directory") @RequiredArgsConstructor public class DirectoryController{private final DirectoryRepository repo;@GetMapping public List<DirectoryEntry> all(){return repo.findAll();}}
