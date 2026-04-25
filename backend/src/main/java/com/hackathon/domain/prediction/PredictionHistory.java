package com.hackathon.domain.prediction;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_histories")
public class PredictionHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long identifier;

	@Embedded
	private GrowthRate growthRate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MarketIndex targetMarketIndex;

	@Column(nullable = false, updatable = false)
	private LocalDateTime predictedAt;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	protected PredictionHistory() {
	}

	public PredictionHistory(GrowthRate growthRate, MarketIndex targetMarketIndex) {
		this.growthRate = growthRate;
		this.targetMarketIndex = targetMarketIndex;
		this.predictedAt = LocalDateTime.now();
		this.createdAt = LocalDateTime.now();
	}

	public Long getIdentifier() {
		return identifier;
	}

	public GrowthRate getGrowthRate() {
		return growthRate;
	}

	public MarketIndex getTargetMarketIndex() {
		return targetMarketIndex;
	}

	public LocalDateTime getPredictedAt() {
		return predictedAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
