package com.example.u6_progetto_finale.entities;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", nullable = false)
	private UUID id;

	@Column(name = "username", nullable = false, unique = true, length = 50)
	private String username;

	@Column(name = "first_name", length = 100)
	private String firstName;

	@Column(name = "last_name", length = 100)
	private String lastName;

	@Column(name = "email", unique = true, length = 255)
	private String email;

	@Column(name = "password_hash")
	private String passwordHash;

	@Column(name = "age")
	private Integer age;

	@Column(name = "gender", length = 20)
	private String gender;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public User(String username) {
		this.username = username;
	}

	public User(String firstName, String lastName, String email, String username, String passwordHash, Integer age,
			String gender) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.username = username;
		this.passwordHash = passwordHash;
		this.age = age;
		this.gender = gender;
	}

}
