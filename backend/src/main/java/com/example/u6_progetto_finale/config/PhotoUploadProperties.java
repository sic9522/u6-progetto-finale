package com.example.u6_progetto_finale.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.uploads.photos")
public record PhotoUploadProperties(

		/** Cartella dove vengono salvate le foto, relativa alla working directory del backend. */
		String dir,

		/** Numero massimo di foto per post. */
		int maxFiles,

		/** Dimensione massima di una singola foto. */
		long maxFileSizeBytes) {
}
