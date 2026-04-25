package com.hackathon.application;

import com.hackathon.domain.prediction.PredictionHistory;
import com.hackathon.domain.prediction.GrowthRate;
import com.hackathon.domain.prediction.MarketIndex;
import com.hackathon.domain.statement.Statement;
import com.hackathon.infrastructure.persistence.StatementRepository;
import com.hackathon.infrastructure.persistence.PredictionHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class OracleService {
	private static final Logger logger = Logger.getLogger(OracleService.class.getName());
	private final StatementRepository statementRepository;
	private final PredictionHistoryRepository predictionRepository;

	public OracleService(StatementRepository statementRepository, PredictionHistoryRepository predictionRepository) {
		this.statementRepository = statementRepository;
		this.predictionRepository = predictionRepository;
	}

	public PredictionHistory predictMarketMovement(MarketIndex marketIndex) {
		List<Statement> recentStatements = fetchRecentAnalyzedStatements();
		Double predictedGrowthRate = calculatePredictionFromStatements(recentStatements);
		GrowthRate growthRate = new GrowthRate(predictedGrowthRate);
		PredictionHistory prediction = new PredictionHistory(growthRate, marketIndex);
		return predictionRepository.save(prediction);
	}

	private List<Statement> fetchRecentAnalyzedStatements() {
		LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
		return statementRepository.findByPublishedAtAfter(sevenDaysAgo);
	}

	private Double calculatePredictionFromStatements(List<Statement> statements) {
		return statements.stream()
			.map(this::calculateStatementImpact)
			.mapToDouble(Double::doubleValue)
			.average()
			.orElse(0.0);
	}

	private Double calculateStatementImpact(Statement statement) {
		Double aggression = statement.getAggressionIndex().getValue();
		Double transactionalism = statement.getTransactionalismIndex().getValue();
		return (aggression * 0.4) + (transactionalism * 0.6);
	}
}
