package com.hackathon.domain.statement;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AggressionIndex 값 객체 테스트")
class AggressionIndexTest {
	@Test
	@DisplayName("0.0 ~ 1.0 범위의 값으로 생성할 수 있다")
	void createIndex_success() {
		AggressionIndex index = new AggressionIndex(0.5);
		assertEquals(0.5, index.getValue());
	}

	@Test
	@DisplayName("범위를 초과하는 값으로 생성 시 예외가 발생한다")
	void createIndex_fail_causeOfValueOutOfRange() {
		assertThrows(IllegalArgumentException.class, () -> new AggressionIndex(1.5));
	}

	@Test
	@DisplayName("음수 값으로 생성 시 예외가 발생한다")
	void createIndex_fail_causeOfNegativeValue() {
		assertThrows(IllegalArgumentException.class, () -> new AggressionIndex(-0.5));
	}

	@Test
	@DisplayName("null 값으로 생성 시 예외가 발생한다")
	void createIndex_fail_causeOfNullValue() {
		assertThrows(IllegalArgumentException.class, () -> new AggressionIndex(null));
	}
}
