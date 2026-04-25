package com.hackathon.domain.prediction;

public enum MarketIndex {
	STANDARD_AND_POORS_500("S&P 500"),
	NASDAQ_100("NASDAQ-100"),
	DOW_JONES("DOW JONES");

	private final String displayName;

	MarketIndex(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}
}
