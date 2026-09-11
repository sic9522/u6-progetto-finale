package com.example.u6_progetto_finale.payloads.response;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ErrorResponse {

	private final String message;
	private final LocalDateTime timestamp;

	public ErrorResponse(String message) {
		this.message = message;
		this.timestamp = LocalDateTime.now();
	}

}
