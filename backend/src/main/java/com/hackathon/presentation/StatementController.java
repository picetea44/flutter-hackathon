package com.hackathon.presentation;

import com.hackathon.domain.statement.Statement;
import com.hackathon.infrastructure.persistence.StatementRepository;
import com.hackathon.presentation.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/statements")
@Tag(name = "Statements", description = "수집된 발언 조회 API")
public class StatementController {
	private final StatementRepository statementRepository;

	public StatementController(StatementRepository statementRepository) {
		this.statementRepository = statementRepository;
	}

	@GetMapping
	@Operation(summary = "모든 발언 조회", description = "수집된 모든 발언을 조회합니다")
	public ResponseEntity<ApiResponse<List<Statement>>> getAllStatements() {
		List<Statement> statements = statementRepository.findAll();
		return ResponseEntity.ok(ApiResponse.success(statements));
	}

	@GetMapping("/{statementId}")
	@Operation(summary = "발언 상세 조회", description = "특정 발언의 상세 정보를 조회합니다")
	public ResponseEntity<ApiResponse<Statement>> getStatementById(@PathVariable Long statementId) {
		Statement statement = statementRepository.findById(statementId).orElseThrow();
		return ResponseEntity.ok(ApiResponse.success(statement));
	}
}
