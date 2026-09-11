package com.example.u6_progetto_finale.entities;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
public class Document {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", nullable = false)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	/** Nome del file su disco (generato, non quello scelto dall'utente). */
	@Column(name = "storage_key", nullable = false, length = 255)
	private String storageKey;

	@Column(name = "original_name", nullable = false, length = 255)
	private String originalName;

	/** Tipo MIME reale, rilevato dai byte del file, non quello dichiarato dal client. */
	@Column(name = "content_type", nullable = false, length = 100)
	private String contentType;

	@Column(name = "size_bytes", nullable = false)
	private long sizeBytes;

	/** Testo estratto dall'OCR. Null finche' l'estrazione non e' stata eseguita o non e' riuscita. */
	@Column(name = "extracted_text", columnDefinition = "TEXT")
	private String extractedText;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public Document(User user, String storageKey, String originalName, String contentType, long sizeBytes) {
		this.user = user;
		this.storageKey = storageKey;
		this.originalName = originalName;
		this.contentType = contentType;
		this.sizeBytes = sizeBytes;
	}

}
