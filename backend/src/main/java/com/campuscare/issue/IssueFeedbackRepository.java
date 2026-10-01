package com.campuscare.issue;

import com.campuscare.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IssueFeedbackRepository extends JpaRepository<IssueFeedback, Long> {
    Optional<IssueFeedback> findByIssueAndStudent(Issue issue, User student);
    boolean existsByIssueAndStudent(Issue issue, User student);
    List<IssueFeedback> findAllByOrderBySubmittedAtDesc();
}
