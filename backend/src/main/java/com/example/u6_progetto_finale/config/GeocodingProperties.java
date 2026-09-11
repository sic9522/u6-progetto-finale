package com.example.u6_progetto_finale.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.google.geocoding")
public record GeocodingProperties(

		/** Chiave usata solo dal server, mai esposta al frontend. */
		String apiKey,

		String language,

		String region,

		/** Per quanto tempo una geocodifica resta valida prima di richiamare Google. */
		Duration cacheTtl) {
}
