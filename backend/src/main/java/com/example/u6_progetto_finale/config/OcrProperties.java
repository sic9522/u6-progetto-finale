package com.example.u6_progetto_finale.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ocr")
public record OcrProperties(

		/** Cartella con i file .traineddata di Tesseract. */
		String tessdataPath,

		/** Lingua di default: "eng", oppure "ita+eng" per piu' lingue insieme. */
		String language) {
}
