package com.example.u6_progetto_finale.payloads.response;

public record AuthResponse(
		String token,
		String username,
		String firstName,
		String lastName,
		String email,
		Integer age,
		String gender) {
}
