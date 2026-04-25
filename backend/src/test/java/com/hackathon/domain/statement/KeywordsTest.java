package com.hackathon.domain.statement;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Keywords 일급 컬렉션 테스트")
class KeywordsTest {
	@Test
	@DisplayName("유효한 키워드 목록으로 생성할 수 있다")
	void createKeywords_success() {
		Keywords keywords = new Keywords(List.of("트럼프", "경제"));
		assertEquals(2, keywords.getSize());
		assertTrue(keywords.contains("트럼프"));
	}

	@Test
	@DisplayName("빈 목록으로 생성 시 예외가 발생한다")
	void createKeywords_fail_causeOfEmptyList() {
		assertThrows(IllegalArgumentException.class, () -> new Keywords(List.of()));
	}

	@Test
	@DisplayName("null로 생성 시 예외가 발생한다")
	void createKeywords_fail_causeOfNullList() {
		assertThrows(IllegalArgumentException.class, () -> new Keywords(null));
	}

	@Test
	@DisplayName("getValues()는 불변 리스트를 반환한다")
	void getValues_returnsImmutableList() {
		Keywords keywords = new Keywords(List.of("키워드"));
		List<String> values = keywords.getValues();
		assertThrows(UnsupportedOperationException.class, () -> values.add("추가"));
	}
}
