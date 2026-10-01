package com.campuscare.directory; import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="directory") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class DirectoryEntry{@Id @GeneratedValue(strategy=GenerationType.IDENTITY)Long id;String role;String name;String phone;}
