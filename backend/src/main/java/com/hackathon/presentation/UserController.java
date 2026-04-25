package com.hackathon.presentation;

import com.hackathon.application.UserService;
import com.hackathon.domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
		User createdUser = userService.createUser(request.emailAddress(), request.fullName());
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}

	@GetMapping("/{userId}")
	public ResponseEntity<User> getUser(@PathVariable Long userId) {
		Optional<User> user = userService.getUserByEmail(userId.toString());
		return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}

	@PutMapping("/{userId}")
	public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
		User updatedUser = userService.updateUser(userId, request.fullName());
		return ResponseEntity.ok(updatedUser);
	}

	public record CreateUserRequest(String emailAddress, String fullName) {}
	public record UpdateUserRequest(String fullName) {}
}
