package com.hackathon.infrastructure.crawler;

import java.time.LocalDateTime;

public class CrawledArticle {
	private final String title;
	private final String content;
	private final String sourceUrl;
	private final LocalDateTime publishedAt;

	public CrawledArticle(String title, String content, String sourceUrl, LocalDateTime publishedAt) {
		this.title = title;
		this.content = content;
		this.sourceUrl = sourceUrl;
		this.publishedAt = publishedAt;
	}

	public String getTitle() {
		return title;
	}

	public String getContent() {
		return content;
	}

	public String getSourceUrl() {
		return sourceUrl;
	}

	public LocalDateTime getPublishedAt() {
		return publishedAt;
	}
}
