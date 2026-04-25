package com.hackathon.domain.statement;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Keywords {
	private final List<String> values;

	public Keywords(List<String> values) {
		validateKeywords(values);
		this.values = new ArrayList<>(values);
	}

	private void validateKeywords(List<String> keywords) {
		boolean isInvalid = keywords == null || keywords.isEmpty();
		if (isInvalid) {
			throw new IllegalArgumentException("키워드 목록은 비어있을 수 없습니다");
		}
	}

	public List<String> getValues() {
		return Collections.unmodifiableList(values);
	}

	public int getSize() {
		return values.size();
	}

	public boolean contains(String keyword) {
		return values.contains(keyword);
	}
}
