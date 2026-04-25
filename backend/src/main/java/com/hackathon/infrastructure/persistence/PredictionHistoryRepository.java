package com.hackathon.infrastructure.persistence;

import com.hackathon.domain.prediction.PredictionHistory;
import com.hackathon.domain.prediction.MarketIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PredictionHistoryRepository extends JpaRepository<PredictionHistory, Long> {
	List<PredictionHistory> findByTargetMarketIndex(MarketIndex marketIndex);

	List<PredictionHistory> findByPredictedAtAfter(LocalDateTime predictedAfter);

	List<PredictionHistory> findByTargetMarketIndexOrderByPredictedAtDesc(MarketIndex marketIndex);
}
