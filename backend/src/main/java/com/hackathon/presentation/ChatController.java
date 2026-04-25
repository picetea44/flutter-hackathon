package com.hackathon.presentation;

import com.hackathon.application.KingsTalkService;
import com.hackathon.presentation.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
@Tag(name = "Chat", description = "King's Talk 챗봇 API")
public class ChatController {
	private final KingsTalkService kingsTalkService;

	public ChatController(KingsTalkService kingsTalkService) {
		this.kingsTalkService = kingsTalkService;
	}

	@PostMapping
	@Operation(summary = "트럼프 페르소나 응답", description = "사용자 메시지에 트럼프 스타일로 응답합니다")
	public ResponseEntity<ApiResponse<ChatResponse>> chat(@RequestBody ChatRequest request) {
		String response = kingsTalkService.respondWithTrumpPersona(request.getMessage());
		ChatResponse chatResponse = new ChatResponse(response);
		return ResponseEntity.ok(ApiResponse.success(chatResponse));
	}

	public static class ChatRequest {
		private String message;

		public ChatRequest() {
		}

		public ChatRequest(String message) {
			this.message = message;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}
	}

	public static class ChatResponse {
		private final String response;

		public ChatResponse(String response) {
			this.response = response;
		}

		public String getResponse() {
			return response;
		}
	}
}
