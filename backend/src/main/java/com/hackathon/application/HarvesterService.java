package com.hackathon.application;

import com.hackathon.domain.statement.Statement;
import com.hackathon.infrastructure.crawler.NewsCrawler;
import com.hackathon.infrastructure.crawler.CrawledArticle;
import com.hackathon.infrastructure.persistence.StatementRepository;
import com.hackathon.domain.statement.SourceUrl;
import com.hackathon.domain.statement.Keywords;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class HarvesterService {
	private static final Logger logger = Logger.getLogger(HarvesterService.class.getName());
	private final NewsCrawler crawler;
	private final StatementRepository statementRepository;

	public HarvesterService(NewsCrawler crawler, StatementRepository statementRepository) {
		this.crawler = crawler;
		this.statementRepository = statementRepository;
	}

	@Scheduled(cron = "0 0 * * * *")
	public void harvestNews() {
		List<CrawledArticle> articles = fetchAllNews();
		articles.forEach(this::saveArticleAsStatement);
		logger.info("수집 완료: " + articles.size() + "개 기사");
	}

	private List<CrawledArticle> fetchAllNews() {
		List<CrawledArticle> allArticles = crawler.fetchArticlesFromAlJazeera();
		allArticles.addAll(crawler.fetchArticlesFromSpiegel());
		return allArticles;
	}

	private void saveArticleAsStatement(CrawledArticle article) {
		SourceUrl sourceUrl = new SourceUrl(article.getSourceUrl());
		Keywords keywords = new Keywords(List.of(article.getTitle()));
		Statement statement = new Statement(
			article.getContent(),
			sourceUrl,
			keywords,
			article.getPublishedAt()
		);
		statementRepository.save(statement);
	}
}
