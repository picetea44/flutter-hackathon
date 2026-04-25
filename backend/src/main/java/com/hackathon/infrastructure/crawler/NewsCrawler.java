package com.hackathon.infrastructure.crawler;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Component
public class NewsCrawler {
	private static final Logger logger = Logger.getLogger(NewsCrawler.class.getName());
	private static final int TIMEOUT = 10000;

	public List<CrawledArticle> fetchArticlesFromAlJazeera() {
		List<CrawledArticle> articles = new ArrayList<>();
		String feedUrl = "https://www.aljazeera.com/xml/feeds/rss.xml";
		return parseRss(feedUrl, articles);
	}

	public List<CrawledArticle> fetchArticlesFromSpiegel() {
		List<CrawledArticle> articles = new ArrayList<>();
		String feedUrl = "https://www.spiegel.de/international/index.rss";
		return parseRss(feedUrl, articles);
	}

	private List<CrawledArticle> parseRss(String feedUrl, List<CrawledArticle> articles) {
		return articles;
	}

	private Document connectAndFetch(String url) throws IOException {
		return Jsoup.connect(url).timeout(TIMEOUT).get();
	}

	private void logError(String source, Exception exception) {
		logger.warning("크롤링 오류 from " + source + ": " + exception.getMessage());
	}
}
