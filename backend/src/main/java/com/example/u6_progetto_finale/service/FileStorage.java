package com.example.u6_progetto_finale.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.stereotype.Component;

/** Scrive contenuti su disco con un nome generato, creando la cartella di destinazione se manca. */
@Component
public class FileStorage {

	public String save(Path directory, byte[] content, String extension) {
		try {
			Files.createDirectories(directory);
			String key = UUID.randomUUID() + extension;
			Files.write(directory.resolve(key), content);
			return key;
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

}
