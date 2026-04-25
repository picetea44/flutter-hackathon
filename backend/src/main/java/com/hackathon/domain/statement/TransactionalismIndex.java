package com.hackathon.domain.statement;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class TransactionalismIndex {
	@Column(name = "transactionalism_index_value")
	private Double value;

	protected TransactionalismIndex() {
	}

	public TransactionalismIndex(Double value) {
		validateRange(value);
		this.value = value;
	}

	private void validateRange(Double value) {
		boolean isInvalid = value == null || value < 0.0 || value > 1.0;
		if (isInvalid) {
			throw new IllegalArgumentException("거래주의 지수는 0.0 ~ 1.0 사이여야 합니다");
		}
	}

	public Double getValue() {
		return value;
	}
}
