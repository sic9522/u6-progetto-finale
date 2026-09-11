package com.example.u6_progetto_finale.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.u6_progetto_finale.entities.User;
import com.example.u6_progetto_finale.repository.UserRepository;

/**
 * Crea l'utente di default se non esiste ancora. Senza login, post e documenti
 * vengono agganciati a questo utente e mostrati come pubblicati in anonimo.
 */
@Component
public class DataSeeder implements CommandLineRunner {

	public static final String DEFAULT_USERNAME = "anonimo";

	private final UserRepository userRepository;

	public DataSeeder(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public void run(String... args) {
		userRepository.findByUsername(DEFAULT_USERNAME)
			.orElseGet(() -> userRepository.save(new User(DEFAULT_USERNAME)));
	}

}
