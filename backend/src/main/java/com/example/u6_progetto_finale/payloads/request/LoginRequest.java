package com.example.u6_progetto_finale.payloads.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
		@NotBlank(message = "l'username e' obbligatorio") String username,
		@NotBlank(message = "la password e' obbligatoria") String password) {
}
