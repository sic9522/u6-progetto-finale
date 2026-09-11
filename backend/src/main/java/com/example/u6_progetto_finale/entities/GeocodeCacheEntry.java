package com.example.u6_progetto_finale.entities;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Una geocodifica gia' ottenuta da Google, tenuta a database invece che in
 * memoria: sopravvive al riavvio del backend, quindi dopo un redeploy non si
 * ricomincia a pagare le chiamate gia' fatte in passato.
 *
 * La riga scaduta (oltre app.google.geocoding.cache-ttl) non viene cancellata:
 * refresh() la riscrive in place alla richiesta successiva sulla stessa chiave.
 */
@Entity
@Table(name = "geocode_cache", uniqueConstraints = @UniqueConstraint(columnNames = { "kind", "cache_key" }))
@Getter
@NoArgsConstructor
public class GeocodeCacheEntry {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", nullable = false)
	private UUID id;

	@Enumerated(EnumType.STRING)
	@Column(name = "kind", nullable = false, length = 16)
	private GeocodeKind kind;

	/** Indirizzo normalizzato per FORWARD, "lat,lng" a scala 6 per REVERSE. */
	@Column(name = "cache_key", nullable = false, length = 500)
	private String cacheKey;

	@Column(name = "latitude", nullable = false, precision = 8, scale = 6)
	private BigDecimal latitude;

	@Column(name = "longitude", nullable = false, precision = 9, scale = 6)
	private BigDecimal longitude;

	@Column(name = "formatted_address", length = 500)
	private String formattedAddress;

	@Column(name = "fetched_at", nullable = false)
	private Instant fetchedAt;

	public GeocodeCacheEntry(GeocodeKind kind, String cacheKey, BigDecimal latitude, BigDecimal longitude,
			String formattedAddress) {
		this.kind = kind;
		this.cacheKey = cacheKey;
		this.latitude = latitude;
		this.longitude = longitude;
		this.formattedAddress = formattedAddress;
		this.fetchedAt = Instant.now();
	}

	public boolean isFresh(Duration ttl) {
		return fetchedAt.isAfter(Instant.now().minus(ttl));
	}

	public void refresh(BigDecimal latitude, BigDecimal longitude, String formattedAddress) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.formattedAddress = formattedAddress;
		this.fetchedAt = Instant.now();
	}

}
