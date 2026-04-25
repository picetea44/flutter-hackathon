package com.hackathon.domain.prediction;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GrowthRate 값 객체 테스트")
class GrowthRateTest {
	@Test
	@DisplayName("유효한 성장률 값으로 생성할 수 있다")
	void createGrowthRate_success() {
		GrowthRate rate = new GrowthRate(5.5);
		assertEquals(5.5, rate.getPercentageValue());
	}

	@Test
	@DisplayName("음수 성장률로 생성할 수 있다")
	void createGrowthRate_success_negativeValue() {
		GrowthRate rate = new GrowthRate(-2.3);
		assertEquals(-2.3, rate.getPercentageValue());
	}

	@Test
	@DisplayName("null 값으로 생성 시 예외가 발생한다")
	void createGrowthRate_fail_causeOfNullValue() {
		assertThrows(IllegalArgumentException.class, () -> new GrowthRate(null));
	}
}
