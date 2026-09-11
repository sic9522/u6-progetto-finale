package com.example.u6_progetto_finale.payloads.response;

import java.time.Instant;
import java.util.UUID;

import com.example.u6_progetto_finale.entities.Photo;

public record PhotoResponse(
		UUID id,
		String storageKey,
		String originalName,
		String contentType,
		long sizeBytes,
		Instant createdAt) {

	public static PhotoResponse from(Photo photo) {
		return new PhotoResponse(
			photo.getId(),
			photo.getStorageKey(),
			photo.getOriginalName(),
			photo.getContentType(),
			photo.getSizeBytes(),
			photo.getCreatedAt());
	}

}
