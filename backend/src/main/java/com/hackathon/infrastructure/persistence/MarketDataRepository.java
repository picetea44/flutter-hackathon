package com.hackathon.infrastructure.persistence;

import com.hackathon.domain.market.MarketData;
import com.hackathon.domain.prediction.MarketIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
	List<MarketData> findByMarketIndex(MarketIndex marketIndex);

	List<MarketData> findByMarketIndexOrderByRecordedAtDesc(MarketIndex marketIndex);

	List<MarketData> findByRecordedAtAfter(LocalDateTime recordedAfter);
}
