package com.example.u6_progetto_finale.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.u6_progetto_finale.entities.User;
import com.example.u6_progetto_finale.exceptions.BadRequestException;
import com.example.u6_progetto_finale.exceptions.UnauthorizedException;
import com.example.u6_progetto_finale.payloads.request.LoginRequest;
import com.example.u6_progetto_finale.payloads.request.RegisterRequest;
import com.example.u6_progetto_finale.payloads.response.AuthResponse;
import com.example.u6_progetto_finale.repository.UserRepository;
import com.example.u6_progetto_finale.security.JwtService;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public AuthResponse register(RegisterRequest request) {
		String username = request.username().strip();
		String email = request.email().strip();

		if (userRepository.findByUsername(username).isPresent()) {
			throw new BadRequestException("username gia' in uso");
		}
		if (userRepository.findByEmail(email).isPresent()) {
			throw new BadRequestException("email gia' in uso");
		}

		User user = new User(request.firstName().strip(), request.lastName().strip(), email, username,
				passwordEncoder.encode(request.password()), request.age(), request.gender());
		userRepository.save(user);

		return new AuthResponse(jwtService.generateToken(user.getUsername()), user.getUsername());
	}

	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.username().strip())
			.orElseThrow(() -> new UnauthorizedException("credenziali non valide"));

		if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new UnauthorizedException("credenziali non valide");
		}

		return new AuthResponse(jwtService.generateToken(user.getUsername()), user.getUsername());
	}

}
