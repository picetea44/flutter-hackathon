package com.hackathon.presentation;

import com.hackathon.application.OracleService;
import com.hackathon.domain.prediction.PredictionHistory;
import com.hackathon.domain.prediction.MarketIndex;
import com.hackathon.infrastructure.persistence.PredictionHistoryRepository;
import com.hackathon.presentation.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/predictions")
@Tag(name = "Predictions", description = "주가 예측 API")
public class PredictionController {
	private final OracleService oracleService;
	private final PredictionHistoryRepository predictionRepository;

	public PredictionController(OracleService oracleService, PredictionHistoryRepository predictionRepository) {
		this.oracleService = oracleService;
		this.predictionRepository = predictionRepository;
	}

	@PostMapping("/latest")
	@Operation(summary = "최신 예측 생성", description = "S&P 500 최신 예측을 생성합니다")
	public ResponseEntity<ApiResponse<PredictionHistory>> createLatestPrediction() {
		PredictionHistory prediction = oracleService.predictMarketMovement(MarketIndex.STANDARD_AND_POORS_500);
		ApiResponse<PredictionHistory> response = ApiResponse.success("예측 완료", prediction);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/latest")
	@Operation(summary = "최신 예측 조회", description = "S&P 500의 가장 최근 예측을 조회합니다. 없으면 새로 생성합니다.")
	public ResponseEntity<ApiResponse<PredictionHistory>> getLatestPrediction() {
		List<PredictionHistory> predictions = predictionRepository.findByTargetMarketIndexOrderByPredictedAtDesc(
			MarketIndex.STANDARD_AND_POORS_500
		);
		PredictionHistory latest = predictions.stream()
			.findFirst()
			.orElseGet(() -> oracleService.predictMarketMovement(MarketIndex.STANDARD_AND_POORS_500));
		return ResponseEntity.ok(ApiResponse.success(latest));
	}

	@GetMapping("/history")
	@Operation(summary = "예측 이력 조회", description = "S&P 500의 모든 예측 기록을 조회합니다")
	public ResponseEntity<ApiResponse<List<PredictionHistory>>> getPredictionHistory() {
		List<PredictionHistory> history = predictionRepository.findByTargetMarketIndexOrderByPredictedAtDesc(
			MarketIndex.STANDARD_AND_POORS_500
		);
		return ResponseEntity.ok(ApiResponse.success(history));
	}
}
