package com.example.u6_progetto_finale.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;

import org.springframework.web.multipart.MultipartFile;

/** Letture comuni a chi riceve un MultipartFile, usate sia per le foto sia per i documenti. */
final class MultipartFiles {

	private MultipartFiles() {
	}

	static byte[] readBytes(MultipartFile file) {
		try {
			return file.getBytes();
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

	/** Il nome scelto dall'utente puo' contenere percorsi: si tiene solo l'ultima parte. */
	static String safeName(String originalFilename) {
		if (originalFilename == null || originalFilename.isBlank()) {
			return "senza-nome";
		}
		return Path.of(originalFilename.replace('\\', '/')).getFileName().toString();
	}

}
