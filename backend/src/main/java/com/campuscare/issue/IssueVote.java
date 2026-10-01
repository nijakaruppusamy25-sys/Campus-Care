package com.campuscare.issue;

import com.campuscare.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="issue_votes", uniqueConstraints=@UniqueConstraint(columnNames={"issue_id","user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueVote {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Issue issue;
 @ManyToOne(optional=false) private User user;
}
