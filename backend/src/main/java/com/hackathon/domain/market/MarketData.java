package com.hackathon.domain.market;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import com.hackathon.domain.prediction.MarketIndex;

@Entity
@Table(name = "market_data")
public class MarketData {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long identifier;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MarketIndex marketIndex;

	@Column(nullable = false)
	private Double indexValue;

	@Column(nullable = false)
	private Double changeRatePercent;

	@Column(nullable = false, updatable = false)
	private LocalDateTime recordedAt;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	protected MarketData() {
	}

	public MarketData(MarketIndex marketIndex, Double indexValue, Double changeRatePercent, LocalDateTime recordedAt) {
		this.marketIndex = marketIndex;
		this.indexValue = indexValue;
		this.changeRatePercent = changeRatePercent;
		this.recordedAt = recordedAt;
		this.createdAt = LocalDateTime.now();
	}

	public Long getIdentifier() {
		return identifier;
	}

	public MarketIndex getMarketIndex() {
		return marketIndex;
	}

	public Double getIndexValue() {
		return indexValue;
	}

	public Double getChangeRatePercent() {
		return changeRatePercent;
	}

	public LocalDateTime getRecordedAt() {
		return recordedAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
