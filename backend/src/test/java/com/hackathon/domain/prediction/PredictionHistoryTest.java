package com.hackathon.domain.prediction;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PredictionHistory 엔티티 테스트")
class PredictionHistoryTest {
	@Test
	@DisplayName("유효한 성장률과 지수로 예측 기록을 생성할 수 있다")
	void createPredictionHistory_success() {
		GrowthRate growthRate = new GrowthRate(5.2);
		PredictionHistory history = new PredictionHistory(growthRate, MarketIndex.STANDARD_AND_POORS_500);

		assertEquals(5.2, history.getGrowthRate().getPercentageValue());
		assertEquals(MarketIndex.STANDARD_AND_POORS_500, history.getTargetMarketIndex());
		assertNotNull(history.getPredictedAt());
	}

	@Test
	@DisplayName("생성 시간과 예측 시간이 기록된다")
	void predictedAt_recordsTimestamp() {
		GrowthRate growthRate = new GrowthRate(3.0);
		PredictionHistory history = new PredictionHistory(growthRate, MarketIndex.NASDAQ_100);

		assertNotNull(history.getPredictedAt());
		assertNotNull(history.getCreatedAt());
	}
}
