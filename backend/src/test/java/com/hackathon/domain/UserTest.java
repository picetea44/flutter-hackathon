package com.hackathon.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {
	@Test
	void createUserWithEmailAndName() {
		User user = new User("test@example.com", "John Doe");
		assertEquals("test@example.com", user.getEmailAddress());
		assertEquals("John Doe", user.getFullName());
	}

	@Test
	void updateUserFullName() {
		User user = new User("test@example.com", "John Doe");
		user.updateFullName("Jane Doe");
		assertEquals("Jane Doe", user.getFullName());
	}
}
