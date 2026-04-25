package com.hackathon.domain.prediction;

import jakarta.persistence.Embeddable;

@Embeddable
public class GrowthRate {
	private Double percentageValue;

	protected GrowthRate() {
	}

	public GrowthRate(Double percentageValue) {
		validateValue(percentageValue);
		this.percentageValue = percentageValue;
	}

	private void validateValue(Double value) {
		boolean isInvalid = value == null;
		if (isInvalid) {
			throw new IllegalArgumentException("성장률은 null일 수 없습니다");
		}
	}

	public Double getPercentageValue() {
		return percentageValue;
	}
}
