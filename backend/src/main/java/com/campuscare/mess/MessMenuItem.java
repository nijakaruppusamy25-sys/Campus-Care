package com.campuscare.mess;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="mess_menu", uniqueConstraints=@UniqueConstraint(columnNames={"dayOfWeek","meal"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessMenuItem { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false) String dayOfWeek; @Column(nullable=false) String meal; @Column(nullable=false,length=1000) String items; }
