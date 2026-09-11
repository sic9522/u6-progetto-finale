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
@Table(name = "photos")
@Getter
@Setter
@NoArgsConstructor
public class Photo {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", nullable = false)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "post_id", nullable = false)
	private Post post;

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

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public Photo(Post post, String storageKey, String originalName, String contentType, long sizeBytes) {
		this.post = post;
		this.storageKey = storageKey;
		this.originalName = originalName;
		this.contentType = contentType;
		this.sizeBytes = sizeBytes;
	}

}
