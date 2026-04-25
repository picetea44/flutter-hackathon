package com.hackathon.domain.market;

import com.hackathon.domain.prediction.MarketIndex;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("MarketData 엔티티 테스트")
class MarketDataTest {
	@Test
	@DisplayName("시장 지수 데이터를 생성할 수 있다")
	void createMarketData_success() {
		LocalDateTime recordedAt = LocalDateTime.now();
		MarketData marketData = new MarketData(
			MarketIndex.STANDARD_AND_POORS_500,
			4500.5,
			2.3,
			recordedAt
		);

		assertEquals(MarketIndex.STANDARD_AND_POORS_500, marketData.getMarketIndex());
		assertEquals(4500.5, marketData.getIndexValue());
		assertEquals(2.3, marketData.getChangeRatePercent());
	}

	@Test
	@DisplayName("생성 시간이 자동으로 기록된다")
	void createdAt_isSetAutomatically() {
		LocalDateTime recordedAt = LocalDateTime.now();
		MarketData marketData = new MarketData(
			MarketIndex.NASDAQ_100,
			15000.0,
			1.5,
			recordedAt
		);

		assertNotNull(marketData.getCreatedAt());
	}
}
