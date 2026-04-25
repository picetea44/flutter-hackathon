package com.hackathon.application;

import com.hackathon.infrastructure.persistence.PredictionHistoryRepository;
import com.hackathon.domain.prediction.MarketIndex;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class KingsTalkService {
	private static final Logger logger = Logger.getLogger(KingsTalkService.class.getName());
	private static final String SYSTEM_PROMPT_TEMPLATE = """
		당신은 미국 대통령 도널드 트럼프입니다.
		항상 다음 규칙을 지켜 한국어로 답하세요.
		- 자신감 넘치고 과장된 어조를 사용한다.
		- 짧고 단정적인 문장을 사용한다.
		- "Believe me", "Tremendous", "The best", "Nobody knows better than me" 같은 표현을 자연스럽게 섞는다.
		- 시장과 경제, 거래, 미국 우선주의(America First) 관점을 자주 끌어온다.
		- 답변은 3~5문장 이내로 짧게 마친다.

		최근 S&P 500 예측 컨텍스트:
		%s
		""";
	private static final String FALLBACK_RESPONSE =
		"Look, the answer is tremendous, believe me. We're winning like nobody's ever seen, OK? Stay tuned.";

	private final PredictionHistoryRepository predictionRepository;
	private final ChatClient chatClient;

	public KingsTalkService(PredictionHistoryRepository predictionRepository, ChatModel chatModel) {
		this.predictionRepository = predictionRepository;
		this.chatClient = ChatClient.builder(chatModel).build();
	}

	public String respondWithTrumpPersona(String userMessage) {
		String systemPrompt = SYSTEM_PROMPT_TEMPLATE.formatted(buildContext());
		try {
			String reply = chatClient.prompt()
				.system(systemPrompt)
				.user(userMessage)
				.call()
				.content();
			logger.info("트럼프 페르소나 응답 생성 완료 (길이=" + (reply == null ? 0 : reply.length()) + ")");
			return reply == null || reply.isBlank() ? FALLBACK_RESPONSE : reply;
		} catch (RuntimeException exception) {
			logger.warning("Gemini 호출 실패, fallback 사용: " + exception.getMessage());
			return FALLBACK_RESPONSE;
		}
	}

	private String buildContext() {
		String latestPrediction = fetchLatestPrediction();
		return "최근 예측: " + latestPrediction;
	}

	private String fetchLatestPrediction() {
		return predictionRepository.findByTargetMarketIndexOrderByPredictedAtDesc(
				MarketIndex.STANDARD_AND_POORS_500
			).stream()
			.findFirst()
			.map(prediction -> prediction.getGrowthRate().getPercentageValue().toString() + "%")
			.orElse("데이터 없음");
	}
}
