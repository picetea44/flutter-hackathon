package com.hackathon.infrastructure.crawler;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Component
public class NewsCrawler {
	private static final Logger logger = Logger.getLogger(NewsCrawler.class.getName());
	private static final int TIMEOUT = 10000;
	private static final String USER_AGENT = "Mozilla/5.0 (compatible; TrumpTalkBot/1.0)";

	public List<CrawledArticle> fetchArticlesFromAlJazeera(int limit) {
		return parseRss("https://www.aljazeera.com/xml/feeds/rss.xml", limit);
	}

	public List<CrawledArticle> fetchArticlesFromSpiegel(int limit) {
		return parseRss("https://www.spiegel.de/international/index.rss", limit);
	}

	private List<CrawledArticle> parseRss(String feedUrl, int limit) {
		List<CrawledArticle> articles = new ArrayList<>();
		try {
			Document doc = connectAndFetchXml(feedUrl);
			Elements items = doc.select("item");
			for (Element item : items) {
				if (articles.size() >= limit) break;
				CrawledArticle article = toArticle(item);
				if (article != null) articles.add(article);
			}
			logger.info("RSS 수집: " + feedUrl + " → " + articles.size() + "건");
		} catch (IOException exception) {
			logError(feedUrl, exception);
		}
		return articles;
	}

	private CrawledArticle toArticle(Element item) {
		String title = textOf(item, "title");
		String link = textOf(item, "link");
		String descriptionHtml = textOf(item, "description");
		String description = descriptionHtml.isEmpty() ? "" : Jsoup.parse(descriptionHtml).text();
		String content = description.isEmpty() ? title : description;
		if (link.isBlank() || content.isBlank()) return null;
		LocalDateTime publishedAt = parsePubDate(textOf(item, "pubDate"));
		return new CrawledArticle(title, content, link, publishedAt);
	}

	private String textOf(Element item, String tag) {
		Element child = item.selectFirst(tag);
		return child == null ? "" : child.text().trim();
	}

	private LocalDateTime parsePubDate(String pubDate) {
		if (pubDate == null || pubDate.isBlank()) return LocalDateTime.now();
		try {
			return ZonedDateTime.parse(pubDate, DateTimeFormatter.RFC_1123_DATE_TIME)
				.withZoneSameInstant(ZoneId.systemDefault())
				.toLocalDateTime();
		} catch (Exception exception) {
			return LocalDateTime.now();
		}
	}

	private Document connectAndFetchXml(String url) throws IOException {
		Connection connection = Jsoup.connect(url)
			.timeout(TIMEOUT)
			.userAgent(USER_AGENT)
			.parser(Parser.xmlParser());
		return connection.get();
	}

	private void logError(String source, Exception exception) {
		logger.warning("크롤링 오류 from " + source + ": " + exception.getMessage());
	}
}
