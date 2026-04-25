package com.hackathon.application;

import com.hackathon.domain.statement.Statement;
import com.hackathon.domain.statement.AggressionIndex;
import com.hackathon.domain.statement.TransactionalismIndex;
import com.hackathon.infrastructure.ai.GeminiAnalyzer;
import com.hackathon.infrastructure.ai.AnalysisResult;
import com.hackathon.infrastructure.persistence.StatementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class FrozenEngineService {
	private static final Logger logger = Logger.getLogger(FrozenEngineService.class.getName());
	private final GeminiAnalyzer analyzer;
	private final StatementRepository statementRepository;

	public FrozenEngineService(GeminiAnalyzer analyzer, StatementRepository statementRepository) {
		this.analyzer = analyzer;
		this.statementRepository = statementRepository;
	}

	public void analyzeAllPendingStatements() {
		List<Statement> pendingStatements = findPendingStatements();
		pendingStatements.forEach(this::analyzeStatement);
	}

	private List<Statement> findPendingStatements() {
		return statementRepository.findAll()
			.stream()
			.filter(statement -> statement.getAggressionIndex() == null)
			.toList();
	}

	private void analyzeStatement(Statement statement) {
		AnalysisResult result = analyzer.analyzeStatement(statement.getContent());
		applyAnalysisResult(statement, result);
		statementRepository.save(statement);
	}

	private void applyAnalysisResult(Statement statement, AnalysisResult result) {
		AggressionIndex aggression = new AggressionIndex(result.getAggressionScore());
		TransactionalismIndex transactionalism = new TransactionalismIndex(result.getTransactionalismScore());
		statement.analyzeWith(aggression, transactionalism);
	}
}
