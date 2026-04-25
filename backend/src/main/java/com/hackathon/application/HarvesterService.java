package com.hackathon.application;

import com.hackathon.domain.statement.AggressionIndex;
import com.hackathon.domain.statement.Statement;
import com.hackathon.domain.statement.TransactionalismIndex;
import com.hackathon.infrastructure.ai.AnalysisResult;
import com.hackathon.infrastructure.ai.GeminiAnalyzer;
import com.hackathon.infrastructure.crawler.NewsCrawler;
import com.hackathon.infrastructure.crawler.CrawledArticle;
import com.hackathon.infrastructure.persistence.StatementRepository;
import com.hackathon.domain.statement.SourceUrl;
import com.hackathon.domain.statement.Keywords;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class HarvesterService {
	private static final Logger logger = Logger.getLogger(HarvesterService.class.getName());
	private static final int BOOT_CRAWL_TARGET = 50;
	private static final int PER_SOURCE_LIMIT = 30;

	private final NewsCrawler crawler;
	private final StatementRepository statementRepository;
	private final GeminiAnalyzer analyzer;

	public HarvesterService(
		NewsCrawler crawler,
		StatementRepository statementRepository,
		GeminiAnalyzer analyzer
	) {
		this.crawler = crawler;
		this.statementRepository = statementRepository;
		this.analyzer = analyzer;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void harvestOnStartup() {
		long existing = statementRepository.count();
		statementRepository.deleteAllInBatch();
		logger.info("부팅 시 statements 초기화: " + existing + "건 삭제");
		logger.info("부팅 크롤링 시작 (목표 " + BOOT_CRAWL_TARGET + "건)");
		harvestNews();
	}

	@Scheduled(cron = "0 0 * * * *")
	public void harvestNews() {
		List<CrawledArticle> articles = fetchAllNews();
		int saved = 0;
		for (CrawledArticle article : articles) {
			if (saved >= BOOT_CRAWL_TARGET) break;
			saveArticleAsStatement(article);
			saved++;
		}
		logger.info("수집 완료: " + saved + "개 기사 저장");
	}

	private List<CrawledArticle> fetchAllNews() {
		List<CrawledArticle> all = new ArrayList<>();
		all.addAll(crawler.fetchArticlesFromAlJazeera(PER_SOURCE_LIMIT));
		all.addAll(crawler.fetchArticlesFromSpiegel(PER_SOURCE_LIMIT));
		return all;
	}

	private void saveArticleAsStatement(CrawledArticle article) {
		try {
			SourceUrl sourceUrl = new SourceUrl(article.getSourceUrl());
			String keyword = article.getTitle() == null || article.getTitle().isBlank()
				? "news"
				: article.getTitle();
			Keywords keywords = new Keywords(List.of(keyword));
			Statement statement = new Statement(
				article.getContent(),
				sourceUrl,
				keywords,
				article.getPublishedAt()
			);
			analyzeStatement(statement, article.getContent());
			statementRepository.save(statement);
		} catch (RuntimeException exception) {
			logger.warning("기사 저장 실패: " + article.getSourceUrl() + " — " + exception.getMessage());
		}
	}

	private void analyzeStatement(Statement statement, String content) {
		AnalysisResult result = analyzer.analyzeStatement(content);
		statement.analyzeWith(
			new AggressionIndex(result.getAggressionScore()),
			new TransactionalismIndex(result.getTransactionalismScore())
		);
	}
}
