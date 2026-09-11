package com.example.u6_progetto_finale.payloads.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
		@NotBlank(message = "il nome e' obbligatorio") String firstName,
		@NotBlank(message = "il cognome e' obbligatorio") String lastName,
		@NotBlank(message = "l'email e' obbligatoria") @Email(message = "email non valida") String email,
		@NotBlank(message = "l'username e' obbligatorio") String username,
		@NotBlank(message = "la password e' obbligatoria") @Size(min = 6, message = "la password deve avere almeno 6 caratteri") String password,
		Integer age,
		String gender) {
}
