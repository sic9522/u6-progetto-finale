package com.example.u6_progetto_finale.payloads.response;

import java.time.Instant;
import java.util.UUID;

import com.example.u6_progetto_finale.entities.Document;

public record DocumentResponse(
		UUID id,
		String originalName,
		String contentType,
		long sizeBytes,
		String extractedText,
		Instant createdAt) {

	public static DocumentResponse from(Document document) {
		return new DocumentResponse(
			document.getId(),
			document.getOriginalName(),
			document.getContentType(),
			document.getSizeBytes(),
			document.getExtractedText(),
			document.getCreatedAt());
	}

}
