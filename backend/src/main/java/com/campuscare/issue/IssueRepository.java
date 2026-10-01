package com.campuscare.issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface IssueRepository extends JpaRepository<Issue,Long> { List<Issue> findAllByOrderByCreatedAtDesc(); }
