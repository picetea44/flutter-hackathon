package com.hackathon.infrastructure.persistence;

import com.hackathon.domain.statement.Statement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatementRepository extends JpaRepository<Statement, Long> {
	List<Statement> findByPublishedAtAfter(LocalDateTime publishedAfter);

	List<Statement> findByPublishedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
}
