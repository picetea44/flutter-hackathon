package com.hackathon.application;

import com.hackathon.domain.User;
import com.hackathon.infrastructure.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public User createUser(String emailAddress, String fullName) {
		User newUser = new User(emailAddress, fullName);
		return userRepository.save(newUser);
	}

	public Optional<User> getUserByEmail(String emailAddress) {
		return userRepository.findByEmailAddress(emailAddress);
	}

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User updateUser(Long userId, String fullName) {
		User user = userRepository.findById(userId).orElseThrow();
		user.updateFullName(fullName);
		return user;
	}
}
