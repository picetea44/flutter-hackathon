package com.hackathon.infrastructure.ai;

import java.util.List;

public class AnalysisResult {
	private final Double aggressionScore;
	private final Double transactionalismScore;
	private final List<String> keywords;

	public AnalysisResult(Double aggressionScore, Double transactionalismScore, List<String> keywords) {
		this.aggressionScore = aggressionScore;
		this.transactionalismScore = transactionalismScore;
		this.keywords = keywords;
	}

	public Double getAggressionScore() {
		return aggressionScore;
	}

	public Double getTransactionalismScore() {
		return transactionalismScore;
	}

	public List<String> getKeywords() {
		return keywords;
	}
}
