package com.example.u6_progetto_finale.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import com.example.u6_progetto_finale.config.GeocodingProperties;
import com.example.u6_progetto_finale.entities.GeocodeCacheEntry;
import com.example.u6_progetto_finale.entities.GeocodeKind;
import com.example.u6_progetto_finale.exceptions.BadRequestException;
import com.example.u6_progetto_finale.exceptions.NotFoundException;
import com.example.u6_progetto_finale.payloads.response.GeocodeResponse;
import com.example.u6_progetto_finale.repository.GeocodeCacheRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Geocoding lato server sulla Google Geocoding API v4 (geocode.googleapis.com):
 * la vecchia /maps/api/geocode/json risponde REQUEST_DENIED sui progetti dove
 * e' abilitata solo la v4. La chiave resta qui, non arriva mai al frontend.
 *
 * Prima di chiamare Google si guarda in geocode_cache: la stessa chiave viene
 * richiesta al massimo una volta ogni app.google.geocoding.cache-ttl (default
 * 30 giorni), poi si richiama l'API cosi' un indirizzo cambiato nel frattempo
 * non resta sbagliato per sempre. La cache si scrive solo su risposta valida:
 * un fallimento di Google non "avvelena" la chiave.
 */
@Service
@EnableConfigurationProperties(GeocodingProperties.class)
public class GeocodingService {

	private final GeocodeCacheRepository cache;
	private final GeocodingProperties properties;
	private final RestClient restClient;

	public GeocodingService(GeocodeCacheRepository cache, GeocodingProperties properties, RestClient.Builder builder) {
		this.cache = cache;
		this.properties = properties;
		this.restClient = builder.baseUrl("https://geocode.googleapis.com/v4/geocode").build();
	}

	public GeocodeResponse geocode(String address) {
		String query = address == null ? "" : address.strip();
		if (query.isEmpty()) {
			throw new BadRequestException("address e' obbligatorio");
		}

		String key = normalizeAddress(query);
		Optional<GeocodeCacheEntry> cached = findFresh(GeocodeKind.FORWARD, key);
		if (cached.isPresent()) {
			return toResponse(cached.get());
		}

		GoogleResponse response = call(() -> restClient.get()
			.uri(uriBuilder -> uriBuilder.path("/address/{address}")
				.queryParam("regionCode", properties.region())
				.queryParam("languageCode", properties.language())
				.build(query))
			.header("X-Goog-Api-Key", requireApiKey())
			.retrieve()
			.body(GoogleResponse.class), query);

		return store(GeocodeKind.FORWARD, key, response, query);
	}

	public GeocodeResponse reverseGeocode(BigDecimal latitude, BigDecimal longitude) {
		String latLng = normalizeCoordinates(latitude, longitude);
		Optional<GeocodeCacheEntry> cached = findFresh(GeocodeKind.REVERSE, latLng);
		if (cached.isPresent()) {
			return toResponse(cached.get());
		}

		GoogleResponse response = call(() -> restClient.get()
			.uri(uriBuilder -> uriBuilder.path("/location/{latLng}")
				.queryParam("languageCode", properties.language())
				.build(latLng))
			.header("X-Goog-Api-Key", requireApiKey())
			.retrieve()
			.body(GoogleResponse.class), latLng);

		return store(GeocodeKind.REVERSE, latLng, response, latLng);
	}

	private String requireApiKey() {
		if (properties.apiKey() == null || properties.apiKey().isBlank()) {
			throw new BadRequestException("geocoding non configurato: manca GOOGLE_GEOCODING_API_KEY");
		}
		return properties.apiKey();
	}

	private Optional<GeocodeCacheEntry> findFresh(GeocodeKind kind, String key) {
		return cache.findByKindAndCacheKey(kind, key).filter(entry -> entry.isFresh(properties.cacheTtl()));
	}

	private GeocodeResponse store(GeocodeKind kind, String key, GoogleResponse response, String query) {
		if (response == null || response.results() == null || response.results().isEmpty()) {
			throw new NotFoundException("indirizzo non trovato: " + query);
		}
		GoogleResponse.Location location = response.results().getFirst().location();
		String formattedAddress = response.results().getFirst().formattedAddress();
		// Google puo' rispondere con piu' decimali di quanti la colonna numeric(_,6) ne accetti:
		// si arrotonda qui, cosi' la risposta HTTP corrisponde sempre a quello che finisce a DB.
		BigDecimal latitude = location.latitude().setScale(6, RoundingMode.HALF_UP);
		BigDecimal longitude = location.longitude().setScale(6, RoundingMode.HALF_UP);

		GeocodeCacheEntry entry = cache.findByKindAndCacheKey(kind, key)
			.map(existing -> {
				existing.refresh(latitude, longitude, formattedAddress);
				return existing;
			})
			.orElseGet(() -> new GeocodeCacheEntry(kind, key, latitude, longitude, formattedAddress));
		cache.save(entry);

		return toResponse(entry);
	}

	private GeocodeResponse toResponse(GeocodeCacheEntry entry) {
		return new GeocodeResponse(entry.getLatitude(), entry.getLongitude(), entry.getFormattedAddress());
	}

	private String normalizeAddress(String address) {
		return address.strip().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
	}

	private String normalizeCoordinates(BigDecimal latitude, BigDecimal longitude) {
		return latitude.setScale(6, RoundingMode.HALF_UP).toPlainString()
			+ "," + longitude.setScale(6, RoundingMode.HALF_UP).toPlainString();
	}

	private GoogleResponse call(java.util.function.Supplier<GoogleResponse> invocation, String query) {
		try {
			return invocation.get();
		} catch (RestClientResponseException e) {
			throw new BadRequestException("geocoding non riuscito per [" + query + "]: " + e.getMessage());
		} catch (RestClientException e) {
			throw new BadRequestException("servizio di geocoding non raggiungibile: " + e.getMessage());
		}
	}

	/** Mappatura minimale della risposta v4: camelCase, nessun campo "status" (l'esito sta nello status HTTP). */
	@JsonIgnoreProperties(ignoreUnknown = true)
	private record GoogleResponse(List<Result> results) {

		@JsonIgnoreProperties(ignoreUnknown = true)
		private record Result(Location location, String formattedAddress) {
		}

		@JsonIgnoreProperties(ignoreUnknown = true)
		private record Location(BigDecimal latitude, BigDecimal longitude) {
		}
	}

}
