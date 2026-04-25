package com.hackathon.domain.statement;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "statements")
public class Statement {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long identifier;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@Embedded
	private SourceUrl sourceUrl;

	@Embedded
	private AggressionIndex aggressionIndex;

	@Embedded
	private TransactionalismIndex transactionalismIndex;

	private String keywordsJson;

	@Column(nullable = false)
	private LocalDateTime publishedAt;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	protected Statement() {
	}

	public Statement(String content, SourceUrl sourceUrl, Keywords keywords, LocalDateTime publishedAt) {
		this.content = content;
		this.sourceUrl = sourceUrl;
		this.keywordsJson = serializeKeywords(keywords);
		this.publishedAt = publishedAt;
		this.createdAt = LocalDateTime.now();
	}

	private String serializeKeywords(Keywords keywords) {
		return String.join(",", keywords.getValues());
	}

	public void analyzeWith(AggressionIndex aggression, TransactionalismIndex transactionalism) {
		this.aggressionIndex = aggression;
		this.transactionalismIndex = transactionalism;
	}

	public Long getIdentifier() {
		return identifier;
	}

	public String getContent() {
		return content;
	}

	public SourceUrl getSourceUrl() {
		return sourceUrl;
	}

	public AggressionIndex getAggressionIndex() {
		return aggressionIndex;
	}

	public TransactionalismIndex getTransactionalismIndex() {
		return transactionalismIndex;
	}

	public LocalDateTime getPublishedAt() {
		return publishedAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
