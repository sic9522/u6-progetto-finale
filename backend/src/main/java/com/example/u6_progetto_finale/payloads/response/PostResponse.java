package com.example.u6_progetto_finale.payloads.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.example.u6_progetto_finale.entities.Post;

public record PostResponse(
		UUID id,
		UUID userId,
		String username,
		BigDecimal latitude,
		BigDecimal longitude,
		String address,
		String description,
		Instant createdAt,
		List<PhotoResponse> photos) {

	public static PostResponse from(Post post) {
		return new PostResponse(
			post.getId(),
			post.getUser().getId(),
			post.getUser().getUsername(),
			post.getLatitude(),
			post.getLongitude(),
			post.getAddress(),
			post.getDescription(),
			post.getCreatedAt(),
			post.getPhotos().stream().map(PhotoResponse::from).toList());
	}

}
