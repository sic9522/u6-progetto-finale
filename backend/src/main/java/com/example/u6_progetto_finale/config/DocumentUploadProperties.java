package com.example.u6_progetto_finale.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.uploads.documents")
public record DocumentUploadProperties(

		/** Cartella dove vengono salvati i documenti, relativa alla working directory del backend. */
		String dir,

		/** Dimensione massima di un documento. */
		long maxFileSizeBytes) {
}
