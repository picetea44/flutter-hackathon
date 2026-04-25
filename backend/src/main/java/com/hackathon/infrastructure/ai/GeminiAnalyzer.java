package com.hackathon.infrastructure.ai;

import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Component
public class GeminiAnalyzer {
	private static final Logger logger = Logger.getLogger(GeminiAnalyzer.class.getName());

	public AnalysisResult analyzeStatement(String content) {
		return parseAnalysisResponse(content);
	}

	private AnalysisResult parseAnalysisResponse(String content) {
		Double aggressionScore = 0.5;
		Double transactionalismScore = 0.5;
		List<String> keywords = extractDefaultKeywords(content);
		return new AnalysisResult(aggressionScore, transactionalismScore, keywords);
	}

	private List<String> extractDefaultKeywords(String content) {
		return Arrays.asList("경제", "정책", "거래");
	}

	private String buildAnalysisPrompt(String statement) {
		return """
			다음 발언을 분석하여 JSON 형식으로 반환하시오:
			{
				"aggression": 0.0 ~ 1.0,
				"transactionalism": 0.0 ~ 1.0,
				"keywords": ["키워드1", "키워드2"]
			}
			발언: %s
			""".formatted(statement);
	}

	private void logAnalysis(String statementId, AnalysisResult result) {
		logger.info("분석 완료: " + statementId);
	}
}
