package com.hackathon.domain.statement;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Statement 엔티티 테스트")
class StatementTest {
	@Test
	@DisplayName("유효한 원문과 메타데이터로 Statement를 생성할 수 있다")
	void createStatement_success() {
		SourceUrl sourceUrl = new SourceUrl("https://example.com/article");
		Keywords keywords = new Keywords(List.of("트럼프", "경제"));
		LocalDateTime publishedAt = LocalDateTime.now();

		Statement statement = new Statement("원문내용", sourceUrl, keywords, publishedAt);

		assertEquals("원문내용", statement.getContent());
		assertEquals(sourceUrl, statement.getSourceUrl());
		assertEquals(publishedAt, statement.getPublishedAt());
		assertNotNull(statement.getCreatedAt());
	}

	@Test
	@DisplayName("AI 분석 결과로 Statement를 업데이트할 수 있다")
	void analyzeWith_success() {
		SourceUrl sourceUrl = new SourceUrl("https://example.com/article");
		Keywords keywords = new Keywords(List.of("경제"));
		Statement statement = new Statement("원문", sourceUrl, keywords, LocalDateTime.now());

		AggressionIndex aggression = new AggressionIndex(0.8);
		TransactionalismIndex transactionalism = new TransactionalismIndex(0.6);

		statement.analyzeWith(aggression, transactionalism);

		assertEquals(0.8, statement.getAggressionIndex().getValue());
		assertEquals(0.6, statement.getTransactionalismIndex().getValue());
	}
}
