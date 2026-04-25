package com.hackathon.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long identifier;
	private String emailAddress;
	private String fullName;

	protected User() {
	}

	public User(String emailAddress, String fullName) {
		this.emailAddress = emailAddress;
		this.fullName = fullName;
	}

	public Long getIdentifier() {
		return identifier;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public String getFullName() {
		return fullName;
	}

	public void updateFullName(String newFullName) {
		this.fullName = newFullName;
	}
}
