package com.hackathon.application;

import com.hackathon.infrastructure.persistence.PredictionHistoryRepository;
import com.hackathon.domain.prediction.MarketIndex;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class KingsTalkService {
	private static final Logger logger = Logger.getLogger(KingsTalkService.class.getName());
	private final PredictionHistoryRepository predictionRepository;

	public KingsTalkService(PredictionHistoryRepository predictionRepository) {
		this.predictionRepository = predictionRepository;
	}

	public String respondWithTrumpPersona(String userMessage) {
		String context = buildContext();
		return generateTrumpResponse(userMessage, context);
	}

	private String buildContext() {
		String latestPrediction = fetchLatestPrediction();
		return "최근 예측: " + latestPrediction;
	}

	private String fetchLatestPrediction() {
		var prediction = predictionRepository.findByTargetMarketIndexOrderByPredictedAtDesc(
			MarketIndex.STANDARD_AND_POORS_500
		).stream().findFirst();
		return prediction.map(p -> p.getGrowthRate().getPercentageValue().toString()).orElse("데이터 없음");
	}

	private String generateTrumpResponse(String userMessage, String context) {
		return buildTrumpStyleResponse(userMessage, context);
	}

	private String buildTrumpStyleResponse(String message, String context) {
		String baseResponse = "우리의 경제 정책은 가장 훌륭합니다. ";
		String contextualResponse = baseResponse + context;
		logger.info("트럼프 페르소나 응답 생성: " + message);
		return contextualResponse;
	}
}
