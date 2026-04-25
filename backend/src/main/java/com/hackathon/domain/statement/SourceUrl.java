package com.hackathon.domain.statement;

import jakarta.persistence.Embeddable;

@Embeddable
public class SourceUrl {
	private String url;

	protected SourceUrl() {
	}

	public SourceUrl(String url) {
		validateUrl(url);
		this.url = url;
	}

	private void validateUrl(String url) {
		boolean isInvalid = url == null || url.isBlank();
		if (isInvalid) {
			throw new IllegalArgumentException("출처 URL은 비어있을 수 없습니다");
		}
	}

	public String getUrl() {
		return url;
	}
}
