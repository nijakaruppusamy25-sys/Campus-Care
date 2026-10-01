package com.campuscare.issue;
import com.campuscare.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface IssueVoteRepository extends JpaRepository<IssueVote,Long> {
	boolean existsByIssueAndUser(Issue issue, User user);

	@Modifying
	@Transactional
	void deleteByIssueAndUser(Issue issue, User user);

	long countByIssue(Issue issue);
}
